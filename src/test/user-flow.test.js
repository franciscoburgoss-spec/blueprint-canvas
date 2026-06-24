import { describe, it, expect, beforeEach } from 'vitest';
import { useProjectStore } from '../store/projectStore';

describe('User Flow - Comportamiento real del usuario', () => {
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

  describe('Flujo 1: Usuario crea proyecto y agrega notas', () => {
    it('debe permitir agregar notas DESPUÉS de crear un documento', () => {
      // Usuario crea proyecto
      useProjectStore.getState().createProject('Test');
      
      // Usuario carga documento
      useProjectStore.getState().loadDocument('ELEC-01');
      
      // Usuario agrega nota
      useProjectStore.getState().addNote('Nota importante');
      
      const state = useProjectStore.getState();
      const doc = state.projects[0].documents[0];
      
      expect(doc.notes.length).toBe(1);
      expect(doc.notes[0].text).toBe('Nota importante');
    });

    it('NO debe permitir agregar notas SIN documento activo', () => {
      // Usuario crea proyecto pero NO carga documento
      useProjectStore.getState().createProject('Test');
      
      // Usuario intenta agregar nota
      useProjectStore.getState().addNote('Nota perdida');
      
      const state = useProjectStore.getState();
      
      // Debe mostrar error
      const errorAnnotation = state.annotations.find(a => a.type === 'error');
      expect(errorAnnotation).toBeDefined();
      expect(errorAnnotation.message).toContain('documento');
    });

    it('debe mantener notas al cambiar entre documentos', () => {
      useProjectStore.getState().createProject('Test');
      
      // Primer documento
      useProjectStore.getState().loadDocument('ELEC-01');
      useProjectStore.getState().addNote('Nota ELEC');
      
      // Segundo documento
      useProjectStore.getState().loadDocument('MECH-02');
      useProjectStore.getState().addNote('Nota MECH');
      
      // Volver al primer documento
      useProjectStore.getState().loadDocument('ELEC-01');
      
      const state = useProjectStore.getState();
      const project = state.projects[0];
      const elecDoc = project.documents.find(d => d.name === 'ELEC-01');
      const mechDoc = project.documents.find(d => d.name === 'MECH-02');
      
      expect(elecDoc.notes.length).toBe(1);
      expect(elecDoc.notes[0].text).toBe('Nota ELEC');
      expect(mechDoc.notes.length).toBe(1);
      expect(mechDoc.notes[0].text).toBe('Nota MECH');
    });
  });

  describe('Flujo 2: Estado sincronizado del store', () => {
    it('debe tener activeDocumentId correcto después de /doc', () => {
      useProjectStore.getState().createProject('Test');
      useProjectStore.getState().loadDocument('ELEC-01');
      
      const state = useProjectStore.getState();
      const project = state.projects[0];
      const doc = project.documents[0];
      
      expect(state.activeDocumentId).toBe(doc.id);
    });

    it('debe mantener activeDocumentId al cambiar de documento', () => {
      useProjectStore.getState().createProject('Test');
      useProjectStore.getState().loadDocument('ELEC-01');
      useProjectStore.getState().loadDocument('MECH-02');
      
      const state = useProjectStore.getState();
      const project = state.projects[0];
      const mechDoc = project.documents.find(d => d.name === 'MECH-02');
      
      expect(state.activeDocumentId).toBe(mechDoc.id);
    });

    it('debe resetear activeDocumentId al eliminar el documento activo', () => {
      useProjectStore.getState().createProject('Test');
      useProjectStore.getState().loadDocument('ELEC-01');
      
      const initialDocId = useProjectStore.getState().activeDocumentId;
      expect(initialDocId).toBeTruthy();
      
      useProjectStore.getState().deleteDocument('ELEC-01');
      
      const state = useProjectStore.getState();
      expect(state.activeDocumentId).toBeNull();
    });
  });

  describe('Flujo 3: Observaciones requieren documento existente', () => {
    it('NO debe permitir agregar observaciones a documento inexistente', () => {
      useProjectStore.getState().createProject('Test');
      // No se carga ELEC-01
      
      useProjectStore.getState().addObservation('ELEC-01', 'Coherencia Global', 'Test', 'Fuente');
      
      const state = useProjectStore.getState();
      const project = state.projects[0];
      
      // El documento NO debe haberse creado automáticamente
      expect(project.documents.length).toBe(0);
      
      // Debe haber error
      const errorAnnotation = state.annotations.find(a => a.type === 'error');
      expect(errorAnnotation).toBeDefined();
    });

    it('debe crear observación correctamente cuando el documento existe', () => {
      useProjectStore.getState().createProject('Test');
      useProjectStore.getState().loadDocument('ELEC-01');
      useProjectStore.getState().addObservation('ELEC-01', 'Coherencia Global', 'Test', 'Fuente');
      
      const state = useProjectStore.getState();
      const doc = state.projects[0].documents[0];
      
      expect(doc.observations.length).toBe(1);
    });
  });

  describe('Flujo 4: Historial y persistencia', () => {
    it('debe mantener el historial de comandos en orden', () => {
      useProjectStore.getState().addCommandToHistory('/create project "Test"');
      useProjectStore.getState().addCommandToHistory('/doc ELEC-01');
      useProjectStore.getState().addCommandToHistory('/note "Nota"');
      
      const state = useProjectStore.getState();
      expect(state.commandHistory.length).toBe(3);
      expect(state.commandHistory[0].command).toBe('/create project "Test"');
      expect(state.commandHistory[1].command).toBe('/doc ELEC-01');
      expect(state.commandHistory[2].command).toBe('/note "Nota"');
    });

    it('debe mantener las anotaciones en orden cronológico', () => {
      useProjectStore.getState().createProject('Test');
      useProjectStore.getState().loadDocument('ELEC-01');
      useProjectStore.getState().addNote('Nota');
      
      const state = useProjectStore.getState();
      expect(state.annotations.length).toBeGreaterThan(0);
      
      // Todas las anotaciones deben tener timestamp
      state.annotations.forEach(annotation => {
        expect(annotation.timestamp).toBeDefined();
        expect(typeof annotation.timestamp).toBe('number');
      });
    });
  });

  describe('Flujo 5: Búsquedas y filtros en proyecto con datos', () => {
    it('debe buscar en observaciones de múltiples documentos', () => {
      useProjectStore.getState().createProject('Test');
      useProjectStore.getState().loadDocument('ELEC-01');
      useProjectStore.getState().loadDocument('MECH-02');
      
      useProjectStore.getState().addObservation('ELEC-01', 'Coherencia Global', 'Tensión alta', 'Fuente 1');
      useProjectStore.getState().addObservation('MECH-02', 'Coherencia Interna', 'Corriente baja', 'Fuente 2');
      
      useProjectStore.getState().searchObservations('tensión');
      
      const state = useProjectStore.getState();
      expect(state.filteredObservations.length).toBe(1);
      expect(state.filteredObservations[0].text).toBe('Tensión alta');
    });

    it('debe limpiar filtro al ejecutar nueva búsqueda', () => {
      useProjectStore.getState().createProject('Test');
      useProjectStore.getState().loadDocument('ELEC-01');
      useProjectStore.getState().addObservation('ELEC-01', 'Coherencia Global', 'Test', 'Fuente');
      
      useProjectStore.getState().filterObservations('type', 'Coherencia Global');
      let state = useProjectStore.getState();
      expect(state.filteredObservations.length).toBe(1);
      
      useProjectStore.getState().searchObservations('inexistente');
      state = useProjectStore.getState();
      expect(state.filteredObservations.length).toBe(0);
    });
  });
});
