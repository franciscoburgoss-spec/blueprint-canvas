import { useProjectStore } from '../store/projectStore';
import { Folder, FileText, ChevronRight, ChevronDown, Check, Trash2, GripVertical } from 'lucide-react';
import { useState } from 'react';
import { DropZone } from './DropZone';
import type { Project } from '../types';

interface DragData {
  type: 'project' | 'document';
  name: string;
  id: string;
  projectName?: string;
}

export const ProjectTree: React.FC = () => {
  const { 
    projects, 
    activeProjectId, 
    activeDocumentId, 
    loadDocument, 
    useProject, 
    deleteProject, 
    deleteDocument 
  } = useProjectStore();
  
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [, setDraggedItem] = useState<DragData | null>(null);

  const toggleProject = (projectId: string) => {
    setExpanded(prev => ({ ...prev, [projectId]: !prev[projectId] }));
  };

  const handleProjectClick = (project: Project, e: React.MouseEvent) => {
    if (e.target instanceof Element && e.target.closest('button[title*="Eliminar"]')) return;
    if (project.id !== activeProjectId) {
      useProject(project.name);
    }
    toggleProject(project.id);
  };

  const handleDeleteProject = (e: React.MouseEvent, projectName: string) => {
    e.stopPropagation();
    if (confirm(`¿Eliminar proyecto "${projectName}"? Esta acción es irreversible.`)) {
      deleteProject(projectName);
    }
  };

  const handleDeleteDocument = (e: React.MouseEvent, docName: string) => {
    e.stopPropagation();
    if (confirm(`¿Eliminar documento "${docName}"? Esta acción es irreversible.`)) {
      deleteDocument(docName);
    }
  };

  const handleDragStart = (e: React.DragEvent, item: DragData) => {
    setDraggedItem(item);
    e.dataTransfer.setData('application/json', JSON.stringify(item));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  return (
    <div className="w-64 h-full border-r border-blueprint-grid/20 p-4 overflow-hidden flex flex-col">
      <div className="text-blueprint-grid font-mono text-xs mb-4 uppercase tracking-wider flex-shrink-0">
        Proyectos
      </div>
      
      <div className="flex-1 overflow-y-auto">
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
                  <div
                    onClick={(e) => handleProjectClick(project, e)}
                    draggable
                    onDragStart={(e) => handleDragStart(e, { type: 'project', name: project.name, id: project.id })}
                    onDragEnd={handleDragEnd}
                    className={`group w-full flex items-center gap-2 p-2 rounded text-left transition-all cursor-move ${
                      isActive
                        ? 'bg-blueprint-grid/15 border-l-2 border-blueprint-grid shadow-sm'
                        : 'hover:bg-blueprint-grid/5'
                    }`}
                    title={`${project.name} (${project.documents.length} docs)`}
                  >
                    <GripVertical size={10} className="text-current/30 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
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
                      <span title="Activo"><Check size={12} className="text-blueprint-grid flex-shrink-0" /></span>
                    )}
                    <button
                      onClick={(e) => handleDeleteProject(e, project.name)}
                      className="text-red-400/50 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                      title={`Eliminar ${project.name}`}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  
                  {isExpanded && (
                    <ul className="ml-6 mt-1 space-y-1">
                      {project.documents.map((doc) => (
                        <li key={doc.id}>
                          <div
                            draggable
                            onDragStart={(e) => handleDragStart(e, { type: 'document', name: doc.name, id: doc.id, projectName: project.name })}
                            onDragEnd={handleDragEnd}
                            onClick={() => loadDocument(doc.name, doc.discipline)}
                            className={`group/item flex items-center gap-2 p-1.5 rounded text-left text-xs transition-colors cursor-move ${
                              activeDocumentId === doc.id
                                ? 'bg-blueprint-critical/10 text-blueprint-critical'
                                : 'hover:bg-blueprint-grid/5 text-current/80'
                            }`}
                            title={`${doc.name} [${doc.discipline}] - ${doc.observations.length} obs`}
                          >
                            <GripVertical size={8} className="text-current/30 opacity-0 group-hover/item:opacity-100 transition-opacity flex-shrink-0" />
                            <FileText size={12} />
                            <span className="font-mono truncate flex-1">{doc.name}</span>
                            <span className="text-current/40 text-[10px]">
                              {doc.observations.length}
                            </span>
                            <button
                              onClick={(e) => handleDeleteDocument(e, doc.name)}
                              className="text-red-400/50 hover:text-red-400 opacity-0 group-hover/item:opacity-100 transition-opacity flex-shrink-0"
                              title={`Eliminar ${doc.name}`}
                            >
                              <Trash2 size={10} />
                            </button>
                          </div>
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

      <DropZone />
    </div>
  );
};
