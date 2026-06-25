import { describe, it, expect, beforeEach } from 'vitest';
import { useProjectStore } from '../store/projectStore';

describe('Timeline', () => {
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

  it('debe registrar la creación de un proyecto en el timeline', () => {
    useProjectStore.getState().createProject('Test Project');
    
    const state = useProjectStore.getState();
    expect(state.timeline.length).toBe(1);
    expect(state.timeline[0].action).toBe('CREATE_PROJECT');
    expect(state.timeline[0].details).toContain('Test Project');
  });

  it('debe registrar la carga de un documento en el timeline', () => {
    useProjectStore.getState().createProject('Test');
    useProjectStore.getState().loadDocument('ELEC-01', 'Eléctrica');
    
    const state = useProjectStore.getState();
    expect(state.timeline.length).toBe(2);
    expect(state.timeline[1].action).toBe('LOAD_DOCUMENT');
  });

  it('debe registrar la adición de una observación en el timeline', () => {
    useProjectStore.getState().createProject('Test');
    useProjectStore.getState().loadDocument('ELEC-01');
    useProjectStore.getState().addObservation('ELEC-01', 'Coherencia Global', 'Test', 'Fuente');
    
    const state = useProjectStore.getState();
    expect(state.timeline.length).toBe(3);
    expect(state.timeline[2].action).toBe('ADD_OBSERVATION');
  });

  it('debe registrar la aprobación de una observación en el timeline', () => {
    useProjectStore.getState().createProject('Test');
    useProjectStore.getState().loadDocument('ELEC-01');
    useProjectStore.getState().addObservation('ELEC-01', 'Coherencia Global', 'Test', 'Fuente');
    
    const obsId = useProjectStore.getState().projects[0].documents[0].observations[0].id;
    useProjectStore.getState().approveObservation(obsId);
    
    const state = useProjectStore.getState();
    expect(state.timeline.length).toBe(4);
    expect(state.timeline[3].action).toBe('APPROVE_OBSERVATION');
  });

  it('debe registrar la adición de una nota en el timeline', () => {
    useProjectStore.getState().createProject('Test');
    useProjectStore.getState().loadDocument('ELEC-01');
    useProjectStore.getState().addDocumentNote('Test note');
    
    const state = useProjectStore.getState();
    expect(state.timeline.length).toBe(3);
    expect(state.timeline[2].action).toBe('ADD_DOCUMENT_NOTE');
  });

  it('debe mantener el orden cronológico del timeline', () => {
    useProjectStore.getState().createProject('Test 1');
    useProjectStore.getState().createProject('Test 2');
    
    const state = useProjectStore.getState();
    // Verificar que el primer evento fue CREATE_PROJECT de "Test 1"
    expect(state.timeline[0].details).toContain('Test 1');
    // Verificar que el segundo evento fue CREATE_PROJECT de "Test 2"
    expect(state.timeline[1].details).toContain('Test 2');
    // Verificar que los timestamps son iguales o el primero es menor
    // (pueden ser iguales si las llamadas ocurren en el mismo milisegundo)
    expect(state.timeline[0].timestamp).toBeLessThanOrEqual(state.timeline[1].timestamp);
  });

  it('debe limpiar el timeline con clearTimeline', () => {
    useProjectStore.getState().createProject('Test');
    useProjectStore.getState().clearTimeline();
    
    const state = useProjectStore.getState();
    expect(state.timeline.length).toBe(0);
  });

  it('debe tener IDs únicos en cada evento del timeline', () => {
    useProjectStore.getState().createProject('Test 1');
    useProjectStore.getState().createProject('Test 2');
    
    const state = useProjectStore.getState();
    const ids = state.timeline.map(e => e.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('debe incluir timestamp en cada evento', () => {
    useProjectStore.getState().createProject('Test');
    
    const state = useProjectStore.getState();
    expect(state.timeline[0].timestamp).toBeDefined();
    expect(typeof state.timeline[0].timestamp).toBe('number');
    expect(state.timeline[0].timestamp).toBeGreaterThan(0);
  });
});
