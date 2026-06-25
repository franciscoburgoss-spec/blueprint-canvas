import { Command, FileText, AlertCircle, StickyNote, Search, Filter, Trash2, Download, List, Hash, Tag } from 'lucide-react';

const CATEGORY_ICONS = {
  proyecto: FileText,
  documento: FileText,
  observación: AlertCircle,
  nota: StickyNote,
  listado: List,
  búsqueda: Search,
  filtro: Filter,
  eliminación: Trash2,
  exportación: Download,
  utilidad: Command,
  tipo: Tag,
  prioridad: Hash,
  estado: Tag,
};

const CATEGORY_COLORS = {
  proyecto: 'text-blue-400',
  documento: 'text-cyan-400',
  observación: 'text-yellow-400',
  nota: 'text-pink-400',
  listado: 'text-green-400',
  búsqueda: 'text-purple-400',
  filtro: 'text-purple-400',
  eliminación: 'text-red-400',
  exportación: 'text-orange-400',
  utilidad: 'text-blueprint-grid',
  tipo: 'text-yellow-400',
  prioridad: 'text-orange-400',
  estado: 'text-green-400',
};

export const AutocompleteSuggestions = ({ suggestions, selectedIndex, onSelect }) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="absolute bottom-full left-0 right-0 mb-2 bg-blueprint-panel border border-blueprint-grid/30 rounded shadow-2xl max-h-96 overflow-y-auto z-40">
      {suggestions.map((suggestion, index) => {
        const Icon = CATEGORY_ICONS[suggestion.category] || Command;
        const colorClass = CATEGORY_COLORS[suggestion.category] || 'text-blueprint-grid';
        const isSelected = index === selectedIndex;
        
        return (
          <button
            key={`${suggestion.display}-${index}`}
            onClick={() => onSelect(suggestion)}
            onMouseEnter={(e) => {
              e.currentTarget.classList.add('bg-blueprint-grid/10');
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                e.currentTarget.classList.remove('bg-blueprint-grid/10');
              }
            }}
            className={`w-full flex flex-col p-3 text-left transition-colors border-b border-blueprint-grid/10 last:border-b-0 ${
              isSelected ? 'bg-blueprint-grid/15' : 'hover:bg-blueprint-grid/10'
            }`}
          >
            <div className="flex items-start gap-3 w-full">
              <Icon size={14} className={`${colorClass} mt-0.5 flex-shrink-0`} />
              <div className="flex-1 min-w-0">
                <div className="font-mono text-xs text-current truncate">
                  {suggestion.display}
                </div>
                <div className="text-[10px] text-current/50 truncate">
                  {suggestion.description}
                </div>
              </div>
              {isSelected && (
                <div className="text-[10px] text-blueprint-grid/60 font-mono flex-shrink-0">
                  ↵ Enter
                </div>
              )}
            </div>
            
            {/* Mostrar ejemplo de sintaxis si existe */}
            {suggestion.example && (
              <div className="mt-2 ml-7 pl-2 border-l-2 border-blueprint-critical/30">
                <div className="text-[9px] text-current/40 font-mono mb-0.5">Ejemplo:</div>
                <code className="text-[10px] font-mono text-blueprint-critical/80 bg-blueprint-critical/5 px-1.5 py-0.5 rounded block truncate">
                  {suggestion.example}
                </code>
              </div>
            )}
          </button>
        );
      })}
      <div className="px-3 py-1 text-[10px] text-current/40 font-mono border-t border-blueprint-grid/10 bg-blueprint-panel/50">
        ↑↓ navegar · ↵ seleccionar · Tab completar · Esc cerrar
      </div>
    </div>
  );
};
