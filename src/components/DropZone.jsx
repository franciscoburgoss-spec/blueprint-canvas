import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useProjectStore } from '../store/projectStore';

export const DropZone = () => {
  const [isDragOver, setIsDragOver] = useState(false);
  const { deleteProject, deleteDocument } = useProjectStore();

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      
      if (data.type === 'project') {
        if (confirm(`¿Eliminar proyecto "${data.name}"? Esta acción es irreversible.`)) {
          deleteProject(data.name);
        }
      } else if (data.type === 'document') {
        if (confirm(`¿Eliminar documento "${data.name}"? Esta acción es irreversible.`)) {
          deleteDocument(data.name);
        }
      }
    } catch (error) {
      console.error('Error al procesar drop:', error);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`mt-auto p-3 border-2 border-dashed rounded-lg transition-all ${
        isDragOver
          ? 'border-red-400 bg-red-400/10 scale-105'
          : 'border-current/20 bg-current/5'
      }`}
    >
      <div className="flex items-center justify-center gap-2 text-xs font-mono">
        <Trash2 
          size={14} 
          className={`transition-colors ${isDragOver ? 'text-red-400' : 'text-current/40'}`} 
        />
        <span className={`transition-colors ${isDragOver ? 'text-red-400' : 'text-current/40'}`}>
          {isDragOver ? 'Soltar para eliminar' : 'Arrastra aquí para eliminar'}
        </span>
      </div>
    </div>
  );
};
