import { describe, it, expect, beforeEach } from 'vitest';
import { useProjectStore } from '../store/projectStore';
import { parseCommand } from '../utils/parser';

describe('Project Notes', () => {
  beforeEach(() => {
    useProjectStore.setState({
      projects: [],
      activeProjectId: null,
      activeDocumentId: null,
      annotations: [],
      commandHistory: [],
      timeline: [],
    });
  });

  describe('Parser', () => {
    it('debe parsear /note como PROJECT_NOTE', () => {
      const result = parseCommand('/note "Nota del proyecto"');
      expect(result.type).toBe('PROJECT_NOTE');
      expect(result.text).toBe('Nota del proyecto');
    });

    it('debe parsear /doc-note como DOCUMENT_NOTE', () => {
      const result = parseCommand('/doc-note "Nota del documento"');
      expect(result.type).toBe('DOCUMENT_NOTE');
      expect(result.text).toBe('Nota del documento');
    });
  });

  describe('Store - Project Notes', () => {
    it('debe agregar una nota al proyecto sin necesidad de documento', () => {
      useProjectStore.getState().createProject('Test Project');
      useProjectStore.getState().addProjectNote('Reunión con cliente');
      
      const state = useProjectStore.getState();
      expect(state.projects[0].notes.length).toBe(1);
      expect(state.projects[0].notes[0].text).toBe('Reunión con cliente');
    });

    it('debe mostrar error al agregar nota de proyecto sin proyecto activo', () => {
      useProjectStore.getState().addProjectNote('Nota perdida');
      
      const state = useProjectStore.getState();
      const error = state.annotations.find(a => a.type === 'error');
      expect(error).toBeDefined();
      expect(error.message).toContain('proyecto activo');
    });

    it('debe mantener notas de proyecto al cambiar de documento', () => {
      useProjectStore.getState().createProject('Test');
      useProjectStore.getState().addProjectNote('Nota Proyecto 1');
      
      useProjectStore.getState().loadDocument('DOC-1');
      useProjectStore.getState().loadDocument('DOC-2');
      
      const state = useProjectStore.getState();
      expect(state.projects[0].notes.length).toBe(1);
      expect(state.projects[0].notes[0].text).toBe('Nota Proyecto 1');
    });
  });

  describe('Store - Document Notes', () => {
    it('debe agregar una nota al documento activo', () => {
      useProjectStore.getState().createProject('Test');
      useProjectStore.getState().loadDocument('DOC-1');
      useProjectStore.getState().addDocumentNote('Nota Documento');
      
      const state = useProjectStore.getState();
      const doc = state.projects[0].documents[0];
      expect(doc.notes.length).toBe(1);
      expect(doc.notes[0].text).toBe('Nota Documento');
    });

    it('debe mostrar error al agregar nota de documento sin documento activo', () => {
      useProjectStore.getState().createProject('Test');
      useProjectStore.getState().addDocumentNote('Nota perdida');
      
      const state = useProjectStore.getState();
      const error = state.annotations.find(a => a.type === 'error');
      expect(error).toBeDefined();
      expect(error.message).toContain('documento activo');
    });
  });

  describe('Separación de Notas', () => {
    it('debe mantener notas de proyecto y documento separadas', () => {
      useProjectStore.getState().createProject('Test');
      useProjectStore.getState().loadDocument('DOC-1');
      
      useProjectStore.getState().addProjectNote('Nota Proyecto');
      useProjectStore.getState().addDocumentNote('Nota Documento');
      
      const state = useProjectStore.getState();
      expect(state.projects[0].notes.length).toBe(1);
      expect(state.projects[0].notes[0].text).toBe('Nota Proyecto');
      
      expect(state.projects[0].documents[0].notes.length).toBe(1);
      expect(state.projects[0].documents[0].notes[0].text).toBe('Nota Documento');
    });
  });
});
