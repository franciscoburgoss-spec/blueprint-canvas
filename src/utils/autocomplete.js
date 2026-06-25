export const COMMANDS = [
  { cmd: '/create project "nombre"', desc: 'Crear proyecto', category: 'proyecto' },
  { cmd: '/doc NOMBRE [disciplina]', desc: 'Cargar documento', category: 'documento' },
  { cmd: '/obs DOC TIPO: "texto" | Fuente: origen', desc: 'Agregar observación', category: 'observación' },
  { cmd: '/note "texto"', desc: 'Nota del proyecto', category: 'nota' },
  { cmd: '/doc-note "texto"', desc: 'Nota del documento', category: 'nota' },
  { cmd: '/list projects', desc: 'Listar proyectos', category: 'listado' },
  { cmd: '/list docs', desc: 'Listar documentos', category: 'listado' },
  { cmd: '/list obs', desc: 'Listar observaciones', category: 'listado' },
  { cmd: '/list notes', desc: 'Listar notas', category: 'listado' },
  { cmd: '/edit OBS-ID nuevo texto', desc: 'Editar observación', category: 'observación' },
  { cmd: '/approve OBS-ID', desc: 'Aprobar observación', category: 'observación' },
  { cmd: '/reject OBS-ID', desc: 'Rechazar observación', category: 'observación' },
  { cmd: '/delete project "nombre"', desc: 'Eliminar proyecto', category: 'proyecto' },
  { cmd: '/delete doc NOMBRE', desc: 'Eliminar documento', category: 'documento' },
  { cmd: '/delete obs OBS-ID', desc: 'Eliminar observación', category: 'observación' },
  { cmd: '/tag OBS-ID "etiqueta"', desc: 'Etiquetar observación', category: 'observación' },
  { cmd: '/priority OBS-ID alta|media|baja', desc: 'Asignar prioridad', category: 'observación' },
  { cmd: '/comment OBS-ID "comentario"', desc: 'Comentar observación', category: 'observación' },
  { cmd: '/search "texto"', desc: 'Buscar observaciones', category: 'búsqueda' },
  { cmd: '/filter type "tipo"', desc: 'Filtrar por tipo', category: 'búsqueda' },
  { cmd: '/filter status "estado"', desc: 'Filtrar por estado', category: 'búsqueda' },
  { cmd: '/export markdown', desc: 'Exportar a Markdown', category: 'exportación' },
  { cmd: '/export json', desc: 'Exportar a JSON', category: 'exportación' },
  { cmd: '/review', desc: 'Modo revisión', category: 'utilidad' },
  { cmd: '/status', desc: 'Estado del proyecto', category: 'utilidad' },
  { cmd: '/timeline', desc: 'Historial de cambios', category: 'utilidad' },
  { cmd: '/compare', desc: 'Comparar documentos', category: 'utilidad' },
  { cmd: '/help', desc: 'Mostrar ayuda', category: 'utilidad' },
  { cmd: '/shortcuts', desc: 'Atajos de teclado', category: 'utilidad' },
  { cmd: '/clear', desc: 'Limpiar chat', category: 'utilidad' },
];

export const OBSERVATION_TYPES = [
  'Coherencia Global',
  'Coherencia Interna',
  'Observación Propia',
];

export const PRIORITIES = ['alta', 'media', 'baja'];
export const STATUSES = ['pendiente', 'aprobada', 'rechazada'];

export const getSuggestions = (input, context = {}) => {
  if (!input || !input.startsWith('/')) return [];
  
  const { projects = [], activeProjectId = null } = context;
  const activeProject = projects.find(p => p.id === activeProjectId);
  
  const endsWithSpace = input.endsWith(' ');
  const parts = input.trim().split(/\s+/);
  const command = parts[0];
  
  // Posición: si termina con espacio, estamos listos para el siguiente argumento
  const position = endsWithSpace ? parts.length : parts.length - 1;
  
  // Para filtrar, usamos solo la parte relevante del input
  const currentArg = endsWithSpace ? '' : parts[parts.length - 1].toLowerCase();
  
  const suggestions = [];
  
  // 1. Sugerir comandos si estamos en posición 0
  if (position === 0) {
    const matchingCommands = COMMANDS.filter(c => 
      c.cmd.toLowerCase().startsWith(command.toLowerCase())
    );
    
    matchingCommands.forEach(c => {
      suggestions.push({
        type: 'command',
        display: c.cmd,
        description: c.desc,
        category: c.category,
        insertText: c.cmd,
      });
    });
  }
  
  // 2. Sugerencias contextuales
  
  // /doc en posición 1
  if (command === '/doc' && position === 1 && activeProject) {
    activeProject.documents.forEach(doc => {
      suggestions.push({
        type: 'context',
        display: doc.name,
        description: `[${doc.discipline}]`,
        category: 'documento',
        insertText: `/doc ${doc.name}`,
      });
    });
  }
  
  // /obs en posición 1
  if (command === '/obs' && position === 1 && activeProject) {
    activeProject.documents.forEach(doc => {
      suggestions.push({
        type: 'context',
        display: doc.name,
        description: `Documento`,
        category: 'documento',
        insertText: `/obs ${doc.name} `,
      });
    });
  }
  
  // /obs DOC en posición 2
  if (command === '/obs' && position === 2) {
    const docName = parts[1];
    OBSERVATION_TYPES.forEach(type => {
      suggestions.push({
        type: 'context',
        display: type,
        description: 'Tipo de observación',
        category: 'tipo',
        insertText: `/obs ${docName} ${type}: `,
      });
    });
  }
  
  // Comandos que esperan OBS-ID en posición 1
  const obsIdCommands = ['/approve', '/reject', '/edit', '/tag', '/priority', '/comment'];
  if (obsIdCommands.includes(command) && position === 1 && activeProject) {
    activeProject.documents.forEach(doc => {
      doc.observations.forEach(obs => {
        suggestions.push({
          type: 'context',
          display: obs.id,
          description: `${obs.text.substring(0, 40)}${obs.text.length > 40 ? '...' : ''}`,
          category: 'observación',
          insertText: `${command} ${obs.id}`,
        });
      });
    });
  }
  
  // /delete obs en posición 2
  if (command === '/delete' && parts[1] === 'obs' && position === 2 && activeProject) {
    activeProject.documents.forEach(doc => {
      doc.observations.forEach(obs => {
        suggestions.push({
          type: 'context',
          display: obs.id,
          description: `${obs.text.substring(0, 40)}${obs.text.length > 40 ? '...' : ''}`,
          category: 'observación',
          insertText: `/delete obs ${obs.id}`,
        });
      });
    });
  }
  
  // /priority OBS-ID en posición 2
  if (command === '/priority' && position === 2) {
    const obsId = parts[1];
    PRIORITIES.forEach(p => {
      suggestions.push({
        type: 'context',
        display: p,
        description: 'Prioridad',
        category: 'prioridad',
        insertText: `/priority ${obsId} ${p}`,
      });
    });
  }
  
  // /filter en posición 1
  if (command === '/filter' && position === 1) {
    ['type', 'status'].forEach(f => {
      suggestions.push({
        type: 'context',
        display: f,
        description: 'Tipo de filtro',
        category: 'filtro',
        insertText: `/filter ${f} `,
      });
    });
  }
  
  // /filter status en posición 2
  if (command === '/filter' && parts[1] === 'status' && position === 2) {
    STATUSES.forEach(s => {
      suggestions.push({
        type: 'context',
        display: s,
        description: 'Estado',
        category: 'estado',
        insertText: `/filter status ${s}`,
      });
    });
  }
  
  // /filter type en posición 2
  if (command === '/filter' && parts[1] === 'type' && position === 2) {
    OBSERVATION_TYPES.forEach(t => {
      suggestions.push({
        type: 'context',
        display: t,
        description: 'Tipo de observación',
        category: 'tipo',
        insertText: `/filter type "${t}"`,
      });
    });
  }
  
  // /list en posición 1
  if (command === '/list' && position === 1) {
    ['projects', 'docs', 'obs', 'notes'].forEach(item => {
      suggestions.push({
        type: 'context',
        display: item,
        description: 'Listar',
        category: 'listado',
        insertText: `/list ${item}`,
      });
    });
  }
  
  // /delete en posición 1
  if (command === '/delete' && position === 1) {
    ['project', 'doc', 'obs'].forEach(item => {
      suggestions.push({
        type: 'context',
        display: item,
        description: 'Eliminar',
        category: 'eliminación',
        insertText: `/delete ${item} `,
      });
    });
  }
  
  // /export en posición 1
  if (command === '/export' && position === 1) {
    ['markdown', 'json'].forEach(f => {
      suggestions.push({
        type: 'context',
        display: f,
        description: 'Formato',
        category: 'exportación',
        insertText: `/export ${f}`,
      });
    });
  }
  
  // Filtrar basado en el argumento actual (no en todo el input)
  const filtered = suggestions.filter(s => 
    s.display.toLowerCase().includes(currentArg) || 
    s.description.toLowerCase().includes(currentArg)
  );
  
  // Eliminar duplicados y limitar a 8 sugerencias
  const unique = [];
  const seen = new Set();
  for (const s of filtered) {
    const key = `${s.display}-${s.insertText}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(s);
    }
    if (unique.length >= 8) break;
  }
  
  return unique;
};
