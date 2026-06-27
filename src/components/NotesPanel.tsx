import { useProjectStore } from '../store/projectStore';
import { StickyNote, FileText, GripVertical } from 'lucide-react';
import type { Note } from '../types';

export const NotesPanel: React.FC = () => {
  const { activeProjectId, activeDocumentId, projects } = useProjectStore();
  
  const activeProject = projects.find(p => p.id === activeProjectId);
  const activeDoc = activeProject?.documents.find(d => d.id === activeDocumentId);
  
  const projectNotes = activeProject?.notes || [];
  const documentNotes = activeDoc?.notes || [];

  const handleNoteDragStart = (e: React.DragEvent<HTMLDivElement>, note: Note) => {
    e.dataTransfer.setData('application/note', JSON.stringify(note));
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-72 h-full p-4 overflow-y-auto border-l border-blueprint-grid/20 bg-blueprint-panel/20">
      
      {/* Sección 1: Notas del Proyecto */}
      <div className="mb-6">
        <div className="text-blueprint-grid font-mono text-xs mb-3 uppercase tracking-wider flex items-center gap-2 border-b border-blueprint-grid/20 pb-2">
          <StickyNote size={14} />
          Notas del Proyecto ({projectNotes.length})
        </div>
        
        {!activeProject ? (
          <div className="text-current/40 text-xs font-mono italic">
            Sin proyecto activo
          </div>
        ) : projectNotes.length === 0 ? (
          <div className="text-current/40 text-xs font-mono italic">
            Sin notas. Usa: /note "texto"
          </div>
        ) : (
          <div className="space-y-2">
            {projectNotes.map((note) => (
              <div
                key={note.id}
                className="p-2 bg-blueprint-grid/5 border border-blueprint-grid/20 rounded text-xs"
              >
                <div className="font-mono text-[10px] text-blueprint-grid/60 mb-1">
                  {new Date(note.createdAt).toLocaleTimeString()}
                </div>
                <div className="text-current/90">{note.text}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sección 2: Notas del Documento */}
      <div>
        <div className="text-blueprint-critical font-mono text-xs mb-3 uppercase tracking-wider flex items-center gap-2 border-b border-blueprint-critical/20 pb-2">
          <FileText size={14} />
          Notas del Documento ({documentNotes.length})
        </div>
        
        {!activeDoc ? (
          <div className="text-current/40 text-xs font-mono italic">
            Sin documento activo
          </div>
        ) : documentNotes.length === 0 ? (
          <div className="text-current/40 text-xs font-mono italic">
            Sin notas. Usa: /doc-note "texto"
          </div>
        ) : (
          <div className="space-y-2">
            {documentNotes.map((note) => (
              <div
                key={note.id}
                draggable
                onDragStart={(e) => handleNoteDragStart(e, note)}
                className="p-2 bg-blueprint-critical/5 border border-blueprint-critical/20 rounded text-xs cursor-move hover:bg-blueprint-critical/10 transition-colors"
              >
                <div className="flex items-start gap-2">
                  <GripVertical size={10} className="text-blueprint-critical/60 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-mono text-[10px] text-blueprint-critical/60 mb-1">
                      {new Date(note.createdAt).toLocaleTimeString()}
                    </div>
                    <div className="text-current/90">{note.text}</div>
                  </div>
                </div>
                <div className="text-[9px] text-current/40 mt-1 font-mono text-right">
                  Arrastra al chat →
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
