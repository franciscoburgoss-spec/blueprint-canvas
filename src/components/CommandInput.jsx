import { useState, useEffect, useRef, useMemo } from 'react';
import { parseCommand, getHelpText } from '../utils/parser';
import { getSuggestions } from '../utils/autocomplete';
import { AutocompleteSuggestions } from './AutocompleteSuggestions';
import { exportToMarkdown, exportToJSON, downloadFile } from '../utils/exporter';
import { useProjectStore } from '../store/projectStore';
import { useKeyboardShortcuts, SHORTCUTS } from '../hooks/useKeyboardShortcuts';
import { Terminal, Keyboard } from 'lucide-react';

export const CommandInput = ({ editingCommand, onClearEditing, onShowComparator, onShowDocs }) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [suggestionIndex, setSuggestionIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  
  const store = useProjectStore();

  // Obtener sugerencias basadas en el input actual
  const suggestions = useMemo(() => {
    if (!showSuggestions) return [];
    return getSuggestions(input, {
      projects: store.projects,
      activeProjectId: store.activeProjectId,
      activeDocumentId: store.activeDocumentId,
    });
  }, [input, showSuggestions, store.projects, store.activeProjectId, store.activeDocumentId]);

  // Resetear índice de sugerencia cuando cambian las sugerencias
  useEffect(() => {
    setSuggestionIndex(-1);
  }, [suggestions]);

  const shortcutCallbacks = {
    executeCommand: (commandText) => {
      setInput(commandText);
      setTimeout(() => {
        const form = inputRef.current?.form;
        if (form) {
          const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
          form.dispatchEvent(submitEvent);
        }
      }, 0);
    },
    focusInput: () => inputRef.current?.focus(),
    setInput: (text) => setInput(text),
    clearInput: () => { setInput(''); inputRef.current?.blur(); },
  };

  useKeyboardShortcuts(shortcutCallbacks);

  useEffect(() => {
    if (editingCommand) {
      setInput(editingCommand);
      onClearEditing();
    }
  }, [editingCommand, onClearEditing]);

  const applySuggestion = (suggestion) => {
    setInput(suggestion.insertText);
    setShowSuggestions(false);
    setSuggestionIndex(-1);
    inputRef.current?.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Si hay sugerencias y una está seleccionada, aplicarla
    if (showSuggestions && suggestionIndex >= 0 && suggestions[suggestionIndex]) {
      applySuggestion(suggestions[suggestionIndex]);
      return;
    }

    setShowSuggestions(false);
    store.addCommandToHistory(input);
    const result = parseCommand(input);
    
    switch (result.type) {
            case 'USE_PROJECT': store.useProject(result.name); break;
      case 'CURRENT': handleCurrent(); break;
      case 'CREATE_PROJECT': store.createProject(result.name); break;
      case 'LOAD_DOCUMENT': store.loadDocument(result.docName, result.discipline); break;
      case 'ADD_OBSERVATION': store.addObservation(result.docName, result.obsType, result.text, result.source); break;
      case 'EDIT_OBSERVATION': store.editObservation(result.id, result.newText); break;
      case 'PROJECT_NOTE': store.addProjectNote(result.text); break;
      case 'DOCUMENT_NOTE': store.addDocumentNote(result.text); break;
      case 'HELP':
        useProjectStore.setState((state) => ({
          annotations: [...state.annotations, { id: Date.now(), type: 'info', message: getHelpText(), timestamp: Date.now() }]
        }));
        break;
      case 'LIST': handleList(result.itemType); break;
      case 'DELETE': handleDelete(result.itemType, result.itemName); break;
      case 'APPROVE': store.approveObservation(result.obsId); break;
      case 'REJECT': store.rejectObservation(result.obsId); break;
      case 'EXPORT': handleExport(result.format); break;
      case 'CLEAR': store.clearHistory(); break;
      case 'STATUS': handleStatus(); break;
      case 'SEARCH': store.searchObservations(result.query); break;
      case 'FILTER': store.filterObservations(result.filterType, result.filterValue); break;
      case 'TAG': store.tagObservation(result.obsId, result.tag); break;
      case 'PRIORITY': store.setPriority(result.obsId, result.priority); break;
      case 'COMMENT': store.addComment(result.obsId, result.comment); break;
      case 'IMPORT': handleImport(result.jsonData); break;
      case 'REVIEW': handleReview(); break;
      case 'TIMELINE': handleTimeline(); break;
      case 'COMPARE': if (onShowComparator) onShowComparator(); break;
      case 'DOCS': if (onShowDocs) onShowDocs(); break;
      case 'SHORTCUTS':
        useProjectStore.setState((state) => ({
          annotations: [...state.annotations, { id: Date.now(), type: 'info', message: `ATAJOS:\n${SHORTCUTS.map(s => `  ${s.keys.padEnd(15)} ${s.description}`).join('\n')}`, timestamp: Date.now() }]
        }));
        break;
      default:
        useProjectStore.setState((state) => ({
          annotations: [...state.annotations, { id: Date.now(), type: 'error', message: `[ERROR] ${result.error}`, timestamp: Date.now() }]
        }));
    }

    setHistory([...history, input]);
    setHistoryIndex(-1);
    setInput('');
  };

  const handleList = (itemType) => {
    const project = store.projects.find(p => p.id === store.activeProjectId);
    if (!project && itemType !== 'projects') {
      useProjectStore.setState((state) => ({ annotations: [...state.annotations, { id: Date.now(), type: 'error', message: `[ERROR] No hay proyecto activo`, timestamp: Date.now() }] }));
      return;
    }

    let message = '';
    if (itemType === 'projects') {
      message = `PROYECTOS:\n${store.projects.map(p => `  - ${p.name} (${p.documents.length} docs, ${p.notes.length} notas)`).join('\n')}`;
    } else if (itemType === 'docs') {
      message = `DOCUMENTOS:\n${project.documents.map(d => `  - ${d.name} [${d.discipline}] (${d.observations.length} obs)`).join('\n')}`;
    } else if (itemType === 'obs') {
      const allObs = [];
      project.documents.forEach(doc => doc.observations.forEach(obs => allObs.push(`  - ${obs.id} [${obs.type}] ${obs.text.substring(0, 50)}... (${obs.status})`)));
      message = `OBSERVACIONES:\n${allObs.join('\n') || '  Sin observaciones'}`;
    } else if (itemType === 'notes') {
      const activeDoc = project.documents.find(d => d.id === store.activeDocumentId);
      message = `NOTAS DEL PROYECTO:\n${project.notes.map(n => `  - ${n.text}`).join('\n') || '  Sin notas'}\n\nNOTAS DEL DOCUMENTO${activeDoc ? ` (${activeDoc.name})` : ''}:\n${activeDoc ? activeDoc.notes.map(n => `  - ${n.text}`).join('\n') || '  Sin notas' : '  (Sin documento activo)'}`;
    }

    useProjectStore.setState((state) => ({ annotations: [...state.annotations, { id: Date.now(), type: 'info', message, timestamp: Date.now() }] }));
  };

  const handleDelete = (itemType, itemName) => {
    if (itemType === 'project') store.deleteProject(itemName.replace(/"/g, ''));
    else if (itemType === 'doc') store.deleteDocument(itemName);
    else if (itemType === 'obs') store.deleteObservation(itemName);
  };

  const handleExport = (format) => {
    const project = store.projects.find(p => p.id === store.activeProjectId);
    if (!project) {
      useProjectStore.setState((state) => ({ 
        annotations: [...state.annotations, { 
          id: Date.now(), 
          type: 'error', 
          message: '[ERROR] No hay proyecto activo. Usa /create project primero', 
          timestamp: Date.now() 
        }] 
      }));
      return;
    }

    if (format === 'markdown') {
      try {
        const content = exportToMarkdown(project);
        downloadFile(content, `${project.name.replace(/[^a-z0-9]/gi, '_')}_informe.md`, 'text/markdown');
        useProjectStore.setState((state) => ({ 
          annotations: [...state.annotations, { 
            id: Date.now(), 
            type: 'success', 
            message: `[OK] Informe Markdown exportado: ${project.name.replace(/[^a-z0-9]/gi, '_')}_informe.md`, 
            timestamp: Date.now() 
          }] 
        }));
      } catch (error) {
        useProjectStore.setState((state) => ({ 
          annotations: [...state.annotations, { 
            id: Date.now(), 
            type: 'error', 
            message: `[ERROR] No se pudo exportar Markdown: ${error.message}`, 
            timestamp: Date.now() 
          }] 
        }));
      }
    } else if (format === 'json') {
      try {
        const content = exportToJSON(project);
        downloadFile(content, `${project.name.replace(/[^a-z0-9]/gi, '_')}_datos.json`, 'application/json');
        useProjectStore.setState((state) => ({ 
          annotations: [...state.annotations, { 
            id: Date.now(), 
            type: 'success', 
            message: `[OK] Datos JSON exportados: ${project.name.replace(/[^a-z0-9]/gi, '_')}_datos.json`, 
            timestamp: Date.now() 
          }] 
        }));
      } catch (error) {
        useProjectStore.setState((state) => ({ 
          annotations: [...state.annotations, { 
            id: Date.now(), 
            type: 'error', 
            message: `[ERROR] No se pudo exportar JSON: ${error.message}`, 
            timestamp: Date.now() 
          }] 
        }));
      }
    } else if (format === 'pdf') {
      try {
        import('../utils/pdfExporter').then(({ exportToPDF }) => {
          exportToPDF(project);
          useProjectStore.setState((state) => ({ 
            annotations: [...state.annotations, { 
              id: Date.now(), 
              type: 'success', 
              message: `[OK] Informe PDF generado: ${project.name.replace(/[^a-z0-9]/gi, '_')}_informe.pdf`, 
              timestamp: Date.now() 
            }] 
          }));
        }).catch(error => {
          useProjectStore.setState((state) => ({ 
            annotations: [...state.annotations, { 
              id: Date.now(), 
              type: 'error', 
              message: `[ERROR] No se pudo generar PDF: ${error.message}`, 
              timestamp: Date.now() 
            }] 
          }));
        });
      } catch (error) {
        useProjectStore.setState((state) => ({ 
          annotations: [...state.annotations, { 
            id: Date.now(), 
            type: 'error', 
            message: `[ERROR] No se pudo generar PDF: ${error.message}`, 
            timestamp: Date.now() 
          }] 
        }));
      }
    }
  };

  const handleImport = (jsonData) => {
    try {
      const data = JSON.parse(jsonData);
      if (data.name && data.documents) {
        useProjectStore.setState((state) => ({ projects: [...state.projects, data], activeProjectId: data.id }));
      }
    } catch (error) {
      useProjectStore.setState((state) => ({ annotations: [...state.annotations, { id: Date.now(), type: 'error', message: `[ERROR] Import fallido: ${error.message}`, timestamp: Date.now() }] }));
    }
  };

  const handleReview = () => {
    const project = store.projects.find(p => p.id === store.activeProjectId);
    if (!project) return;
    const pendingObs = [];
    project.documents.forEach(doc => doc.observations.forEach(obs => { if (obs.status === 'pendiente') pendingObs.push(obs); }));
    const message = `MODO REVISIÓN: ${pendingObs.length} pendientes\n${pendingObs.map(o => `  - ${o.id}: ${o.text}`).join('\n')}`;
    useProjectStore.setState((state) => ({ annotations: [...state.annotations, { id: Date.now(), type: 'info', message, timestamp: Date.now() }] }));
  };

  const handleTimeline = () => {
    if (store.timeline.length === 0) return;
    const message = `TIMELINE:\n${store.timeline.slice(-10).reverse().map(e => `[${new Date(e.timestamp).toLocaleTimeString()}] ${e.details}`).join('\n')}`;
    useProjectStore.setState((state) => ({ annotations: [...state.annotations, { id: Date.now(), type: 'info', message, timestamp: Date.now() }] }));
  };

  
  const handleCurrent = () => {
    const project = store.projects.find(p => p.id === store.activeProjectId);
    if (!project) {
      useProjectStore.setState((state) => ({ 
        annotations: [...state.annotations, { 
          id: Date.now(), 
          type: 'info', 
          message: '[INFO] No hay proyecto activo. Usa /create project o /use "nombre"', 
          timestamp: Date.now() 
        }] 
      }));
      return;
    }
    const totalObs = project.documents.reduce((sum, doc) => sum + doc.observations.length, 0);
    const approvedObs = project.documents.reduce((sum, doc) => sum + doc.observations.filter(o => o.status === 'aprobada').length, 0);
    const message = `PROYECTO ACTIVO: ${project.name}
  ID: ${project.id}
  Documentos: ${project.documents.length}
  Observaciones: ${totalObs} (${approvedObs} aprobadas)
  Notas del proyecto: ${project.notes.length}
  Creado: ${new Date(project.createdAt).toLocaleString()}`;
    useProjectStore.setState((state) => ({ 
      annotations: [...state.annotations, { 
        id: Date.now(), 
        type: 'info', 
        message, 
        timestamp: Date.now() 
      }] 
    }));
  };

  const handleStatus = () => {
    const project = store.projects.find(p => p.id === store.activeProjectId);
    if (!project) return;
    const totalObs = project.documents.reduce((sum, doc) => sum + doc.observations.length, 0);
    const message = `ESTADO: ${project.name}\nDocs: ${project.documents.length}\nObs: ${totalObs}\nNotas Proyecto: ${project.notes.length}`;
    useProjectStore.setState((state) => ({ annotations: [...state.annotations, { id: Date.now(), type: 'info', message, timestamp: Date.now() }] }));
  };

  const handleKeyDown = (e) => {
    // Navegación de sugerencias
    if (showSuggestions && suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSuggestionIndex(prev => (prev + 1) % suggestions.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSuggestionIndex(prev => prev <= 0 ? suggestions.length - 1 : prev - 1);
        return;
      }
      if (e.key === 'Tab') {
        e.preventDefault();
        const idx = suggestionIndex >= 0 ? suggestionIndex : 0;
        applySuggestion(suggestions[idx]);
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setShowSuggestions(false);
        setSuggestionIndex(-1);
        return;
      }
    }

    // Historial de comandos (solo si no hay sugerencias)
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (history.length > 0) {
          const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
          setHistoryIndex(newIndex);
          setInput(history[newIndex]);
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex !== -1) {
          const newIndex = historyIndex + 1;
          if (newIndex >= history.length) {
            setHistoryIndex(-1);
            setInput('');
          } else {
            setHistoryIndex(newIndex);
            setInput(history[newIndex]);
          }
        }
      }
    }
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInput(newValue);
    
    // Mostrar sugerencias solo si empieza con /
    if (newValue.startsWith('/')) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      {showSuggestions && suggestions.length > 0 && (
        <AutocompleteSuggestions
          suggestions={suggestions}
          selectedIndex={suggestionIndex}
          onSelect={applySuggestion}
        />
      )}
      <div className="flex items-center gap-2 p-3 bg-blueprint-panel/50 border border-blueprint-grid/20 rounded">
        <Terminal size={16} className="text-blueprint-grid" />
        <span className="text-blueprint-grid font-mono">&gt;</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder='/create project "Mi Proyecto"'
          className="flex-1 bg-transparent border-none outline-none font-mono text-sm text-current placeholder-current/40"
          autoFocus
          autoComplete="off"
          spellCheck="false"
        />
        <button
          type="button"
          onClick={() => {
            useProjectStore.setState((state) => ({
              annotations: [...state.annotations, { id: Date.now(), type: 'info', message: `ATAJOS:\n${SHORTCUTS.map(s => `  ${s.keys.padEnd(15)} ${s.description}`).join('\n')}`, timestamp: Date.now() }]
            }));
          }}
          className="text-blueprint-grid/60 hover:text-blueprint-grid transition-colors"
          title="Ver atajos de teclado"
        >
          <Keyboard size={16} />
        </button>
      </div>
      <div className="mt-2 text-xs font-mono text-current/60">
        / para comandos · Tab para completar · ↑↓ para navegar
      </div>
    </form>
  );
};
