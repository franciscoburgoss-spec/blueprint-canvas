import { useProjectStore } from '../store/projectStore';
import { Folder, FileText, ChevronRight, ChevronDown, Check } from 'lucide-react';
import { useState } from 'react';

export const ProjectTree = () => {
  const { projects, activeProjectId, activeDocumentId, loadDocument, useProject } = useProjectStore();
  const [expanded, setExpanded] = useState({});

  const toggleProject = (projectId) => {
    setExpanded(prev => ({ ...prev, [projectId]: !prev[projectId] }));
  };

  const handleProjectClick = (project) => {
    // Si no está activo, cambiar a ese proyecto
    if (project.id !== activeProjectId) {
      useProject(project.name);
    }
    // Toggle expansión
    toggleProject(project.id);
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
          {projects.map((project) => {
            const isActive = project.id === activeProjectId;
            const isExpanded = expanded[project.id];
            
            return (
              <li key={project.id}>
                <button
                  onClick={() => handleProjectClick(project)}
                  className={`w-full flex items-center gap-2 p-2 rounded text-left transition-all ${
                    isActive
                      ? 'bg-blueprint-grid/15 border-l-2 border-blueprint-grid shadow-sm'
                      : 'hover:bg-blueprint-grid/5'
                  }`}
                  title={isActive ? 'Proyecto activo' : `Cambiar a ${project.name}`}
                >
                  {isExpanded ? (
                    <ChevronDown size={14} className="text-blueprint-grid flex-shrink-0" />
                  ) : (
                    <ChevronRight size={14} className="text-blueprint-grid flex-shrink-0" />
                  )}
                  <Folder size={14} className={`${isActive ? 'text-blueprint-grid' : 'text-blueprint-grid/70'} flex-shrink-0`} />
                  <span className={`font-mono text-sm truncate flex-1 ${isActive ? 'text-current font-medium' : 'text-current/80'}`}>
                    {project.name}
                  </span>
                  {isActive && (
                    <Check size={12} className="text-blueprint-grid flex-shrink-0" title="Activo" />
                  )}
                </button>
                
                {isExpanded && (
                  <ul className="ml-6 mt-1 space-y-1">
                    {project.documents.map((doc) => (
                      <li key={doc.id}>
                        <button
                          onClick={() => loadDocument(doc.name, doc.discipline)}
                          className={`w-full flex items-center gap-2 p-1.5 rounded text-left text-xs transition-colors ${
                            activeDocumentId === doc.id
                              ? 'bg-blueprint-critical/10 text-blueprint-critical'
                              : 'hover:bg-blueprint-grid/5 text-current/80'
                          }`}
                        >
                          <FileText size={12} />
                          <span className="font-mono truncate flex-1">{doc.name}</span>
                          <span className="text-current/40 text-[10px]">
                            {doc.observations.length}
                          </span>
                        </button>
                      </li>
                    ))}
                    {project.documents.length === 0 && (
                      <li className="text-current/40 text-xs font-mono italic pl-2">
                        Sin documentos
                      </li>
                    )}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
