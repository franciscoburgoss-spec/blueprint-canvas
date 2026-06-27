import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateObservationId } from '../utils/parser';
import type {
  Project,
  Document,
  Observation,
  Note,
  Annotation,
  TimelineEvent,
  Priority,
  ObservationType,
} from '../types';

// ============================================
// CONTADORES GLOBALES PARA IDs ÚNICOS
// ============================================

let timelineCounter = 0;
let noteCounter = 0;
let docCounter = 0;
let projectCounter = 0;

const generateTimelineId = (): string => {
  timelineCounter++;
  return `TL-${Date.now()}-${timelineCounter}`;
};

const generateNoteId = (): string => {
  noteCounter++;
  return `NOTE-${Date.now().toString(36).toUpperCase()}-${noteCounter}`;
};

const generateDocId = (): string => {
  docCounter++;
  return `DOC-${Date.now().toString(36).toUpperCase()}-${docCounter}`;
};

const generateProjectId = (): string => {
  projectCounter++;
  return `PROJ-${Date.now().toString(36).toUpperCase()}-${projectCounter}`;
};

// ============================================
// INTERFAZ DEL STORE
// ============================================

interface ProjectState {
  projects: Project[];
  activeProjectId: string | null;
  activeDocumentId: string | null;
  annotations: Annotation[];
  commandHistory: Array<{ id: number; command: string; timestamp: number }>;
  templates: Array<{ name: string; command: string }>;
  filteredObservations: Observation[] | null;
  timeline: TimelineEvent[];
}

interface ProjectActions {
  createProject: (name: string) => void;
  deleteProject: (projectName: string) => void;
  useProject: (projectName: string) => void;
  loadDocument: (docName: string, discipline?: string) => void;
  deleteDocument: (docName: string) => void;
  addObservation: (
    docName: string,
    obsType: ObservationType,
    text: string,
    source: string
  ) => void;
  editObservation: (obsId: string, newText: string) => void;
  deleteObservation: (obsId: string) => void;
  approveObservation: (obsId: string) => void;
  rejectObservation: (obsId: string) => void;
  tagObservation: (obsId: string, tag: string) => void;
  setPriority: (obsId: string, priority: Priority) => void;
  addComment: (obsId: string, comment: string) => void;
  addProjectNote: (text: string) => void;
  addDocumentNote: (text: string) => void;
  searchObservations: (query: string) => void;
  filterObservations: (filterType: 'type' | 'status', filterValue: string) => void;
  clearFilter: () => void;
  addCommandToHistory: (command: string) => void;
  clearHistory: () => void;
  saveTemplate: (name: string, command: string) => void;
  loadTemplate: (name: string) => string | null;
  clearAnnotations: () => void;
  getTimeline: () => TimelineEvent[];
  clearTimeline: () => void;
}

type ProjectStore = ProjectState & ProjectActions;

// ============================================
// CREACIÓN DEL STORE
// ============================================

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      projects: [],
      activeProjectId: null,
      activeDocumentId: null,
      annotations: [],
      commandHistory: [],
      templates: [],
      filteredObservations: null,
      timeline: [],

      createProject: (name: string) => {
        const newProject: Project = {
          id: generateProjectId(),
          name,
          documents: [],
          notes: [],
          createdAt: Date.now(),
        };

        set((state) => ({
          projects: [...state.projects, newProject],
          activeProjectId: newProject.id,
          activeDocumentId: null,
          annotations: [
            ...state.annotations,
            {
              id: Date.now(),
              type: 'success',
              message: `[OK] PROYECTO CREADO: ${name}`,
              timestamp: Date.now(),
            },
          ],
          timeline: [
            ...state.timeline,
            {
              id: generateTimelineId(),
              action: 'CREATE_PROJECT',
              details: `Proyecto "${name}" creado`,
              timestamp: Date.now(),
            },
          ],
        }));
      },

      deleteProject: (projectName: string) => {
        const { projects, activeProjectId } = get();
        const project = projects.find((p) => p.name === projectName);

        if (!project) {
          set((state) => ({
            annotations: [
              ...state.annotations,
              {
                id: Date.now(),
                type: 'error',
                message: `[ERROR] Proyecto "${projectName}" no encontrado`,
                timestamp: Date.now(),
              },
            ],
          }));
          return;
        }

        set((state) => ({
          projects: state.projects.filter((p) => p.id !== project.id),
          activeProjectId: activeProjectId === project.id ? null : activeProjectId,
          activeDocumentId: null,
          annotations: [
            ...state.annotations,
            {
              id: Date.now(),
              type: 'success',
              message: `[OK] PROYECTO ELIMINADO: ${projectName}`,
              timestamp: Date.now(),
            },
          ],
          timeline: [
            ...state.timeline,
            {
              id: generateTimelineId(),
              action: 'DELETE_PROJECT',
              details: `Proyecto "${projectName}" eliminado`,
              timestamp: Date.now(),
            },
          ],
        }));
      },

      useProject: (projectName: string) => {
        const { projects } = get();
        const project = projects.find((p) => p.name === projectName);

        if (!project) {
          set((state) => ({
            annotations: [
              ...state.annotations,
              {
                id: Date.now(),
                type: 'error',
                message: `[ERROR] Proyecto "${projectName}" no encontrado`,
                timestamp: Date.now(),
              },
            ],
          }));
          return;
        }

        set((state) => ({
          activeProjectId: project.id,
          activeDocumentId: null,
          annotations: [
            ...state.annotations,
            {
              id: Date.now(),
              type: 'success',
              message: `[OK] Cambiando a proyecto: ${projectName}`,
              timestamp: Date.now(),
            },
          ],
          timeline: [
            ...state.timeline,
            {
              id: generateTimelineId(),
              action: 'USE_PROJECT',
              details: `Cambiando a proyecto "${projectName}"`,
              timestamp: Date.now(),
            },
          ],
        }));
      },

      loadDocument: (docName: string, discipline: string = 'General') => {
        const { activeProjectId } = get();
        if (!activeProjectId) {
          set((state) => ({
            annotations: [
              ...state.annotations,
              {
                id: Date.now(),
                type: 'error',
                message: `[ERROR] No hay proyecto activo. Usa /create project primero`,
                timestamp: Date.now(),
              },
            ],
          }));
          return;
        }

        set((state) => {
          const updatedProjects = state.projects.map((project) => {
            if (project.id === state.activeProjectId) {
              const existingDoc = project.documents.find((d) => d.name === docName);
              if (existingDoc) {
                return {
                  ...project,
                  documents: project.documents.map((d) =>
                    d.name === docName ? { ...d, discipline } : d
                  ),
                };
              }
              const newDoc: Document = {
                id: generateDocId(),
                name: docName,
                discipline,
                observations: [],
                notes: [],
                createdAt: Date.now(),
              };
              return { ...project, documents: [...project.documents, newDoc] };
            }
            return project;
          });

          const activeProject = updatedProjects.find(
            (p) => p.id === state.activeProjectId
          );
          const activeDoc = activeProject?.documents.find((d) => d.name === docName);

          return {
            projects: updatedProjects,
            activeDocumentId: activeDoc?.id || null,
            annotations: [
              ...state.annotations,
              {
                id: Date.now(),
                type: 'success',
                message: `[OK] DOCUMENTO CARGADO: ${docName} | Disciplina: ${discipline}`,
                timestamp: Date.now(),
              },
            ],
            timeline: [
              ...state.timeline,
              {
                id: generateTimelineId(),
                action: 'LOAD_DOCUMENT',
                details: `Documento "${docName}" cargado [${discipline}]`,
                timestamp: Date.now(),
              },
            ],
          };
        });
      },

      deleteDocument: (docName: string) => {
        const { activeProjectId } = get();

        set((state) => {
          const updatedProjects = state.projects.map((project) => {
            if (project.id === activeProjectId) {
              const docToDelete = project.documents.find((d) => d.name === docName);
              if (!docToDelete) return project;
              return {
                ...project,
                documents: project.documents.filter((d) => d.name !== docName),
              };
            }
            return project;
          });

          return {
            projects: updatedProjects,
            activeDocumentId: null,
            annotations: [
              ...state.annotations,
              {
                id: Date.now(),
                type: 'success',
                message: `[OK] DOCUMENTO ELIMINADO: ${docName}`,
                timestamp: Date.now(),
              },
            ],
            timeline: [
              ...state.timeline,
              {
                id: generateTimelineId(),
                action: 'DELETE_DOCUMENT',
                details: `Documento "${docName}" eliminado`,
                timestamp: Date.now(),
              },
            ],
          };
        });
      },

      addObservation: (
        docName: string,
        obsType: ObservationType,
        text: string,
        source: string
      ) => {
        const { activeProjectId } = get();

        if (!activeProjectId) {
          set((state) => ({
            annotations: [
              ...state.annotations,
              {
                id: Date.now(),
                type: 'error',
                message: `[ERROR] No hay proyecto activo`,
                timestamp: Date.now(),
              },
            ],
          }));
          return;
        }

        set((state) => {
          const project = state.projects.find((p) => p.id === activeProjectId);
          const docExists = project?.documents.some((d) => d.name === docName);

          if (!docExists) {
            return {
              annotations: [
                ...state.annotations,
                {
                  id: Date.now(),
                  type: 'error',
                  message: `[ERROR] Documento "${docName}" no existe. Usa /doc ${docName} primero`,
                  timestamp: Date.now(),
                },
              ],
            };
          }

          const updatedProjects = state.projects.map((project) => {
            if (project.id === activeProjectId) {
              return {
                ...project,
                documents: project.documents.map((doc) => {
                  if (doc.name === docName) {
                    const newObs: Observation = {
                      id: generateObservationId(),
                      documentName: docName,
                      type: obsType,
                      text,
                      source,
                      status: 'pendiente',
                      tags: [],
                      priority: 'media',
                      comments: [],
                      createdAt: Date.now(),
                    };
                    return { ...doc, observations: [...doc.observations, newObs] };
                  }
                  return doc;
                }),
              };
            }
            return project;
          });

          const activeProject = updatedProjects.find(
            (p) => p.id === activeProjectId
          );
          const activeDoc = activeProject?.documents.find((d) => d.name === docName);
          const lastObs = activeDoc?.observations[activeDoc.observations.length - 1];

          return {
            projects: updatedProjects,
            annotations: [
              ...state.annotations,
              {
                id: Date.now(),
                type: 'success',
                message: `[OK] ${lastObs?.id || 'OBS'} registrada en ${docName} | ${obsType}`,
                timestamp: Date.now(),
              },
            ],
            timeline: [
              ...state.timeline,
              {
                id: generateTimelineId(),
                action: 'ADD_OBSERVATION',
                details: `Observación ${lastObs?.id} agregada en "${docName}"`,
                timestamp: Date.now(),
              },
            ],
          };
        });
      },

      editObservation: (obsId: string, newText: string) => {
        const { activeProjectId } = get();
        set((state) => {
          const updatedProjects = state.projects.map((project) => {
            if (project.id === activeProjectId) {
              return {
                ...project,
                documents: project.documents.map((doc) => ({
                  ...doc,
                  observations: doc.observations.map((obs) =>
                    obs.id === obsId ? { ...obs, text: newText } : obs
                  ),
                })),
              };
            }
            return project;
          });
          return {
            projects: updatedProjects,
            annotations: [
              ...state.annotations,
              {
                id: Date.now(),
                type: 'success',
                message: `[OK] ${obsId} actualizada`,
                timestamp: Date.now(),
              },
            ],
            timeline: [
              ...state.timeline,
              {
                id: generateTimelineId(),
                action: 'EDIT_OBSERVATION',
                details: `Observación ${obsId} editada`,
                timestamp: Date.now(),
              },
            ],
          };
        });
      },

      deleteObservation: (obsId: string) => {
        const { activeProjectId } = get();
        set((state) => {
          const updatedProjects = state.projects.map((project) => {
            if (project.id === activeProjectId) {
              return {
                ...project,
                documents: project.documents.map((doc) => ({
                  ...doc,
                  observations: doc.observations.filter((obs) => obs.id !== obsId),
                })),
              };
            }
            return project;
          });
          return {
            projects: updatedProjects,
            annotations: [
              ...state.annotations,
              {
                id: Date.now(),
                type: 'success',
                message: `[OK] ${obsId} eliminada`,
                timestamp: Date.now(),
              },
            ],
            timeline: [
              ...state.timeline,
              {
                id: generateTimelineId(),
                action: 'DELETE_OBSERVATION',
                details: `Observación ${obsId} eliminada`,
                timestamp: Date.now(),
              },
            ],
          };
        });
      },

      approveObservation: (obsId: string) => {
        const { activeProjectId } = get();
        set((state) => {
          const updatedProjects = state.projects.map((project) => {
            if (project.id === activeProjectId) {
              return {
                ...project,
                documents: project.documents.map((doc) => ({
                  ...doc,
                  observations: doc.observations.map((obs) =>
                    obs.id === obsId ? { ...obs, status: 'aprobada' as const } : obs
                  ),
                })),
              };
            }
            return project;
          });
          return {
            projects: updatedProjects,
            annotations: [
              ...state.annotations,
              {
                id: Date.now(),
                type: 'success',
                message: `[OK] ${obsId} aprobada`,
                timestamp: Date.now(),
              },
            ],
            timeline: [
              ...state.timeline,
              {
                id: generateTimelineId(),
                action: 'APPROVE_OBSERVATION',
                details: `Observación ${obsId} aprobada`,
                timestamp: Date.now(),
              },
            ],
          };
        });
      },

      rejectObservation: (obsId: string) => {
        const { activeProjectId } = get();
        set((state) => {
          const updatedProjects = state.projects.map((project) => {
            if (project.id === activeProjectId) {
              return {
                ...project,
                documents: project.documents.map((doc) => ({
                  ...doc,
                  observations: doc.observations.map((obs) =>
                    obs.id === obsId ? { ...obs, status: 'rechazada' as const } : obs
                  ),
                })),
              };
            }
            return project;
          });
          return {
            projects: updatedProjects,
            annotations: [
              ...state.annotations,
              {
                id: Date.now(),
                type: 'success',
                message: `[OK] ${obsId} rechazada`,
                timestamp: Date.now(),
              },
            ],
            timeline: [
              ...state.timeline,
              {
                id: generateTimelineId(),
                action: 'REJECT_OBSERVATION',
                details: `Observación ${obsId} rechazada`,
                timestamp: Date.now(),
              },
            ],
          };
        });
      },

      tagObservation: (obsId: string, tag: string) => {
        const { activeProjectId } = get();
        set((state) => {
          const updatedProjects = state.projects.map((project) => {
            if (project.id === activeProjectId) {
              return {
                ...project,
                documents: project.documents.map((doc) => ({
                  ...doc,
                  observations: doc.observations.map((obs) =>
                    obs.id === obsId && !obs.tags.includes(tag)
                      ? { ...obs, tags: [...obs.tags, tag] }
                      : obs
                  ),
                })),
              };
            }
            return project;
          });
          return {
            projects: updatedProjects,
            annotations: [
              ...state.annotations,
              {
                id: Date.now(),
                type: 'success',
                message: `[OK] Etiqueta "${tag}" agregada a ${obsId}`,
                timestamp: Date.now(),
              },
            ],
            timeline: [
              ...state.timeline,
              {
                id: generateTimelineId(),
                action: 'TAG_OBSERVATION',
                details: `Etiqueta "${tag}" agregada a ${obsId}`,
                timestamp: Date.now(),
              },
            ],
          };
        });
      },

      setPriority: (obsId: string, priority: Priority) => {
        const { activeProjectId } = get();
        set((state) => {
          const updatedProjects = state.projects.map((project) => {
            if (project.id === activeProjectId) {
              return {
                ...project,
                documents: project.documents.map((doc) => ({
                  ...doc,
                  observations: doc.observations.map((obs) =>
                    obs.id === obsId ? { ...obs, priority } : obs
                  ),
                })),
              };
            }
            return project;
          });
          return {
            projects: updatedProjects,
            annotations: [
              ...state.annotations,
              {
                id: Date.now(),
                type: 'success',
                message: `[OK] Prioridad de ${obsId} establecida en: ${priority}`,
                timestamp: Date.now(),
              },
            ],
            timeline: [
              ...state.timeline,
              {
                id: generateTimelineId(),
                action: 'SET_PRIORITY',
                details: `Prioridad de ${obsId} cambiada a ${priority}`,
                timestamp: Date.now(),
              },
            ],
          };
        });
      },

      addComment: (obsId: string, comment: string) => {
        const { activeProjectId } = get();
        set((state) => {
          const updatedProjects = state.projects.map((project) => {
            if (project.id === activeProjectId) {
              return {
                ...project,
                documents: project.documents.map((doc) => ({
                  ...doc,
                  observations: doc.observations.map((obs) =>
                    obs.id === obsId
                      ? {
                          ...obs,
                          comments: [
                            ...obs.comments,
                            { id: `COMMENT-${Date.now()}-${Math.random()}`, text: comment, timestamp: Date.now() },
                          ],
                        }
                      : obs
                  ),
                })),
              };
            }
            return project;
          });
          return {
            projects: updatedProjects,
            annotations: [
              ...state.annotations,
              {
                id: Date.now(),
                type: 'success',
                message: `[OK] Comentario agregado a ${obsId}`,
                timestamp: Date.now(),
              },
            ],
            timeline: [
              ...state.timeline,
              {
                id: generateTimelineId(),
                action: 'ADD_COMMENT',
                details: `Comentario agregado a ${obsId}`,
                timestamp: Date.now(),
              },
            ],
          };
        });
      },

      addProjectNote: (text: string) => {
        set((state) => {
          const { activeProjectId } = state;

          if (!activeProjectId) {
            return {
              annotations: [
                ...state.annotations,
                {
                  id: Date.now(),
                  type: 'error',
                  message: `[ERROR] No hay proyecto activo. Usa /create project primero`,
                  timestamp: Date.now(),
                },
              ],
            };
          }

          const newNote: Note = {
            id: generateNoteId(),
            text,
            createdAt: Date.now(),
          };
          const updatedProjects = state.projects.map((project) => {
            if (project.id === activeProjectId) {
              return { ...project, notes: [...project.notes, newNote] };
            }
            return project;
          });

          return {
            projects: updatedProjects,
            annotations: [
              ...state.annotations,
              {
                id: Date.now(),
                type: 'info',
                message: `[INFO] Nota de proyecto agregada`,
                timestamp: Date.now(),
              },
            ],
            timeline: [
              ...state.timeline,
              {
                id: generateTimelineId(),
                action: 'ADD_PROJECT_NOTE',
                details: `Nota de proyecto: "${text.substring(0, 30)}..."`,
                timestamp: Date.now(),
              },
            ],
          };
        });
      },

      addDocumentNote: (text: string) => {
        set((state) => {
          const { activeProjectId, activeDocumentId } = state;

          if (!activeProjectId || !activeDocumentId) {
            return {
              annotations: [
                ...state.annotations,
                {
                  id: Date.now(),
                  type: 'error',
                  message: `[ERROR] No hay documento activo. Usa /doc NOMBRE primero`,
                  timestamp: Date.now(),
                },
              ],
            };
          }

          const newNote: Note = {
            id: generateNoteId(),
            text,
            createdAt: Date.now(),
          };
          const updatedProjects = state.projects.map((project) => {
            if (project.id === activeProjectId) {
              return {
                ...project,
                documents: project.documents.map((doc) =>
                  doc.id === activeDocumentId
                    ? { ...doc, notes: [...doc.notes, newNote] }
                    : doc
                ),
              };
            }
            return project;
          });

          return {
            projects: updatedProjects,
            annotations: [
              ...state.annotations,
              {
                id: Date.now(),
                type: 'info',
                message: `[INFO] Nota de documento agregada`,
                timestamp: Date.now(),
              },
            ],
            timeline: [
              ...state.timeline,
              {
                id: generateTimelineId(),
                action: 'ADD_DOCUMENT_NOTE',
                details: `Nota de documento: "${text.substring(0, 30)}..."`,
                timestamp: Date.now(),
              },
            ],
          };
        });
      },

      searchObservations: (query: string) => {
        const { activeProjectId } = get();
        const project = get().projects.find((p) => p.id === activeProjectId);

        if (!project) {
          set((state) => ({
            annotations: [
              ...state.annotations,
              {
                id: Date.now(),
                type: 'error',
                message: `[ERROR] No hay proyecto activo`,
                timestamp: Date.now(),
              },
            ],
          }));
          return;
        }

        const results: Observation[] = [];
        project.documents.forEach((doc) => {
          doc.observations.forEach((obs) => {
            if (
              obs.text.toLowerCase().includes(query.toLowerCase()) ||
              obs.source.toLowerCase().includes(query.toLowerCase())
            ) {
              results.push({ ...obs, documentName: doc.name });
            }
          });
        });

        set((state) => ({
          filteredObservations: results,
          annotations: [
            ...state.annotations,
            {
              id: Date.now(),
              type: 'info',
              message: `[INFO] Búsqueda: "${query}" - ${results.length} resultado(s)`,
              timestamp: Date.now(),
            },
          ],
        }));
      },

      filterObservations: (filterType: 'type' | 'status', filterValue: string) => {
        const { activeProjectId } = get();
        const project = get().projects.find((p) => p.id === activeProjectId);

        if (!project) {
          set((state) => ({
            annotations: [
              ...state.annotations,
              {
                id: Date.now(),
                type: 'error',
                message: `[ERROR] No hay proyecto activo`,
                timestamp: Date.now(),
              },
            ],
          }));
          return;
        }

        const results: Observation[] = [];
        project.documents.forEach((doc) => {
          doc.observations.forEach((obs) => {
            if (filterType === 'type' && obs.type === filterValue)
              results.push({ ...obs, documentName: doc.name });
            else if (filterType === 'status' && obs.status === filterValue)
              results.push({ ...obs, documentName: doc.name });
          });
        });

        set((state) => ({
          filteredObservations: results,
          annotations: [
            ...state.annotations,
            {
              id: Date.now(),
              type: 'info',
              message: `[INFO] Filtro: ${filterType}="${filterValue}" - ${results.length} resultado(s)`,
              timestamp: Date.now(),
            },
          ],
        }));
      },

      clearFilter: () => set({ filteredObservations: null }),

      addCommandToHistory: (command: string) => {
        set((state) => ({
          commandHistory: [
            ...state.commandHistory,
            { id: Date.now(), command, timestamp: Date.now() },
          ],
        }));
      },

      clearHistory: () => set({ commandHistory: [], annotations: [] }),

      saveTemplate: (name: string, command: string) => {
        set((state) => ({
          templates: [...state.templates, { name, command }],
          annotations: [
            ...state.annotations,
            {
              id: Date.now(),
              type: 'success',
              message: `[OK] Plantilla "${name}" guardada`,
              timestamp: Date.now(),
            },
          ],
        }));
      },

      loadTemplate: (name: string): string | null => {
        const template = get().templates.find((t) => t.name === name);
        return template ? template.command : null;
      },

      clearAnnotations: () => set({ annotations: [] }),
      getTimeline: () => get().timeline,
      clearTimeline: () => set({ timeline: [] }),
    }),
    { name: 'blueprint-canvas-storage' }
  )
);
