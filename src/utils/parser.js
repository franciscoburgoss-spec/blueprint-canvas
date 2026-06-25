let observationCounter = 0;

const COMMAND_PATTERNS = {
  CREATE_PROJECT: /^\/create\s+project\s+"([^"]+)"/i,
  USE_PROJECT: /^\/use\s+"([^"]+)"$/i,
  CURRENT: /^\/current$/i,
  LOAD_DOCUMENT: /^\/doc\s+([\w-]+)(?:\s+(.+))?/i,
  ADD_OBSERVATION: /^\/obs\s+([\w-]+)\s+(Coherencia Global|Coherencia Interna|Observación Propia):\s*"([^"]+)"\s*\|\s*Fuente:\s*(.+)$/i,
  EDIT_OBSERVATION: /^\/edit\s+(OBS-[\w-]+)\s+(.+)/i,
  PROJECT_NOTE: /^\/note\s+"([^"]+)"/i,
  DOCUMENT_NOTE: /^\/doc-note\s+"([^"]+)"/i,
  HELP: /^\/help$/i,
  LIST: /^\/list\s+(projects|docs|obs|notes)$/i,
  DELETE: /^\/delete\s+(project|doc|obs)\s+(.+)$/i,
  APPROVE: /^\/approve\s+(OBS-[\w-]+)$/i,
  REJECT: /^\/reject\s+(OBS-[\w-]+)$/i,
  EXPORT: /^\/export\s+(markdown|json|pdf)$/i,
  CLEAR: /^\/clear$/i,
  STATUS: /^\/status$/i,
  SEARCH: /^\/search\s+"([^"]+)"$/i,
  FILTER: /^\/filter\s+(type|status)\s+"([^"]+)"$/i,
  TAG: /^\/tag\s+(OBS-[\w-]+)\s+"([^"]+)"$/i,
  PRIORITY: /^\/priority\s+(OBS-[\w-]+)\s+(alta|media|baja)$/i,
  COMMENT: /^\/comment\s+(OBS-[\w-]+)\s+"([^"]+)"$/i,
  TEMPLATE: /^\/template\s+"([^"]+)"$/i,
  SHORTCUTS: /^\/shortcuts$/i,
  REVIEW: /^\/review$/i,
  IMPORT: /^\/import\s+(.+)$/is,
  TIMELINE: /^\/timeline$/i,
  COMPARE: /^\/compare$/i,
  DOCS: /^\/docs$/i,
};

export const parseCommand = (input) => {
  const trimmed = input.trim();
  
  for (const [command, pattern] of Object.entries(COMMAND_PATTERNS)) {
    const match = trimmed.match(pattern);
    if (match) {
      switch (command) {
        case 'CREATE_PROJECT':
          return { type: 'CREATE_PROJECT', name: match[1] };
        case 'USE_PROJECT':
          return { type: 'USE_PROJECT', name: match[1] };
        case 'CURRENT':
          return { type: 'CURRENT' };
        case 'LOAD_DOCUMENT':
          return { type: 'LOAD_DOCUMENT', docName: match[1], discipline: match[2]?.trim() || 'General' };
        case 'ADD_OBSERVATION':
          return { type: 'ADD_OBSERVATION', docName: match[1], obsType: match[2], text: match[3], source: match[4].trim() };
        case 'EDIT_OBSERVATION':
          return { type: 'EDIT_OBSERVATION', id: match[1], newText: match[2] };
        case 'PROJECT_NOTE':
          return { type: 'PROJECT_NOTE', text: match[1] };
        case 'DOCUMENT_NOTE':
          return { type: 'DOCUMENT_NOTE', text: match[1] };
        case 'HELP':
          return { type: 'HELP' };
        case 'LIST':
          return { type: 'LIST', itemType: match[1] };
        case 'DELETE':
          return { type: 'DELETE', itemType: match[1], itemName: match[2].trim() };
        case 'APPROVE':
          return { type: 'APPROVE', obsId: match[1] };
        case 'REJECT':
          return { type: 'REJECT', obsId: match[1] };
        case 'EXPORT':
          return { type: 'EXPORT', format: match[1] };
        case 'CLEAR':
          return { type: 'CLEAR' };
        case 'STATUS':
          return { type: 'STATUS' };
        case 'SEARCH':
          return { type: 'SEARCH', query: match[1] };
        case 'FILTER':
          return { type: 'FILTER', filterType: match[1], filterValue: match[2] };
        case 'TAG':
          return { type: 'TAG', obsId: match[1], tag: match[2] };
        case 'PRIORITY':
          return { type: 'PRIORITY', obsId: match[1], priority: match[2] };
        case 'COMMENT':
          return { type: 'COMMENT', obsId: match[1], comment: match[2] };
        case 'TEMPLATE':
          return { type: 'TEMPLATE', templateName: match[1] };
        case 'SHORTCUTS':
          return { type: 'SHORTCUTS' };
        case 'REVIEW':
          return { type: 'REVIEW' };
        case 'IMPORT':
          return { type: 'IMPORT', jsonData: match[1].trim() };
        case 'TIMELINE':
          return { type: 'TIMELINE' };
        case 'COMPARE':
          return { type: 'COMPARE' };
        case 'DOCS':
          return { type: 'DOCS' };
      }
    }
  }

  return { type: 'INVALID_COMMAND', error: 'Comando no reconocido. Usa /help para ver los comandos disponibles' };
};

export const generateObservationId = () => {
  observationCounter++;
  const year = new Date().getFullYear();
  const counter = observationCounter.toString().padStart(3, '0');
  return `OBS-${year}-${counter}`;
};

export const getHelpText = () => {
  return `
COMANDOS DISPONIBLES:

GESTIÓN DE PROYECTOS:
  /create project "nombre"         Crea un nuevo proyecto
  /use "nombre"                    Cambia al proyecto indicado
  /current                         Muestra el proyecto activo
  /list projects                   Lista todos los proyectos
  /delete project "nombre"         Elimina un proyecto
  /status                          Muestra el estado actual
  /import {json}                   Importa un proyecto desde JSON

GESTIÓN DE DOCUMENTOS:
  /doc NOMBRE [disciplina]         Carga o crea un documento
  /list docs                       Lista documentos del proyecto
  /delete doc NOMBRE               Elimina un documento
  /compare                         Compara documentos lado a lado

GESTIÓN DE OBSERVACIONES:
  /obs DOC TIPO: "texto" | Fuente: origen
                                   Agrega una observación
  /list obs                        Lista todas las observaciones
  /edit OBS-ID nuevo texto         Edita una observación
  /approve OBS-ID                  Aprueba una observación
  /reject OBS-ID                   Rechaza una observación
  /delete obs OBS-ID               Elimina una observación
  /tag OBS-ID "etiqueta"           Agrega una etiqueta
  /priority OBS-ID alta|media|baja Asigna prioridad
  /comment OBS-ID "comentario"     Agrega un comentario
  /review                          Modo revisión (lista pendientes)

NOTAS:
  /note "texto"                    Agrega una nota al PROYECTO
  /doc-note "texto"                Agrega una nota al DOCUMENTO activo
  /list notes                      Lista notas del proyecto y documento

BÚSQUEDA Y FILTROS:
  /search "texto"                  Busca observaciones
  /filter type "tipo"              Filtra por tipo
  /filter status "estado"          Filtra por estado

EXPORTACIÓN:
  /export markdown                 Exporta informe en Markdown
  /export json                     Exporta datos en JSON
  /export pdf                      Exporta informe profesional en PDF

UTILIDADES:
  /help                            Muestra ayuda rápida
  /docs                            Abrir documentación completa
  /shortcuts                       Muestra atajos de teclado
  /timeline                        Muestra historial de cambios
  /clear                           Limpia el historial del chat
  `;
};
