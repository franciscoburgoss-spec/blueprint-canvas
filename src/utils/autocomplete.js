export const COMMANDS = [
  // Gestión de Proyectos
  { cmd: '/create project "nombre"', desc: 'Crear un nuevo proyecto', category: 'proyecto', example: '/create project "Edificio Central"' },
  { cmd: '/use "nombre"', desc: 'Cambiar al proyecto indicado', category: 'proyecto', example: '/use "Edificio Central"' },
  { cmd: '/current', desc: 'Mostrar el proyecto activo', category: 'proyecto', example: '/current' },
  { cmd: '/list projects', desc: 'Listar todos los proyectos', category: 'listado', example: '/list projects' },
  { cmd: '/delete project "nombre"', desc: 'Eliminar un proyecto', category: 'proyecto', example: '/delete project "Edificio Central"' },
  { cmd: '/status', desc: 'Mostrar estado del proyecto', category: 'utilidad', example: '/status' },
  
  // Gestión de Documentos
  { cmd: '/doc NOMBRE [disciplina]', desc: 'Cargar o crear un documento', category: 'documento', example: '/doc ELEC-01 Eléctrica' },
  { cmd: '/list docs', desc: 'Listar documentos del proyecto', category: 'listado', example: '/list docs' },
  { cmd: '/delete doc NOMBRE', desc: 'Eliminar un documento', category: 'documento', example: '/delete doc ELEC-01' },
  { cmd: '/compare', desc: 'Comparar documentos lado a lado', category: 'utilidad', example: '/compare' },
  
  // Gestión de Observaciones
  { cmd: '/obs DOC TIPO: "texto" | Fuente: origen', desc: 'Agregar una observación', category: 'observación', example: '/obs ELEC-01 Coherencia Global: "Tensión alta" | Fuente: Sección 4.2' },
  { cmd: '/list obs', desc: 'Listar todas las observaciones', category: 'listado', example: '/list obs' },
  { cmd: '/edit OBS-ID nuevo texto', desc: 'Editar una observación', category: 'observación', example: '/edit OBS-2024-001 Texto corregido' },
  { cmd: '/approve OBS-ID', desc: 'Aprobar una observación', category: 'observación', example: '/approve OBS-2024-001' },
  { cmd: '/reject OBS-ID', desc: 'Rechazar una observación', category: 'observación', example: '/reject OBS-2024-001' },
  { cmd: '/delete obs OBS-ID', desc: 'Eliminar una observación', category: 'observación', example: '/delete obs OBS-2024-001' },
  { cmd: '/tag OBS-ID "etiqueta"', desc: 'Agregar etiqueta a observación', category: 'observación', example: '/tag OBS-2024-001 "crítico"' },
  { cmd: '/priority OBS-ID alta|media|baja', desc: 'Asignar prioridad', category: 'observación', example: '/priority OBS-2024-001 alta' },
  { cmd: '/comment OBS-ID "comentario"', desc: 'Agregar comentario', category: 'observación', example: '/comment OBS-2024-001 "Revisar con HVAC"' },
  { cmd: '/review', desc: 'Modo revisión (lista pendientes)', category: 'utilidad', example: '/review' },
  
  // Notas
  { cmd: '/note "texto"', desc: 'Agregar nota al proyecto', category: 'nota', example: '/note "Reunión con cliente el martes"' },
  { cmd: '/doc-note "texto"', desc: 'Agregar nota al documento', category: 'nota', example: '/doc-note "Verificar tensión nominal"' },
  { cmd: '/list notes', desc: 'Listar notas del proyecto y documento', category: 'listado', example: '/list notes' },
  
  // Búsqueda y Filtros
  { cmd: '/search "texto"', desc: 'Buscar observaciones', category: 'búsqueda', example: '/search "tensión"' },
  { cmd: '/filter type "tipo"', desc: 'Filtrar por tipo', category: 'búsqueda', example: '/filter type "Coherencia Global"' },
  { cmd: '/filter status "estado"', desc: 'Filtrar por estado', category: 'búsqueda', example: '/filter status "pendiente"' },
  
  // Exportación
  { cmd: '/export markdown', desc: 'Exportar informe en Markdown', category: 'exportación', example: '/export markdown' },
  { cmd: '/export json', desc: 'Exportar datos en JSON', category: 'exportación', example: '/export json' },
  { cmd: '/export pdf', desc: 'Exportar informe profesional en PDF', category: 'exportación', example: '/export pdf' },
  
  // Utilidades
  { cmd: '/help', desc: 'Mostrar ayuda rápida', category: 'utilidad', example: '/help' },
  { cmd: '/docs', desc: 'Abrir documentación completa', category: 'utilidad', example: '/docs' },
  { cmd: '/shortcuts', desc: 'Mostrar atajos de teclado', category: 'utilidad', example: '/shortcuts' },
  { cmd: '/timeline', desc: 'Mostrar historial de cambios', category: 'utilidad', example: '/timeline' },
  { cmd: '/clear', desc: 'Limpiar historial del chat', category: 'utilidad', example: '/clear' },
  { cmd: '/import {json}', desc: 'Importar proyecto desde JSON', category: 'utilidad', example: '/import {"name":"Proyecto","documents":[]}' },
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
  
  const position = endsWithSpace ? parts.length : parts.length - 1;
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
        example: c.example,
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
    ['markdown', 'json', 'pdf'].forEach(f => {
      suggestions.push({
        type: 'context',
        display: f,
        description: 'Formato',
        category: 'exportación',
        insertText: `/export ${f}`,
      });
    });
  }
  
  // Filtrar basado en el argumento actual
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
