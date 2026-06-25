import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Drag & Drop UI', () => {
  describe('DropZone Component', () => {
    it('debe existir el componente DropZone', () => {
      const componentPath = path.join(process.cwd(), 'src/components/DropZone.jsx');
      expect(fs.existsSync(componentPath)).toBe(true);
    });

    it('debe tener ícono de papelera', () => {
      const componentPath = path.join(process.cwd(), 'src/components/DropZone.jsx');
      const content = fs.readFileSync(componentPath, 'utf8');
      expect(content).toContain('Trash2');
    });

    it('debe manejar eventos de drag', () => {
      const componentPath = path.join(process.cwd(), 'src/components/DropZone.jsx');
      const content = fs.readFileSync(componentPath, 'utf8');
      expect(content).toContain('onDragOver');
      expect(content).toContain('onDragLeave');
      expect(content).toContain('onDrop');
    });

    it('debe eliminar proyectos al soltar', () => {
      const componentPath = path.join(process.cwd(), 'src/components/DropZone.jsx');
      const content = fs.readFileSync(componentPath, 'utf8');
      expect(content).toContain('deleteProject');
    });

    it('debe eliminar documentos al soltar', () => {
      const componentPath = path.join(process.cwd(), 'src/components/DropZone.jsx');
      const content = fs.readFileSync(componentPath, 'utf8');
      expect(content).toContain('deleteDocument');
    });
  });

  describe('ProjectTree con Drag', () => {
    it('debe tener elementos arrastrables', () => {
      const componentPath = path.join(process.cwd(), 'src/components/ProjectTree.jsx');
      const content = fs.readFileSync(componentPath, 'utf8');
      expect(content).toContain('draggable');
      expect(content).toContain('onDragStart');
    });

    it('debe tener botones de eliminar visibles en hover', () => {
      const componentPath = path.join(process.cwd(), 'src/components/ProjectTree.jsx');
      const content = fs.readFileSync(componentPath, 'utf8');
      expect(content).toContain('Trash2');
      expect(content).toContain('group-hover');
    });

    it('debe tener tooltips con nombres completos', () => {
      const componentPath = path.join(process.cwd(), 'src/components/ProjectTree.jsx');
      const content = fs.readFileSync(componentPath, 'utf8');
      expect(content).toContain('title=');
    });

    it('debe incluir DropZone', () => {
      const componentPath = path.join(process.cwd(), 'src/components/ProjectTree.jsx');
      const content = fs.readFileSync(componentPath, 'utf8');
      expect(content).toContain('DropZone');
    });
  });

  describe('NotesPanel con Drag', () => {
    it('debe tener notas arrastrables', () => {
      const componentPath = path.join(process.cwd(), 'src/components/NotesPanel.jsx');
      const content = fs.readFileSync(componentPath, 'utf8');
      expect(content).toContain('draggable');
      expect(content).toContain('onDragStart');
    });

    it('debe emitir datos de nota en formato JSON', () => {
      const componentPath = path.join(process.cwd(), 'src/components/NotesPanel.jsx');
      const content = fs.readFileSync(componentPath, 'utf8');
      expect(content).toContain('application/note');
      expect(content).toContain('JSON.stringify');
    });
  });

  describe('ChatInterface con Drop de Notas', () => {
    it('debe manejar drop de notas', () => {
      const componentPath = path.join(process.cwd(), 'src/components/ChatInterface.jsx');
      const content = fs.readFileSync(componentPath, 'utf8');
      expect(content).toContain('handleNoteDrop');
      expect(content).toContain('application/note');
    });

    it('debe convertir notas en observaciones', () => {
      const componentPath = path.join(process.cwd(), 'src/components/ChatInterface.jsx');
      const content = fs.readFileSync(componentPath, 'utf8');
      expect(content).toContain('addObservation');
    });

    it('debe mostrar error si no hay documento activo', () => {
      const componentPath = path.join(process.cwd(), 'src/components/ChatInterface.jsx');
      const content = fs.readFileSync(componentPath, 'utf8');
      expect(content).toContain('No hay documento activo');
    });

    it('debe cambiar visualmente al arrastrar una nota', () => {
      const componentPath = path.join(process.cwd(), 'src/components/ChatInterface.jsx');
      const content = fs.readFileSync(componentPath, 'utf8');
      expect(content).toContain('isNoteDragOver');
    });
  });
});
