import { describe, it, expect, beforeEach } from 'vitest';
import { useProjectStore } from '../store/projectStore';

describe('ProjectStore Extended', () => {
  beforeEach(() => {
    useProjectStore.setState({
      projects: [],
      activeProjectId: null,
      activeDocumentId: null,
      annotations: [],
      commandHistory: [],
      filteredObservations: null,
    });
  });

  describe('deleteProject', () => {
    it('debe eliminar un proyecto existente', () => {
      useProjectStore.getState().createProject('Test Project');
      useProjectStore.getState().deleteProject('Test Project');
      
      const state = useProjectStore.getState();
      expect(state.projects.length).toBe(0);
      expect(state.activeProjectId).toBeNull();
    });

    it('debe mostrar error si el proyecto no existe', () => {
      useProjectStore.getState().deleteProject('Nonexistent');
      
      const state = useProjectStore.getState();
      expect(state.annotations[0].type).toBe('error');
    });
  });

  describe('deleteDocument', () => {
    it('debe eliminar un documento existente', () => {
      useProjectStore.getState().createProject('Test');
      useProjectStore.getState().loadDocument('ELEC-01');
      useProjectStore.getState().deleteDocument('ELEC-01');
      
      const state = useProjectStore.getState();
      expect(state.projects[0].documents.length).toBe(0);
    });
  });

  describe('editObservation', () => {
    it('debe editar el texto de una observación', () => {
      useProjectStore.getState().createProject('Test');
      useProjectStore.getState().loadDocument('ELEC-01');
      useProjectStore.getState().addObservation('ELEC-01', 'Coherencia Global', 'Original', 'Fuente');
      
      const obsId = useProjectStore.getState().projects[0].documents[0].observations[0].id;
      useProjectStore.getState().editObservation(obsId, 'Editado');
      
      const state = useProjectStore.getState();
      expect(state.projects[0].documents[0].observations[0].text).toBe('Editado');
    });
  });

  describe('deleteObservation', () => {
    it('debe eliminar una observación', () => {
      useProjectStore.getState().createProject('Test');
      useProjectStore.getState().loadDocument('ELEC-01');
      useProjectStore.getState().addObservation('ELEC-01', 'Coherencia Global', 'Test', 'Fuente');
      
      const obsId = useProjectStore.getState().projects[0].documents[0].observations[0].id;
      useProjectStore.getState().deleteObservation(obsId);
      
      const state = useProjectStore.getState();
      expect(state.projects[0].documents[0].observations.length).toBe(0);
    });
  });

  describe('approveObservation', () => {
    it('debe aprobar una observación', () => {
      useProjectStore.getState().createProject('Test');
      useProjectStore.getState().loadDocument('ELEC-01');
      useProjectStore.getState().addObservation('ELEC-01', 'Coherencia Global', 'Test', 'Fuente');
      
      const obsId = useProjectStore.getState().projects[0].documents[0].observations[0].id;
      useProjectStore.getState().approveObservation(obsId);
      
      const state = useProjectStore.getState();
      expect(state.projects[0].documents[0].observations[0].status).toBe('aprobada');
    });
  });

  describe('rejectObservation', () => {
    it('debe rechazar una observación', () => {
      useProjectStore.getState().createProject('Test');
      useProjectStore.getState().loadDocument('ELEC-01');
      useProjectStore.getState().addObservation('ELEC-01', 'Coherencia Global', 'Test', 'Fuente');
      
      const obsId = useProjectStore.getState().projects[0].documents[0].observations[0].id;
      useProjectStore.getState().rejectObservation(obsId);
      
      const state = useProjectStore.getState();
      expect(state.projects[0].documents[0].observations[0].status).toBe('rechazada');
    });
  });

  describe('tagObservation', () => {
    it('debe agregar una etiqueta a una observación', () => {
      useProjectStore.getState().createProject('Test');
      useProjectStore.getState().loadDocument('ELEC-01');
      useProjectStore.getState().addObservation('ELEC-01', 'Coherencia Global', 'Test', 'Fuente');
      
      const obsId = useProjectStore.getState().projects[0].documents[0].observations[0].id;
      useProjectStore.getState().tagObservation(obsId, 'crítico');
      
      const state = useProjectStore.getState();
      expect(state.projects[0].documents[0].observations[0].tags).toContain('crítico');
    });
  });

  describe('setPriority', () => {
    it('debe establecer la prioridad de una observación', () => {
      useProjectStore.getState().createProject('Test');
      useProjectStore.getState().loadDocument('ELEC-01');
      useProjectStore.getState().addObservation('ELEC-01', 'Coherencia Global', 'Test', 'Fuente');
      
      const obsId = useProjectStore.getState().projects[0].documents[0].observations[0].id;
      useProjectStore.getState().setPriority(obsId, 'alta');
      
      const state = useProjectStore.getState();
      expect(state.projects[0].documents[0].observations[0].priority).toBe('alta');
    });
  });

  describe('addComment', () => {
    it('debe agregar un comentario a una observación', () => {
      useProjectStore.getState().createProject('Test');
      useProjectStore.getState().loadDocument('ELEC-01');
      useProjectStore.getState().addObservation('ELEC-01', 'Coherencia Global', 'Test', 'Fuente');
      
      const obsId = useProjectStore.getState().projects[0].documents[0].observations[0].id;
      useProjectStore.getState().addComment(obsId, 'Revisar con equipo');
      
      const state = useProjectStore.getState();
      expect(state.projects[0].documents[0].observations[0].comments.length).toBe(1);
      expect(state.projects[0].documents[0].observations[0].comments[0].text).toBe('Revisar con equipo');
    });
  });

  describe('searchObservations', () => {
    it('debe buscar observaciones por texto', () => {
      useProjectStore.getState().createProject('Test');
      useProjectStore.getState().loadDocument('ELEC-01');
      useProjectStore.getState().addObservation('ELEC-01', 'Coherencia Global', 'Tensión alta', 'Fuente');
      useProjectStore.getState().addObservation('ELEC-01', 'Coherencia Interna', 'Corriente baja', 'Fuente');
      
      useProjectStore.getState().searchObservations('tensión');
      
      const state = useProjectStore.getState();
      expect(state.filteredObservations.length).toBe(1);
      expect(state.filteredObservations[0].text).toBe('Tensión alta');
    });
  });

  describe('filterObservations', () => {
    it('debe filtrar observaciones por tipo', () => {
      useProjectStore.getState().createProject('Test');
      useProjectStore.getState().loadDocument('ELEC-01');
      useProjectStore.getState().addObservation('ELEC-01', 'Coherencia Global', 'Test 1', 'Fuente');
      useProjectStore.getState().addObservation('ELEC-01', 'Coherencia Interna', 'Test 2', 'Fuente');
      
      useProjectStore.getState().filterObservations('type', 'Coherencia Global');
      
      const state = useProjectStore.getState();
      expect(state.filteredObservations.length).toBe(1);
      expect(state.filteredObservations[0].type).toBe('Coherencia Global');
    });

    it('debe filtrar observaciones por estado', () => {
      useProjectStore.getState().createProject('Test');
      useProjectStore.getState().loadDocument('ELEC-01');
      useProjectStore.getState().addObservation('ELEC-01', 'Coherencia Global', 'Test 1', 'Fuente');
      
      const obsId = useProjectStore.getState().projects[0].documents[0].observations[0].id;
      useProjectStore.getState().approveObservation(obsId);
      
      useProjectStore.getState().filterObservations('status', 'aprobada');
      
      const state = useProjectStore.getState();
      expect(state.filteredObservations.length).toBe(1);
      expect(state.filteredObservations[0].status).toBe('aprobada');
    });
  });

  describe('clearHistory', () => {
    it('debe limpiar el historial de comandos', () => {
      useProjectStore.getState().addCommandToHistory('/test');
      useProjectStore.getState().clearHistory();
      
      const state = useProjectStore.getState();
      expect(state.commandHistory.length).toBe(0);
      expect(state.annotations.length).toBe(0);
    });
  });
});
