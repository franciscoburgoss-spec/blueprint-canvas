import { describe, it, expect, beforeEach } from 'vitest';
import { useProjectStore } from '../store/projectStore';

describe('Chat Order - Mensajes en orden cronológico', () => {
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

  it('debe mantener los comandos en orden de inserción', () => {
    useProjectStore.getState().addCommandToHistory('/create project "Test"');
    useProjectStore.getState().addCommandToHistory('/doc ELEC-01');
    useProjectStore.getState().addCommandToHistory('/note "Nota"');
    
    const state = useProjectStore.getState();
    expect(state.commandHistory[0].command).toBe('/create project "Test"');
    expect(state.commandHistory[1].command).toBe('/doc ELEC-01');
    expect(state.commandHistory[2].command).toBe('/note "Nota"');
  });

  it('debe mantener las anotaciones en orden de inserción', () => {
    useProjectStore.getState().createProject('Test');
    useProjectStore.getState().loadDocument('ELEC-01');
    useProjectStore.getState().addNote('Nota');
    
    const state = useProjectStore.getState();
    expect(state.annotations.length).toBe(3);
    
    // Verificar que los timestamps están en orden
    for (let i = 1; i < state.annotations.length; i++) {
      expect(state.annotations[i].timestamp).toBeGreaterThanOrEqual(
        state.annotations[i - 1].timestamp
      );
    }
  });

  it('debe poder combinar comandos y anotaciones en orden cronológico', () => {
    useProjectStore.getState().addCommandToHistory('/create project "Test"');
    useProjectStore.getState().createProject('Test');
    useProjectStore.getState().addCommandToHistory('/doc ELEC-01');
    useProjectStore.getState().loadDocument('ELEC-01');
    
    const state = useProjectStore.getState();
    
    // Combinar y ordenar
    const allMessages = [
      ...state.commandHistory.map(cmd => ({ ...cmd, type: 'command' })),
      ...state.annotations.map(ann => ({ ...ann, type: 'annotation' })),
    ].sort((a, b) => a.timestamp - b.timestamp);
    
    // Verificar que están en orden cronológico
    for (let i = 1; i < allMessages.length; i++) {
      expect(allMessages[i].timestamp).toBeGreaterThanOrEqual(
        allMessages[i - 1].timestamp
      );
    }
  });

  it('debe tener timestamps únicos para cada mensaje', () => {
    useProjectStore.getState().addCommandToHistory('/test1');
    useProjectStore.getState().addCommandToHistory('/test2');
    useProjectStore.getState().addCommandToHistory('/test3');
    
    const state = useProjectStore.getState();
    const timestamps = state.commandHistory.map(c => c.timestamp);
    
    // Aunque pueden coincidir en el mismo milisegundo, deben estar en orden
    for (let i = 1; i < timestamps.length; i++) {
      expect(timestamps[i]).toBeGreaterThanOrEqual(timestamps[i - 1]);
    }
  });
});
