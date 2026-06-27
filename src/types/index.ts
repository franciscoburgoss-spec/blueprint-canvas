// ============================================
// TIPOS BASE DEL SISTEMA
// ============================================

export type ObservationType = 
  | 'Coherencia Global'
  | 'Coherencia Interna'
  | 'Observación Propia';

export type ObservationStatus = 
  | 'pendiente'
  | 'aprobada'
  | 'rechazada';

export type Priority = 'alta' | 'media' | 'baja';

export type Discipline = string;

// ============================================
// INTERFACES PRINCIPALES
// ============================================

export interface Comment {
  id: string;
  text: string;
  timestamp: number;
  author?: string;
}

export interface Observation {
  id: string;
  documentName: string;
  type: ObservationType;
  text: string;
  source: string;
  status: ObservationStatus;
  tags: string[];
  priority: Priority;
  comments: Comment[];
  createdAt: number;
  updatedAt?: number;
}

export interface Note {
  id: string;
  text: string;
  createdAt: number;
  updatedAt?: number;
}

export interface Document {
  id: string;
  name: string;
  discipline: Discipline;
  observations: Observation[];
  notes: Note[];
  createdAt: number;
  updatedAt?: number;
}

export interface Project {
  id: string;
  name: string;
  documents: Document[];
  notes: Note[];
  createdAt: number;
  updatedAt?: number;
}

// ============================================
// TIMELINE Y AUDITORÍA
// ============================================

export type TimelineAction =
  | 'CREATE_PROJECT'
  | 'DELETE_PROJECT'
  | 'USE_PROJECT'
  | 'LOAD_DOCUMENT'
  | 'DELETE_DOCUMENT'
  | 'ADD_OBSERVATION'
  | 'EDIT_OBSERVATION'
  | 'DELETE_OBSERVATION'
  | 'APPROVE_OBSERVATION'
  | 'REJECT_OBSERVATION'
  | 'TAG_OBSERVATION'
  | 'SET_PRIORITY'
  | 'ADD_COMMENT'
  | 'ADD_PROJECT_NOTE'
  | 'ADD_DOCUMENT_NOTE';

export interface TimelineEvent {
  id: string;
  action: TimelineAction;
  details: string;
  timestamp: number;
  userId?: string;
}

// ============================================
// ANOTACIONES Y COMANDOS
// ============================================

export type AnnotationType = 'success' | 'error' | 'info' | 'warning';

export interface Annotation {
  id: number;
  type: AnnotationType;
  message: string;
  timestamp: number;
}

export interface CommandHistoryEntry {
  id: number;
  command: string;
  timestamp: number;
}

// ============================================
// AUTOCOMPLETE
// ============================================

export type SuggestionCategory =
  | 'proyecto'
  | 'documento'
  | 'observación'
  | 'nota'
  | 'listado'
  | 'búsqueda'
  | 'filtro'
  | 'eliminación'
  | 'exportación'
  | 'utilidad'
  | 'tipo'
  | 'prioridad'
  | 'estado';

export interface Suggestion {
  type: 'command' | 'context';
  display: string;
  description: string;
  category: SuggestionCategory;
  example?: string;
  insertText: string;
}

export interface CommandDefinition {
  cmd: string;
  desc: string;
  category: SuggestionCategory;
  example: string;
}

// ============================================
// COMANDOS PARSEADOS
// ============================================

export type CommandType =
  | 'CREATE_PROJECT'
  | 'USE_PROJECT'
  | 'CURRENT'
  | 'LOAD_DOCUMENT'
  | 'ADD_OBSERVATION'
  | 'EDIT_OBSERVATION'
  | 'PROJECT_NOTE'
  | 'DOCUMENT_NOTE'
  | 'HELP'
  | 'DOCS'
  | 'LIST'
  | 'DELETE'
  | 'APPROVE'
  | 'REJECT'
  | 'EXPORT'
  | 'CLEAR'
  | 'STATUS'
  | 'SEARCH'
  | 'FILTER'
  | 'TAG'
  | 'PRIORITY'
  | 'COMMENT'
  | 'TEMPLATE'
  | 'SHORTCUTS'
  | 'REVIEW'
  | 'IMPORT'
  | 'TIMELINE'
  | 'COMPARE'
  | 'INVALID_COMMAND';

export interface ParsedCommand {
  type: CommandType;
  name?: string;
  docName?: string;
  discipline?: string;
  obsType?: ObservationType;
  text?: string;
  source?: string;
  id?: string;
  newText?: string;
  itemType?: string;
  itemName?: string;
  obsId?: string;
  format?: 'markdown' | 'json' | 'pdf';
  query?: string;
  filterType?: 'type' | 'status';
  filterValue?: string;
  tag?: string;
  priority?: Priority;
  comment?: string;
  templateName?: string;
  jsonData?: string;
  error?: string;
}

// ============================================
// STORE STATE
// ============================================

export interface ProjectState {
  projects: Project[];
  activeProjectId: string | null;
  activeDocumentId: string | null;
  annotations: Annotation[];
  commandHistory: CommandHistoryEntry[];
  templates: any[];
  filteredObservations: Observation[] | null;
  timeline: TimelineEvent[];
}

// ============================================
// UTILIDADES DE TIPOS
// ============================================

export const OBSERVATION_TYPES: ObservationType[] = [
  'Coherencia Global',
  'Coherencia Interna',
  'Observación Propia',
];

export const OBSERVATION_STATUSES: ObservationStatus[] = [
  'pendiente',
  'aprobada',
  'rechazada',
];

export const PRIORITIES: Priority[] = ['alta', 'media', 'baja'];

export const EXPORT_FORMATS = ['markdown', 'json', 'pdf'] as const;
export type ExportFormat = typeof EXPORT_FORMATS[number];
