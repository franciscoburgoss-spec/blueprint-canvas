export type ObservationType = 'Coherencia Global' | 'Coherencia Interna' | 'Observación Propia';
export type ObservationStatus = 'pendiente' | 'aprobada' | 'rechazada';

export interface Observation {
  id: string;
  documentName: string;
  type: ObservationType;
  text: string;
  source: string;
  status: ObservationStatus;
  createdAt: number;
}

export interface Note {
  id: string;
  text: string;
  createdAt: number;
}

export interface Document {
  id: string;
  name: string;
  discipline: string;
  observations: Observation[];
  notes: Note[];
}

export interface Project {
  id: string;
  name: string;
  documents: Document[];
  createdAt: number;
}

export type CommandType = 
  | { type: 'CREATE_PROJECT'; name: string }
  | { type: 'LOAD_DOCUMENT'; docName: string; discipline?: string }
  | { type: 'ADD_OBSERVATION'; docName: string; obsType: ObservationType; text: string; source: string }
  | { type: 'EDIT_OBSERVATION'; id: string; text?: string; type?: ObservationType; source?: string }
  | { type: 'ADD_NOTE'; text: string }
  | { type: 'INVALID_COMMAND'; error: string };
