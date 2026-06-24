import { useProjectStore } from '../store/projectStore';
import { Clock, FolderPlus, FilePlus, AlertCircle, CheckCircle, XCircle, Tag, Flag, MessageSquare, StickyNote, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const ACTION_ICONS = {
  CREATE_PROJECT: FolderPlus,
  DELETE_PROJECT: FolderPlus,
  LOAD_DOCUMENT: FilePlus,
  DELETE_DOCUMENT: FilePlus,
  ADD_OBSERVATION: AlertCircle,
  EDIT_OBSERVATION: AlertCircle,
  DELETE_OBSERVATION: AlertCircle,
  APPROVE_OBSERVATION: CheckCircle,
  REJECT_OBSERVATION: XCircle,
  TAG_OBSERVATION: Tag,
  SET_PRIORITY: Flag,
  ADD_COMMENT: MessageSquare,
  ADD_NOTE: StickyNote,
};

const ACTION_COLORS = {
  CREATE_PROJECT: 'text-green-400',
  DELETE_PROJECT: 'text-red-400',
  LOAD_DOCUMENT: 'text-blue-400',
  DELETE_DOCUMENT: 'text-red-400',
  ADD_OBSERVATION: 'text-yellow-400',
  EDIT_OBSERVATION: 'text-blue-400',
  DELETE_OBSERVATION: 'text-red-400',
  APPROVE_OBSERVATION: 'text-green-400',
  REJECT_OBSERVATION: 'text-red-400',
  TAG_OBSERVATION: 'text-purple-400',
  SET_PRIORITY: 'text-orange-400',
  ADD_COMMENT: 'text-cyan-400',
  ADD_NOTE: 'text-pink-400',
};

export const Timeline = () => {
  const { timeline } = useProjectStore();
  const [isExpanded, setIsExpanded] = useState(false);

  if (timeline.length === 0) {
    return null;
  }

  const recentTimeline = timeline.slice(-5).reverse();
  const fullTimeline = timeline.slice().reverse();

  return (
    <div className={`border-t border-blueprint-grid/20 bg-blueprint-panel/30 transition-all duration-300 ${
      isExpanded ? 'max-h-64' : 'max-h-24'
    }`}>
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="text-blueprint-grid font-mono text-xs uppercase tracking-wider flex items-center gap-2">
            <Clock size={14} />
            Timeline ({timeline.length})
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blueprint-grid/60 hover:text-blueprint-grid transition-colors"
            title={isExpanded ? 'Colapsar' : 'Expandir'}
          >
            {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
        </div>
        
        <div className={`space-y-1 overflow-y-auto ${isExpanded ? 'max-h-48' : 'max-h-12'}`}>
          {(isExpanded ? fullTimeline : recentTimeline).map((event) => {
            const Icon = ACTION_ICONS[event.action] || Clock;
            const colorClass = ACTION_COLORS[event.action] || 'text-blueprint-grid';
            
            return (
              <div key={event.id} className="flex items-start gap-2 text-xs font-mono">
                <Icon size={12} className={`${colorClass} mt-0.5 flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <div className="text-current/80 truncate">{event.details}</div>
                  <div className="text-current/40 text-[10px]">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
