import { useProjectStore } from '../store/projectStore';
import { CommandInput } from './CommandInput';
import { MessageSquare, User } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export const ChatInterface = ({ onShowComparator }) => {
  const { annotations, commandHistory, activeProjectId, activeDocumentId, projects } = useProjectStore();
  const [editingCommand, setEditingCommand] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const chatEndRef = useRef(null);
  
  const activeProject = projects.find(p => p.id === activeProjectId);
  const activeDoc = activeProject?.documents.find(d => d.id === activeDocumentId);

  // Auto-scroll al final cuando hay nuevos mensajes
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [commandHistory, annotations]);

  const handleCommandClick = (command) => {
    setEditingCommand(command);
  };

  const clearEditingCommand = () => {
    setEditingCommand('');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  // Combinar comandos y anotaciones en orden cronológico
  const allMessages = [
    ...commandHistory.map(cmd => ({ ...cmd, messageType: 'command' })),
    ...annotations.map(ann => ({ ...ann, messageType: 'annotation' })),
  ].sort((a, b) => a.timestamp - b.timestamp);

  return (
    <div 
      className={`flex-1 flex flex-col h-full border-r border-blueprint-grid/20 transition-colors ${
        isDragOver ? 'bg-blueprint-grid/5' : ''
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Header */}
      <div className="p-4 border-b border-blueprint-grid/20">
        <div className="flex items-center gap-2 text-xs font-mono text-blueprint-grid">
          <MessageSquare size={14} />
          <span>
            {activeProject ? `PROYECTO: ${activeProject.name}` : 'SIN PROYECTO'}
            {activeDoc && ` > DOC: ${activeDoc.name}`}
          </span>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {allMessages.length === 0 ? (
          <div className="text-current/40 text-sm font-mono text-center mt-8">
            Esperando comandos...
            <br />
            <span className="text-xs">Escribe /help para ver los comandos disponibles</span>
          </div>
        ) : (
          allMessages.map((message) => {
            if (message.messageType === 'command') {
              return (
                <div
                  key={`cmd-${message.id}`}
                  className="flex items-start gap-2 cursor-pointer hover:bg-blueprint-grid/5 p-2 rounded transition-colors"
                  onClick={() => handleCommandClick(message.command)}
                  title="Click para editar este comando"
                >
                  <User size={14} className="text-blueprint-grid mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-mono text-sm text-current">
                      {message.command}
                    </div>
                    <div className="text-xs text-current/40 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              );
            } else {
              return (
                <div
                  key={`ann-${message.id}`}
                  className={`annotation ${
                    message.type === 'success'
                      ? 'border-blueprint-critical text-blueprint-critical'
                      : message.type === 'error'
                      ? 'border-red-500 text-red-500'
                      : 'border-blueprint-grid text-blueprint-grid'
                  }`}
                >
                  {message.message}
                </div>
              );
            }
          })
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-blueprint-grid/20">
        <CommandInput 
          editingCommand={editingCommand}
          onClearEditing={clearEditingCommand}
          onShowComparator={onShowComparator}
        />
      </div>
    </div>
  );
};
