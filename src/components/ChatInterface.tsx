import { useProjectStore } from '../store/projectStore';
import { CommandInput } from './CommandInput';
import { MessageSquare, User } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import type { Annotation, CommandHistoryEntry } from '../types';

type Message = 
  | (CommandHistoryEntry & { messageType: 'command' })
  | (Annotation & { messageType: 'annotation' });

export const ChatInterface: React.FC<{
  onShowComparator?: () => void;
  onShowDocs?: () => void;
}> = ({ onShowComparator, onShowDocs }) => {
  const { annotations, commandHistory, activeProjectId, activeDocumentId, projects } = useProjectStore();
  const [editingCommand, setEditingCommand] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [isNoteDragOver, setIsNoteDragOver] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const activeProject = projects.find(p => p.id === activeProjectId);
  const activeDoc = activeProject?.documents.find(d => d.id === activeDocumentId);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [commandHistory, annotations]);

  const handleCommandClick = (command: string) => {
    setEditingCommand(command);
  };

  const clearEditingCommand = () => {
    setEditingCommand('');
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleNoteDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const data = e.dataTransfer.types.includes('application/note');
    if (data) {
      setIsNoteDragOver(true);
    }
  };

  const handleNoteDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsNoteDragOver(false);
  };

  const handleNoteDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsNoteDragOver(false);

    try {
      const noteData = e.dataTransfer.getData('application/note');
      if (noteData) {
        const note = JSON.parse(noteData);
        const store = useProjectStore.getState();
        const activeProject = store.projects.find(p => p.id === store.activeProjectId);
        const activeDoc = activeProject?.documents.find(d => d.id === store.activeDocumentId);
        
        if (activeDoc) {
          store.addObservation(
            activeDoc.name,
            'Observación Propia',
            note.text,
            'Convertida desde nota'
          );
        } else {
          useProjectStore.setState((state) => ({
            annotations: [...state.annotations, {
              id: Date.now(),
              type: 'error',
              message: '[ERROR] No hay documento activo. Carga un documento primero con /doc',
              timestamp: Date.now()
            }]
          }));
        }
      }
    } catch (error) {
      console.error('Error al procesar nota:', error);
    }
  };

  const allMessages: Message[] = [
    ...commandHistory.map(cmd => ({ ...cmd, messageType: 'command' as const })),
    ...annotations.map(ann => ({ ...ann, messageType: 'annotation' as const })),
  ].sort((a, b) => a.timestamp - b.timestamp);

  return (
    <div 
      className={`flex-1 flex flex-col h-full border-r border-blueprint-grid/20 transition-colors ${
        isDragOver ? 'bg-blueprint-grid/5' : ''
      } ${
        isNoteDragOver ? 'bg-blueprint-critical/5 border-blueprint-critical/40' : ''
      }`}
      onDragOver={(e) => { handleDragOver(e); handleNoteDragOver(e); }}
      onDragLeave={(e) => { handleDragLeave(); handleNoteDragLeave(e); }}
      onDrop={(e) => { handleDrop(e); handleNoteDrop(e); }}
    >
      {/* Header */}
      <div className="p-4 border-b border-blueprint-grid/20 bg-blueprint-panel/30">
        <div className="flex items-center gap-2 text-xs font-mono">
          <MessageSquare size={14} className="text-blueprint-grid" />
          {activeProject ? (
            <>
              <span className="text-blueprint-grid font-medium">
                {activeProject.name}
              </span>
              <span className="text-current/40">·</span>
              <span className="text-current/60">
                {activeProject.documents.length} docs
              </span>
              {activeDoc && (
                <>
                  <span className="text-current/40">›</span>
                  <span className="text-blueprint-critical">{activeDoc.name}</span>
                </>
              )}
            </>
          ) : (
            <span className="text-current/50 italic">SIN PROYECTO ACTIVO</span>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {allMessages.length === 0 ? (
          <div className="text-current/40 text-sm font-mono text-center mt-8">
            Esperando comandos...
            <br />
            <span className="text-xs">Escribe /help para ver los comandos disponibles</span>
          </div>
        ) : (
          allMessages.map((message) => {
            if (message.messageType === 'command') {
              return (
                <div
                  key={`cmd-${message.id}`}
                  className="flex items-start gap-2 cursor-pointer hover:bg-blueprint-grid/5 p-2 rounded transition-colors"
                  onClick={() => handleCommandClick(message.command)}
                  title="Click para editar este comando"
                >
                  <User size={14} className="text-blueprint-grid mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-mono text-sm text-current">
                      {message.command}
                    </div>
                    <div className="text-xs text-current/40 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              );
            } else {
              return (
                <div
                  key={`ann-${message.id}`}
                  className={`annotation ${
                    message.type === 'success'
                      ? 'border-blueprint-critical text-blueprint-critical'
                      : message.type === 'error'
                      ? 'border-red-500 text-red-500'
                      : 'border-blueprint-grid text-blueprint-grid'
                  }`}
                >
                  {message.message}
                </div>
              );
            }
          })
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-blueprint-grid/20">
        <CommandInput 
          editingCommand={editingCommand}
          onClearEditing={clearEditingCommand}
          onShowComparator={onShowComparator}
          onShowDocs={onShowDocs}
        />
      </div>
    </div>
  );
};
