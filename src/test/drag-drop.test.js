import { describe, it, expect, beforeEach } from 'vitest';
import { useProjectStore } from '../store/projectStore';

describe('Drag & Drop - Convertir Notas en Observaciones', () => {
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

  it('debe permitir agregar una nota a un documento', () => {
    useProjectStore.getState().createProject('Test');
    useProjectStore.getState().loadDocument('ELEC-01');
    useProjectStore.getState().addNote('Nota de prueba');
    
    const state = useProjectStore.getState();
    const doc = state.projects[0].documents[0];
    expect(doc.notes.length).toBe(1);
    expect(doc.notes[0].text).toBe('Nota de prueba');
  });

  it('debe tener notas con ID único', () => {
    useProjectStore.getState().createProject('Test');
    useProjectStore.getState().loadDocument('ELEC-01');
    useProjectStore.getState().addNote('Nota 1');
    useProjectStore.getState().addNote('Nota 2');
    
    const state = useProjectStore.getState();
    const doc = state.projects[0].documents[0];
    expect(doc.notes[0].id).not.toBe(doc.notes[1].id);
  });

  it('debe tener notas con timestamp', () => {
    useProjectStore.getState().createProject('Test');
    useProjectStore.getState().loadDocument('ELEC-01');
    useProjectStore.getState().addNote('Nota de prueba');
    
    const state = useProjectStore.getState();
    const doc = state.projects[0].documents[0];
    expect(doc.notes[0].createdAt).toBeDefined();
    expect(typeof doc.notes[0].createdAt).toBe('number');
  });

  it('debe registrar la adición de nota en el timeline', () => {
    useProjectStore.getState().createProject('Test');
    useProjectStore.getState().loadDocument('ELEC-01');
    useProjectStore.getState().addNote('Nota de prueba');
    
    const state = useProjectStore.getState();
    expect(state.timeline.length).toBeGreaterThan(0);
    const noteEvent = state.timeline.find(e => e.action === 'ADD_NOTE');
    expect(noteEvent).toBeDefined();
    expect(noteEvent.details).toContain('Nota de prueba');
  });

  it('debe permitir múltiples notas en un documento', () => {
    useProjectStore.getState().createProject('Test');
    useProjectStore.getState().loadDocument('ELEC-01');
    useProjectStore.getState().addNote('Nota 1');
    useProjectStore.getState().addNote('Nota 2');
    useProjectStore.getState().addNote('Nota 3');
    
    const state = useProjectStore.getState();
    const doc = state.projects[0].documents[0];
    expect(doc.notes.length).toBe(3);
  });

  it('debe mantener las notas separadas por documento', () => {
    useProjectStore.getState().createProject('Test');
    
    // Cargar ELEC-01 y agregar nota
    useProjectStore.getState().loadDocument('ELEC-01');
    useProjectStore.getState().addNote('Nota ELEC');
    
    // Cargar MECH-02 y agregar nota
    useProjectStore.getState().loadDocument('MECH-02');
    useProjectStore.getState().addNote('Nota MECH');
    
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

  it('debe mostrar error al intentar agregar nota sin documento activo', () => {
    useProjectStore.getState().createProject('Test');
    // No se carga ningún documento
    
    useProjectStore.getState().addNote('Nota perdida');
    
    const state = useProjectStore.getState();
    const errorAnnotation = state.annotations.find(a => a.type === 'error');
    expect(errorAnnotation).toBeDefined();
    expect(errorAnnotation.message).toContain('documento');
  });

  it('debe mantener activeDocumentId correcto al cambiar entre documentos', () => {
    useProjectStore.getState().createProject('Test');
    useProjectStore.getState().loadDocument('ELEC-01');
    
    const state1 = useProjectStore.getState();
    const elecDocId = state1.activeDocumentId;
    
    useProjectStore.getState().loadDocument('MECH-02');
    
    const state2 = useProjectStore.getState();
    const mechDocId = state2.activeDocumentId;
    
    expect(elecDocId).not.toBe(mechDocId);
    expect(mechDocId).toBeTruthy();
  });
});
