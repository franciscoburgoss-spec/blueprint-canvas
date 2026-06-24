import { describe, it, expect, beforeEach } from 'vitest';
import { useProjectStore } from '../store/projectStore';

describe('ProjectStore', () => {
  beforeEach(() => {
    // Resetear el store antes de cada test
    useProjectStore.setState({
      projects: [],
      activeProjectId: null,
      activeDocumentId: null,
      annotations: [],
      commandHistory: [],
    });
  });

  describe('createProject', () => {
    it('debe crear un proyecto y establecerlo como activo', () => {
      useProjectStore.getState().createProject('Test Project');
      
      const state = useProjectStore.getState();
      expect(state.projects.length).toBe(1);
      expect(state.projects[0].name).toBe('Test Project');
      expect(state.activeProjectId).toBe(state.projects[0].id);
    });

    it('debe agregar una anotación de éxito', () => {
      useProjectStore.getState().createProject('Test Project');
      
      const state = useProjectStore.getState();
      expect(state.annotations.length).toBe(1);
      expect(state.annotations[0].type).toBe('success');
      expect(state.annotations[0].message).toContain('PROYECTO CREADO');
    });
  });

  describe('loadDocument', () => {
    it('debe crear un documento en el proyecto activo', () => {
      useProjectStore.getState().createProject('Test Project');
      useProjectStore.getState().loadDocument('ELEC-01', 'Eléctrica');
      
      const state = useProjectStore.getState();
      expect(state.projects[0].documents.length).toBe(1);
      expect(state.projects[0].documents[0].name).toBe('ELEC-01');
      expect(state.projects[0].documents[0].discipline).toBe('Eléctrica');
    });

    it('debe mostrar error si no hay proyecto activo', () => {
      useProjectStore.getState().loadDocument('ELEC-01');
      
      const state = useProjectStore.getState();
      expect(state.annotations.length).toBe(1);
      expect(state.annotations[0].type).toBe('error');
      expect(state.annotations[0].message).toContain('No hay proyecto activo');
    });
  });

  describe('addObservation', () => {
    it('debe agregar una observación al documento correcto', () => {
      useProjectStore.getState().createProject('Test Project');
      useProjectStore.getState().loadDocument('ELEC-01', 'Eléctrica');
      useProjectStore.getState().addObservation('ELEC-01', 'Coherencia Global', 'Test obs', 'Sección 1');
      
      const state = useProjectStore.getState();
      const doc = state.projects[0].documents[0];
      expect(doc.observations.length).toBe(1);
      expect(doc.observations[0].text).toBe('Test obs');
      expect(doc.observations[0].type).toBe('Coherencia Global');
    });
  });

  describe('addNote', () => {
    it('debe agregar una nota al documento activo', () => {
      useProjectStore.getState().createProject('Test Project');
      useProjectStore.getState().loadDocument('ELEC-01', 'Eléctrica');
      useProjectStore.getState().addNote('Test note');
      
      const state = useProjectStore.getState();
      const doc = state.projects[0].documents[0];
      expect(doc.notes.length).toBe(1);
      expect(doc.notes[0].text).toBe('Test note');
    });
  });

  describe('addCommandToHistory', () => {
    it('debe agregar comandos al historial', () => {
      useProjectStore.getState().addCommandToHistory('/create project "Test"');
      useProjectStore.getState().addCommandToHistory('/doc ELEC-01');
      
      const state = useProjectStore.getState();
      expect(state.commandHistory.length).toBe(2);
      expect(state.commandHistory[0].command).toBe('/create project "Test"');
      expect(state.commandHistory[1].command).toBe('/doc ELEC-01');
    });
  });
});
