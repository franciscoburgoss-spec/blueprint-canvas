import { describe, it, expect, beforeEach } from 'vitest';
import { useProjectStore } from '../store/projectStore';
import { parseCommand } from '../utils/parser';

describe('Document Comparator', () => {
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

  describe('Parser - /compare command', () => {
    it('debe parsear /compare correctamente', () => {
      const result = parseCommand('/compare');
      expect(result.type).toBe('COMPARE');
    });

    it('debe ser case-insensitive', () => {
      const result = parseCommand('/COMPARE');
      expect(result.type).toBe('COMPARE');
    });
  });

  describe('Store - Multiple documents', () => {
    it('debe permitir crear múltiples documentos en un proyecto', () => {
      useProjectStore.getState().createProject('Test');
      useProjectStore.getState().loadDocument('ELEC-01', 'Eléctrica');
      useProjectStore.getState().loadDocument('MECH-02', 'Mecánica');
      useProjectStore.getState().loadDocument('CIVIL-03', 'Civil');
      
      const state = useProjectStore.getState();
      expect(state.projects[0].documents.length).toBe(3);
    });

    it('debe mantener disciplinas diferentes para cada documento', () => {
      useProjectStore.getState().createProject('Test');
      useProjectStore.getState().loadDocument('ELEC-01', 'Eléctrica');
      useProjectStore.getState().loadDocument('MECH-02', 'Mecánica');
      
      const state = useProjectStore.getState();
      const project = state.projects[0];
      const elecDoc = project.documents.find(d => d.name === 'ELEC-01');
      const mechDoc = project.documents.find(d => d.name === 'MECH-02');
      
      expect(elecDoc.discipline).toBe('Eléctrica');
      expect(mechDoc.discipline).toBe('Mecánica');
    });

    it('debe permitir observaciones en múltiples documentos', () => {
      useProjectStore.getState().createProject('Test');
      useProjectStore.getState().loadDocument('ELEC-01');
      useProjectStore.getState().loadDocument('MECH-02');
      
      useProjectStore.getState().addObservation('ELEC-01', 'Coherencia Global', 'Obs ELEC', 'Fuente 1');
      useProjectStore.getState().addObservation('MECH-02', 'Coherencia Interna', 'Obs MECH', 'Fuente 2');
      
      const state = useProjectStore.getState();
      const project = state.projects[0];
      const elecDoc = project.documents.find(d => d.name === 'ELEC-01');
      const mechDoc = project.documents.find(d => d.name === 'MECH-02');
      
      expect(elecDoc.observations.length).toBe(1);
      expect(elecDoc.observations[0].text).toBe('Obs ELEC');
      expect(mechDoc.observations.length).toBe(1);
      expect(mechDoc.observations[0].text).toBe('Obs MECH');
    });

    it('debe permitir notas en múltiples documentos', () => {
      useProjectStore.getState().createProject('Test');
      
      // Cargar ELEC-01 y agregar nota
      useProjectStore.getState().loadDocument('ELEC-01');
      useProjectStore.getState().addDocumentNote('Nota ELEC');
      
      // Cargar MECH-02 y agregar nota
      useProjectStore.getState().loadDocument('MECH-02');
      useProjectStore.getState().addDocumentNote('Nota MECH');
      
      const state = useProjectStore.getState();
      const project = state.projects[0];
      const elecDoc = project.documents.find(d => d.name === 'ELEC-01');
      const mechDoc = project.documents.find(d => d.name === 'MECH-02');
      
      // Cada documento debe tener exactamente 1 nota
      expect(elecDoc.notes.length).toBe(1);
      expect(elecDoc.notes[0].text).toBe('Nota ELEC');
      expect(mechDoc.notes.length).toBe(1);
      expect(mechDoc.notes[0].text).toBe('Nota MECH');
    });
  });

  describe('Comparación de datos', () => {
    it('debe poder contar observaciones por documento', () => {
      useProjectStore.getState().createProject('Test');
      useProjectStore.getState().loadDocument('ELEC-01');
      useProjectStore.getState().loadDocument('MECH-02');
      
      useProjectStore.getState().addObservation('ELEC-01', 'Coherencia Global', 'Obs 1', 'Fuente');
      useProjectStore.getState().addObservation('ELEC-01', 'Coherencia Interna', 'Obs 2', 'Fuente');
      useProjectStore.getState().addObservation('MECH-02', 'Observación Propia', 'Obs 3', 'Fuente');
      
      const state = useProjectStore.getState();
      const project = state.projects[0];
      
      const elecCount = project.documents.find(d => d.name === 'ELEC-01').observations.length;
      const mechCount = project.documents.find(d => d.name === 'MECH-02').observations.length;
      
      expect(elecCount).toBe(2);
      expect(mechCount).toBe(1);
    });

    it('debe poder contar observaciones aprobadas por documento', () => {
      useProjectStore.getState().createProject('Test');
      useProjectStore.getState().loadDocument('ELEC-01');
      
      useProjectStore.getState().addObservation('ELEC-01', 'Coherencia Global', 'Obs 1', 'Fuente');
      useProjectStore.getState().addObservation('ELEC-01', 'Coherencia Interna', 'Obs 2', 'Fuente');
      
      const obsId = useProjectStore.getState().projects[0].documents[0].observations[0].id;
      useProjectStore.getState().approveObservation(obsId);
      
      const state = useProjectStore.getState();
      const doc = state.projects[0].documents[0];
      const approvedCount = doc.observations.filter(obs => obs.status === 'aprobada').length;
      
      expect(approvedCount).toBe(1);
    });
  });
});
