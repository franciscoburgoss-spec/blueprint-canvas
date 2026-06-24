import { useProjectStore } from '../store/projectStore';
import { Folder, FileText, ChevronRight, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export const ProjectTree = () => {
  const { projects, activeProjectId, activeDocumentId, loadDocument } = useProjectStore();
  const [expanded, setExpanded] = useState({});

  const toggleProject = (projectId) => {
    setExpanded(prev => ({ ...prev, [projectId]: !prev[projectId] }));
  };

  return (
    <div className="w-64 h-full border-r border-blueprint-grid/20 p-4 overflow-y-auto">
      <div className="text-blueprint-grid font-mono text-xs mb-4 uppercase tracking-wider">
        Proyectos
      </div>
      
      {projects.length === 0 ? (
        <div className="text-current/40 text-sm font-mono">
          No hay proyectos.
          <br />
          Usa: /create project
        </div>
      ) : (
        <ul className="space-y-1">
          {projects.map((project) => (
            <li key={project.id}>
              <button
                onClick={() => toggleProject(project.id)}
                className={`w-full flex items-center gap-2 p-2 rounded text-left transition-colors ${
                  activeProjectId === project.id
                    ? 'bg-blueprint-grid/10 border-l-2 border-blueprint-grid'
                    : 'hover:bg-blueprint-grid/5'
                }`}
              >
                {expanded[project.id] ? (
                  <ChevronDown size={14} className="text-blueprint-grid" />
                ) : (
                  <ChevronRight size={14} className="text-blueprint-grid" />
                )}
                <Folder size={14} className="text-blueprint-grid" />
                <span className="font-mono text-sm truncate">{project.name}</span>
              </button>
              
              {expanded[project.id] && (
                <ul className="ml-6 mt-1 space-y-1">
                  {project.documents.map((doc) => (
                    <li key={doc.id}>
                      <button
                        onClick={() => loadDocument(doc.name, doc.discipline)}
                        className={`w-full flex items-center gap-2 p-1.5 rounded text-left text-xs ${
                          activeDocumentId === doc.id
                            ? 'bg-blueprint-critical/10 text-blueprint-critical'
                            : 'hover:bg-blueprint-grid/5'
                        }`}
                      >
                        <FileText size={12} />
                        <span className="font-mono truncate">{doc.name}</span>
                        <span className="ml-auto text-current/40">
                          {doc.observations.length}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
