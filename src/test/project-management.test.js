import { describe, it, expect, beforeEach } from 'vitest';
import { useProjectStore } from '../store/projectStore';
import { parseCommand } from '../utils/parser';

describe('Project Management', () => {
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
    it('debe parsear /use "nombre" correctamente', () => {
      const result = parseCommand('/use "Edificio Central"');
      expect(result.type).toBe('USE_PROJECT');
      expect(result.name).toBe('Edificio Central');
    });

    it('debe parsear /current correctamente', () => {
      const result = parseCommand('/current');
      expect(result.type).toBe('CURRENT');
    });

    it('debe ser case-insensitive para /use', () => {
      const result = parseCommand('/USE "Test"');
      expect(result.type).toBe('USE_PROJECT');
    });

    it('debe incluir /use y /current en la ayuda', () => {
      const { getHelpText } = require('../utils/parser');
      const help = getHelpText();
      expect(help).toContain('/use');
      expect(help).toContain('/current');
    });
  });

  describe('Store - useProject', () => {
    it('debe cambiar al proyecto activo', () => {
      useProjectStore.getState().createProject('Proyecto 1');
      useProjectStore.getState().createProject('Proyecto 2');
      
      const state = useProjectStore.getState();
      const project1Id = state.projects[0].id;
      const project2Id = state.projects[1].id;
      
      // Al crear Proyecto 2, este es el activo
      expect(state.activeProjectId).toBe(project2Id);
      
      // Cambiar a Proyecto 1
      useProjectStore.getState().useProject('Proyecto 1');
      
      const newState = useProjectStore.getState();
      expect(newState.activeProjectId).toBe(project1Id);
    });

    it('debe resetear activeDocumentId al cambiar de proyecto', () => {
      useProjectStore.getState().createProject('Proyecto 1');
      useProjectStore.getState().loadDocument('DOC-1');
      
      let state = useProjectStore.getState();
      expect(state.activeDocumentId).toBeTruthy();
      
      useProjectStore.getState().createProject('Proyecto 2');
      useProjectStore.getState().useProject('Proyecto 1');
      
      state = useProjectStore.getState();
      expect(state.activeDocumentId).toBeNull();
    });

    it('debe mostrar error si el proyecto no existe', () => {
      useProjectStore.getState().useProject('Inexistente');
      
      const state = useProjectStore.getState();
      const error = state.annotations.find(a => a.type === 'error');
      expect(error).toBeDefined();
      expect(error.message).toContain('no encontrado');
    });

    it('debe registrar el cambio en el timeline', () => {
      useProjectStore.getState().createProject('Proyecto 1');
      useProjectStore.getState().createProject('Proyecto 2');
      useProjectStore.getState().useProject('Proyecto 1');
      
      const state = useProjectStore.getState();
      const useEvent = state.timeline.find(e => e.action === 'USE_PROJECT');
      expect(useEvent).toBeDefined();
      expect(useEvent.details).toContain('Proyecto 1');
    });

    it('debe agregar anotación de éxito al cambiar', () => {
      useProjectStore.getState().createProject('Proyecto 1');
      useProjectStore.getState().createProject('Proyecto 2');
      useProjectStore.getState().useProject('Proyecto 1');
      
      const state = useProjectStore.getState();
      const success = state.annotations.filter(a => a.type === 'success');
      const useAnnotation = success.find(a => a.message.includes('Cambiando'));
      expect(useAnnotation).toBeDefined();
    });
  });

  describe('Flujo completo de usuario', () => {
    it('debe permitir crear múltiples proyectos y cambiar entre ellos', () => {
      // Crear 3 proyectos
      useProjectStore.getState().createProject('Edificio A');
      useProjectStore.getState().createProject('Edificio B');
      useProjectStore.getState().createProject('Edificio C');
      
      let state = useProjectStore.getState();
      expect(state.projects.length).toBe(3);
      expect(state.activeProjectId).toBe(state.projects[2].id); // El último creado
      
      // Agregar documentos a cada proyecto
      useProjectStore.getState().useProject('Edificio A');
      useProjectStore.getState().loadDocument('ELEC-A');
      
      useProjectStore.getState().useProject('Edificio B');
      useProjectStore.getState().loadDocument('ELEC-B');
      
      useProjectStore.getState().useProject('Edificio C');
      useProjectStore.getState().loadDocument('ELEC-C');
      
      // Verificar que cada proyecto tiene su documento
      state = useProjectStore.getState();
      expect(state.projects[0].documents.length).toBe(1);
      expect(state.projects[1].documents.length).toBe(1);
      expect(state.projects[2].documents.length).toBe(1);
      
      // Cambiar entre proyectos
      useProjectStore.getState().useProject('Edificio A');
      state = useProjectStore.getState();
      expect(state.activeProjectId).toBe(state.projects[0].id);
      expect(state.projects[0].documents[0].name).toBe('ELEC-A');
    });

    it('debe mantener las notas de proyecto al cambiar entre proyectos', () => {
      useProjectStore.getState().createProject('Proyecto 1');
      useProjectStore.getState().addProjectNote('Nota P1');
      
      useProjectStore.getState().createProject('Proyecto 2');
      useProjectStore.getState().addProjectNote('Nota P2');
      
      useProjectStore.getState().useProject('Proyecto 1');
      
      const state = useProjectStore.getState();
      expect(state.projects[0].notes.length).toBe(1);
      expect(state.projects[0].notes[0].text).toBe('Nota P1');
    });
  });
});
