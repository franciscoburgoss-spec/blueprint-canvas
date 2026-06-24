import { useProjectStore } from '../store/projectStore';
import { StickyNote, GripVertical } from 'lucide-react';
import { useState } from 'react';

export const NotesPanel = () => {
  const { activeProjectId, activeDocumentId, projects } = useProjectStore();
  const [draggedNote, setDraggedNote] = useState(null);
  
  const activeProject = projects.find(p => p.id === activeProjectId);
  const activeDoc = activeProject?.documents.find(d => d.id === activeDocumentId);
  const notes = activeDoc?.notes || [];

  const handleDragStart = (note) => {
    setDraggedNote(note);
  };

  const handleDragEnd = () => {
    setDraggedNote(null);
  };

  return (
    <div className="w-64 h-full p-4 overflow-y-auto border-l border-blueprint-grid/20">
      <div className="text-blueprint-grid font-mono text-xs mb-4 uppercase tracking-wider flex items-center gap-2">
        <StickyNote size={14} />
        Notas {activeDoc ? `(${notes.length})` : ''}
      </div>
      
      {!activeDoc ? (
        <div className="text-current/40 text-sm font-mono">
          Sin documento activo.
          <br />
          Usa: /doc NOMBRE
        </div>
      ) : notes.length === 0 ? (
        <div className="text-current/40 text-sm font-mono">
          Sin notas para este documento.
          <br />
          Usa: /note "texto"
        </div>
      ) : (
        <div className="space-y-2">
          {notes.map((note) => (
            <div
              key={note.id}
              draggable
              onDragStart={() => handleDragStart(note)}
              onDragEnd={handleDragEnd}
              className="p-3 bg-blueprint-critical/5 border border-blueprint-critical/20 rounded text-sm cursor-move hover:bg-blueprint-critical/10 transition-colors"
            >
              <div className="flex items-start gap-2">
                <GripVertical size={12} className="text-blueprint-critical/60 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-mono text-xs text-blueprint-critical/60 mb-1">
                    {new Date(note.createdAt).toLocaleTimeString()}
                  </div>
                  <div>{note.text}</div>
                </div>
              </div>
              <div className="text-[10px] text-current/40 mt-2 font-mono">
                Arrastra al chat para convertir en observación
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
