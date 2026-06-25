import { X, BookOpen, Folder, FileText, AlertCircle, StickyNote, Search, Download, Command } from 'lucide-react';

export const DocumentationModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-blueprint-panel border border-blueprint-grid/30 rounded-lg max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-blueprint-grid/20 flex items-center justify-between bg-blueprint-grid/5">
          <div className="flex items-center gap-3">
            <BookOpen size={24} className="text-blueprint-grid" />
            <div>
              <h2 className="text-xl font-mono text-blueprint-grid font-bold">Documentación Completa</h2>
              <p className="text-xs text-current/60 font-mono">Guía de comandos y sintaxis</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-current/60 hover:text-current transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Introducción */}
          <section>
            <h3 className="text-lg font-mono text-blueprint-grid font-bold mb-3">Introducción</h3>
            <p className="text-sm text-current/80 leading-relaxed">
              Blueprint Canvas utiliza una interfaz de línea de comandos (CLI) para gestionar proyectos de ingeniería. 
              Todos los comandos comienzan con <code className="bg-blueprint-grid/10 px-2 py-0.5 rounded text-blueprint-grid">/</code> y siguen una sintaxis específica.
            </p>
            <div className="mt-3 p-3 bg-blueprint-critical/5 border border-blueprint-critical/20 rounded text-xs text-current/70">
              <strong className="text-blueprint-critical">💡 Tip:</strong> Presiona <kbd className="bg-blueprint-grid/20 px-1.5 py-0.5 rounded">Tab</kbd> para autocompletar comandos y <kbd className="bg-blueprint-grid/20 px-1.5 py-0.5 rounded">↑</kbd><kbd className="bg-blueprint-grid/20 px-1.5 py-0.5 rounded">↓</kbd> para navegar el historial.
            </div>
          </section>

          {/* Gestión de Proyectos */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Folder size={18} className="text-blueprint-grid" />
              <h3 className="text-lg font-mono text-blueprint-grid font-bold">Gestión de Proyectos</h3>
            </div>
            
            <div className="space-y-4">
              <CommandDoc
                command='/create project "nombre"'
                description="Crea un nuevo proyecto y lo establece como activo"
                examples={[
                  '/create project "Edificio Central"',
                  '/create project "Puente Norte"',
                  '/create project "Planta Industrial 2024"',
                ]}
                notes="El nombre debe ir entre comillas dobles. Puede contener espacios y caracteres especiales."
              />
              
              <CommandDoc
                command='/use "nombre"'
                description="Cambia al proyecto indicado"
                examples={[
                  '/use "Edificio Central"',
                  '/use "Puente Norte"',
                ]}
                notes="El nombre debe coincidir exactamente con un proyecto existente."
              />
              
              <CommandDoc
                command='/current'
                description="Muestra información detallada del proyecto activo"
                examples={[
                  '/current',
                ]}
                notes="No requiere argumentos. Muestra ID, documentos, observaciones y fecha de creación."
              />
              
              <CommandDoc
                command='/list projects'
                description="Lista todos los proyectos creados"
                examples={[
                  '/list projects',
                ]}
              />
              
              <CommandDoc
                command='/delete project "nombre"'
                description="Elimina un proyecto y todos sus datos"
                examples={[
                  '/delete project "Edificio Central"',
                ]}
                notes="⚠️ Esta acción es irreversible. Se eliminarán todos los documentos, observaciones y notas."
              />
            </div>
          </section>

          {/* Gestión de Documentos */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <FileText size={18} className="text-blueprint-grid" />
              <h3 className="text-lg font-mono text-blueprint-grid font-bold">Gestión de Documentos</h3>
            </div>
            
            <div className="space-y-4">
              <CommandDoc
                command='/doc NOMBRE [disciplina]'
                description="Carga o crea un documento. Si no existe, lo crea."
                examples={[
                  '/doc ELEC-01',
                  '/doc ELEC-01 Eléctrica',
                  '/doc MECH-02 Mecánica',
                  '/doc CIVIL-03 Civil',
                ]}
                notes="El NOMBRE puede contener guiones. La disciplina es opcional (default: General). Si el documento ya existe, solo cambia su disciplina."
              />
              
              <CommandDoc
                command='/list docs'
                description="Lista todos los documentos del proyecto activo"
                examples={[
                  '/list docs',
                ]}
              />
              
              <CommandDoc
                command='/delete doc NOMBRE'
                description="Elimina un documento y todas sus observaciones"
                examples={[
                  '/delete doc ELEC-01',
                ]}
                notes="⚠️ Esta acción es irreversible."
              />
              
              <CommandDoc
                command='/compare'
                description="Abre un comparador visual de todos los documentos"
                examples={[
                  '/compare',
                ]}
                notes="Requiere al menos 2 documentos en el proyecto."
              />
            </div>
          </section>

          {/* Gestión de Observaciones */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle size={18} className="text-blueprint-grid" />
              <h3 className="text-lg font-mono text-blueprint-grid font-bold">Gestión de Observaciones</h3>
            </div>
            
            <div className="space-y-4">
              <CommandDoc
                command='/obs DOC TIPO: "texto" | Fuente: origen'
                description="Agrega una observación a un documento"
                examples={[
                  '/obs ELEC-01 Coherencia Global: "Tensión no coincide" | Fuente: Sección 4.2',
                  '/obs MECH-02 Coherencia Interna: "Falta tabla de cargas" | Fuente: Página 15',
                  '/obs CIVIL-03 Observación Propia: "Revisar cimentación" | Fuente: Cálculo estructural',
                ]}
                notes="Sintaxis estricta: DOC (sin espacios), TIPO (una palabra o frase), texto entre comillas, Fuente después del pipe |. Tipos válidos: Coherencia Global, Coherencia Interna, Observación Propia."
              />
              
              <CommandDoc
                command='/list obs'
                description="Lista todas las observaciones del proyecto"
                examples={[
                  '/list obs',
                ]}
              />
              
              <CommandDoc
                command='/edit OBS-ID nuevo texto'
                description="Edita el texto de una observación existente"
                examples={[
                  '/edit OBS-2024-001 Texto corregido de la observación',
                ]}
                notes="El OBS-ID se obtiene de /list obs. No requiere comillas en el nuevo texto."
              />
              
              <CommandDoc
                command='/approve OBS-ID'
                description="Aprueba una observación"
                examples={[
                  '/approve OBS-2024-001',
                ]}
              />
              
              <CommandDoc
                command='/reject OBS-ID'
                description="Rechaza una observación"
                examples={[
                  '/reject OBS-2024-001',
                ]}
              />
              
              <CommandDoc
                command='/delete obs OBS-ID'
                description="Elimina una observación"
                examples={[
                  '/delete obs OBS-2024-001',
                ]}
                notes="⚠️ Esta acción es irreversible."
              />
              
              <CommandDoc
                command='/tag OBS-ID "etiqueta"'
                description="Agrega una etiqueta a una observación"
                examples={[
                  '/tag OBS-2024-001 "crítico"',
                  '/tag OBS-2024-001 "revisar"',
                ]}
                notes="La etiqueta debe ir entre comillas. Puedes agregar múltiples etiquetas."
              />
              
              <CommandDoc
                command='/priority OBS-ID alta|media|baja'
                description="Asigna prioridad a una observación"
                examples={[
                  '/priority OBS-2024-001 alta',
                  '/priority OBS-2024-001 media',
                  '/priority OBS-2024-001 baja',
                ]}
                notes="Solo acepta: alta, media, baja (sin comillas)."
              />
              
              <CommandDoc
                command='/comment OBS-ID "comentario"'
                description="Agrega un comentario a una observación"
                examples={[
                  '/comment OBS-2024-001 "Revisar con equipo HVAC"',
                ]}
                notes="El comentario debe ir entre comillas."
              />
              
              <CommandDoc
                command='/review'
                description="Muestra todas las observaciones pendientes de revisión"
                examples={[
                  '/review',
                ]}
              />
            </div>
          </section>

          {/* Notas */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <StickyNote size={18} className="text-blueprint-grid" />
              <h3 className="text-lg font-mono text-blueprint-grid font-bold">Notas</h3>
            </div>
            
            <div className="space-y-4">
              <CommandDoc
                command='/note "texto"'
                description="Agrega una nota al proyecto activo"
                examples={[
                  '/note "Reunión con cliente el martes"',
                  '/note "Presupuesto aprobado: $50,000"',
                ]}
                notes="Las notas del proyecto son independientes de los documentos. El texto debe ir entre comillas."
              />
              
              <CommandDoc
                command='/doc-note "texto"'
                description="Agrega una nota al documento activo"
                examples={[
                  '/doc-note "Verificar tensión nominal"',
                  '/doc-note "Revisar normas NCh"',
                ]}
                notes="Requiere un documento activo (usar /doc primero). Las notas del documento se pueden arrastrar al chat para convertirlas en observaciones."
              />
              
              <CommandDoc
                command='/list notes'
                description="Lista todas las notas del proyecto y documento activo"
                examples={[
                  '/list notes',
                ]}
              />
            </div>
          </section>

          {/* Búsqueda y Filtros */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Search size={18} className="text-blueprint-grid" />
              <h3 className="text-lg font-mono text-blueprint-grid font-bold">Búsqueda y Filtros</h3>
            </div>
            
            <div className="space-y-4">
              <CommandDoc
                command='/search "texto"'
                description="Busca observaciones que contengan el texto"
                examples={[
                  '/search "tensión"',
                  '/search "HVAC"',
                ]}
                notes="La búsqueda es case-insensitive y busca en texto y fuente."
              />
              
              <CommandDoc
                command='/filter type "tipo"'
                description="Filtra observaciones por tipo"
                examples={[
                  '/filter type "Coherencia Global"',
                  '/filter type "Coherencia Interna"',
                  '/filter type "Observación Propia"',
                ]}
                notes="El tipo debe ir entre comillas y coincidir exactamente."
              />
              
              <CommandDoc
                command='/filter status "estado"'
                description="Filtra observaciones por estado"
                examples={[
                  '/filter status "pendiente"',
                  '/filter status "aprobada"',
                  '/filter status "rechazada"',
                ]}
                notes="Estados válidos: pendiente, aprobada, rechazada."
              />
            </div>
          </section>

          {/* Exportación */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Download size={18} className="text-blueprint-grid" />
              <h3 className="text-lg font-mono text-blueprint-grid font-bold">Exportación</h3>
            </div>
            
            <div className="space-y-4">
              <CommandDoc
                command='/export markdown'
                description="Exporta el informe en formato Markdown"
                examples={[
                  '/export markdown',
                ]}
                notes="Genera un archivo .md con todas las observaciones aprobadas organizadas por tipo."
              />
              
              <CommandDoc
                command='/export json'
                description="Exporta todos los datos del proyecto en JSON"
                examples={[
                  '/export json',
                ]}
                notes="Incluye proyectos, documentos, observaciones, notas y timeline. Útil para backups o importar en otro dispositivo."
              />
              
              <CommandDoc
                command='/export pdf'
                description="Genera un informe profesional en PDF"
                examples={[
                  '/export pdf',
                ]}
                notes="PDF con formato profesional: portada, estadísticas, contenido agrupado por documento y tipo, pie de página con numeración."
              />
            </div>
          </section>

          {/* Utilidades */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Command size={18} className="text-blueprint-grid" />
              <h3 className="text-lg font-mono text-blueprint-grid font-bold">Utilidades</h3>
            </div>
            
            <div className="space-y-4">
              <CommandDoc
                command='/help'
                description="Muestra ayuda rápida con todos los comandos"
                examples={[
                  '/help',
                ]}
              />
              
              <CommandDoc
                command='/docs'
                description="Abre esta documentación completa"
                examples={[
                  '/docs',
                ]}
              />
              
              <CommandDoc
                command='/shortcuts'
                description="Muestra los atajos de teclado disponibles"
                examples={[
                  '/shortcuts',
                ]}
              />
              
              <CommandDoc
                command='/timeline'
                description="Muestra el historial de cambios del proyecto"
                examples={[
                  '/timeline',
                ]}
              />
              
              <CommandDoc
                command='/clear'
                description="Limpia el historial del chat"
                examples={[
                  '/clear',
                ]}
                notes="No elimina los datos del proyecto, solo el historial visible."
              />
              
              <CommandDoc
                command='/import {json}'
                description="Importa un proyecto desde JSON"
                examples={[
                  '/import {"name":"Proyecto","documents":[]}',
                ]}
                notes="Pega el JSON completo después de /import. Útil para restaurar backups."
              />
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

// Componente auxiliar para documentar cada comando
const CommandDoc = ({ command, description, examples, notes }) => {
  return (
    <div className="border border-blueprint-grid/20 rounded-lg p-4 bg-blueprint-panel/30">
      <div className="flex items-start justify-between mb-2">
        <code className="text-sm font-mono text-blueprint-critical bg-blueprint-critical/10 px-2 py-1 rounded">
          {command}
        </code>
      </div>
      <p className="text-sm text-current/80 mb-3">{description}</p>
      
      {examples && examples.length > 0 && (
        <div className="mb-3">
          <div className="text-xs font-mono text-current/60 mb-2">Ejemplos:</div>
          <div className="space-y-1">
            {examples.map((ex, i) => (
              <div key={i} className="text-xs font-mono text-current/70 bg-blueprint-grid/5 px-2 py-1 rounded">
                {ex}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {notes && (
        <div className="text-xs text-current/60 italic border-t border-blueprint-grid/10 pt-2 mt-2">
          {notes}
        </div>
      )}
    </div>
  );
};
