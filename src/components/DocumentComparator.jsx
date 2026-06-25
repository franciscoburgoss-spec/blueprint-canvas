import { useProjectStore } from '../store/projectStore';
import { X, FileText } from 'lucide-react';

export const DocumentComparator = ({ onClose }) => {
  const { projects, activeProjectId } = useProjectStore();
  
  const activeProject = projects.find(p => p.id === activeProjectId);
  const documents = activeProject?.documents || [];

  if (documents.length < 2) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <div className="bg-blueprint-panel border border-blueprint-grid/30 rounded p-6 max-w-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-blueprint-grid font-mono text-sm">Comparador de Documentos</h3>
            <button onClick={onClose} className="text-current/60 hover:text-current">
              <X size={16} />
            </button>
          </div>
          <p className="text-sm text-current/80">
            Necesitas al menos 2 documentos para comparar.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-blueprint-panel border border-blueprint-grid/30 rounded p-6 max-w-6xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-blueprint-grid font-mono text-sm">Comparador de Documentos</h3>
          <button onClick={onClose} className="text-current/60 hover:text-current">
            <X size={16} />
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {documents.map((doc) => (
            <div key={doc.id} className="border border-blueprint-grid/20 rounded p-4">
              <div className="flex items-center gap-2 mb-3">
                <FileText size={14} className="text-blueprint-grid" />
                <span className="font-mono text-sm text-blueprint-grid">{doc.name}</span>
                <span className="text-xs text-current/60">[{doc.discipline}]</span>
              </div>
              
              <div className="space-y-2">
                <div className="text-xs text-current/60 font-mono">
                  Observaciones: {doc.observations.length}
                </div>
                <div className="text-xs text-current/60 font-mono">
                  Notas: {doc.notes.length}
                </div>
                
                {doc.observations.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {doc.observations.map((obs) => (
                      <div 
                        key={obs.id}
                        className="text-xs p-2 border-l-2 border-blueprint-critical/30 bg-blueprint-critical/5 rounded"
                      >
                        <div className="font-mono text-[10px] text-blueprint-critical/60">
                          {obs.id} [{obs.status}]
                        </div>
                        <div className="text-current/80 mt-1">{obs.text}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
