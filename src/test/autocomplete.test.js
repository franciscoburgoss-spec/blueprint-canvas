import { describe, it, expect } from 'vitest';
import { getSuggestions, COMMANDS, OBSERVATION_TYPES, PRIORITIES, STATUSES } from '../utils/autocomplete';

describe('Autocomplete System', () => {
  describe('getSuggestions - comandos base', () => {
    it('debe sugerir comandos que empiezan con /', async () => {
      const suggestions = getSuggestions('/cr');
      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions.some(s => s.display.includes('/create'))).toBe(true);
    });

    it('debe sugerir múltiples comandos para /', async () => {
      const suggestions = getSuggestions('/');
      expect(suggestions.length).toBeGreaterThan(5);
    });

    it('debe filtrar comandos por prefijo', async () => {
      const suggestions = getSuggestions('/obs');
      expect(suggestions.every(s => s.display.toLowerCase().includes('/obs'))).toBe(true);
    });

    it('no debe sugerir si no empieza con /', async () => {
      const suggestions = getSuggestions('texto normal');
      expect(suggestions.length).toBe(0);
    });

    it('no debe sugerir si el input está vacío', async () => {
      const suggestions = getSuggestions('');
      expect(suggestions.length).toBe(0);
    });

    it('debe ser case-insensitive', async () => {
      const lower = getSuggestions('/cr');
      const upper = getSuggestions('/CR');
      expect(lower.length).toBe(upper.length);
    });
  });

  describe('getSuggestions - contexto de documentos', () => {
    const mockContext = {
      projects: [{
        id: 'PROJ-1',
        name: 'Test',
        documents: [
          { id: 'DOC-1', name: 'ELEC-01', discipline: 'Eléctrica', observations: [], notes: [] },
          { id: 'DOC-2', name: 'MECH-02', discipline: 'Mecánica', observations: [], notes: [] },
        ],
        notes: [],
      }],
      activeProjectId: 'PROJ-1',
      activeDocumentId: null,
    };

    it('debe sugerir documentos existentes para /doc', async () => {
      const suggestions = getSuggestions('/doc ', mockContext);
      const docSuggestions = suggestions.filter(s => s.category === 'documento');
      expect(docSuggestions.length).toBe(2);
      expect(docSuggestions.some(s => s.display === 'ELEC-01')).toBe(true);
      expect(docSuggestions.some(s => s.display === 'MECH-02')).toBe(true);
    });

    it('debe sugerir documentos para /obs', async () => {
      const suggestions = getSuggestions('/obs ', mockContext);
      const docSuggestions = suggestions.filter(s => s.category === 'documento');
      expect(docSuggestions.length).toBe(2);
    });
  });

  describe('getSuggestions - contexto de observaciones', () => {
    const mockContext = {
      projects: [{
        id: 'PROJ-1',
        name: 'Test',
        documents: [{
          id: 'DOC-1',
          name: 'ELEC-01',
          discipline: 'Eléctrica',
          observations: [
            { id: 'OBS-2026-001', text: 'Tensión alta', status: 'pendiente' },
            { id: 'OBS-2026-002', text: 'Corriente baja', status: 'aprobada' },
          ],
          notes: [],
        }],
        notes: [],
      }],
      activeProjectId: 'PROJ-1',
      activeDocumentId: 'DOC-1',
    };

    it('debe sugerir IDs de observaciones para /approve', async () => {
      const suggestions = getSuggestions('/approve ', mockContext);
      const obsSuggestions = suggestions.filter(s => s.category === 'observación');
      expect(obsSuggestions.length).toBe(2);
      expect(obsSuggestions.some(s => s.display === 'OBS-2026-001')).toBe(true);
    });

    it('debe sugerir IDs de observaciones para /reject', async () => {
      const suggestions = getSuggestions('/reject ', mockContext);
      const obsSuggestions = suggestions.filter(s => s.category === 'observación');
      expect(obsSuggestions.length).toBe(2);
    });

    it('debe sugerir IDs de observaciones para /edit', async () => {
      const suggestions = getSuggestions('/edit ', mockContext);
      const obsSuggestions = suggestions.filter(s => s.category === 'observación');
      expect(obsSuggestions.length).toBe(2);
    });
  });

  describe('getSuggestions - tipos de observación', () => {
    const mockContext = {
      projects: [{
        id: 'PROJ-1',
        name: 'Test',
        documents: [{ id: 'DOC-1', name: 'ELEC-01', observations: [], notes: [] }],
        notes: [],
      }],
      activeProjectId: 'PROJ-1',
    };

    it('debe sugerir tipos de observación para /obs DOC', async () => {
      const suggestions = getSuggestions('/obs ELEC-01 ', mockContext);
      const typeSuggestions = suggestions.filter(s => s.category === 'tipo');
      expect(typeSuggestions.length).toBe(3);
      OBSERVATION_TYPES.forEach(type => {
        expect(typeSuggestions.some(s => s.display === type)).toBe(true);
      });
    });
  });

  describe('getSuggestions - prioridades', () => {
    const mockContext = {
      projects: [{
        id: 'PROJ-1',
        name: 'Test',
        documents: [{
          id: 'DOC-1',
          name: 'ELEC-01',
          observations: [{ id: 'OBS-1', text: 'Test' }],
          notes: [],
        }],
        notes: [],
      }],
      activeProjectId: 'PROJ-1',
    };

    it('debe sugerir prioridades para /priority OBS-ID', async () => {
      const suggestions = getSuggestions('/priority OBS-1 ', mockContext);
      const prioritySuggestions = suggestions.filter(s => s.category === 'prioridad');
      expect(prioritySuggestions.length).toBe(3);
      PRIORITIES.forEach(p => {
        expect(prioritySuggestions.some(s => s.display === p)).toBe(true);
      });
    });
  });

  describe('getSuggestions - filtros', () => {
    it('debe sugerir type y status para /filter', async () => {
      const suggestions = getSuggestions('/filter ');
      const filterSuggestions = suggestions.filter(s => s.category === 'filtro');
      expect(filterSuggestions.length).toBe(2);
      expect(filterSuggestions.some(s => s.display === 'type')).toBe(true);
      expect(filterSuggestions.some(s => s.display === 'status')).toBe(true);
    });

    it('debe sugerir estados para /filter status', async () => {
      const suggestions = getSuggestions('/filter status ');
      const statusSuggestions = suggestions.filter(s => s.category === 'estado');
      expect(statusSuggestions.length).toBe(3);
      STATUSES.forEach(s => {
        expect(statusSuggestions.some(sug => sug.display === s)).toBe(true);
      });
    });
  });

  describe('getSuggestions - listados', () => {
    it('debe sugerir items para /list', async () => {
      const suggestions = getSuggestions('/list ');
      const listSuggestions = suggestions.filter(s => s.category === 'listado');
      expect(listSuggestions.length).toBe(4);
      ['projects', 'docs', 'obs', 'notes'].forEach(item => {
        expect(listSuggestions.some(s => s.display === item)).toBe(true);
      });
    });

    it('debe sugerir items para /delete', async () => {
      const suggestions = getSuggestions('/delete ');
      const deleteSuggestions = suggestions.filter(s => s.category === 'eliminación');
      expect(deleteSuggestions.length).toBe(3);
      ['project', 'doc', 'obs'].forEach(item => {
        expect(deleteSuggestions.some(s => s.display === item)).toBe(true);
      });
    });
  });

  describe('getSuggestions - exportación', () => {
    it('debe sugerir formatos para /export', async () => {
      const suggestions = getSuggestions('/export ');
      const exportSuggestions = suggestions.filter(s => s.category === 'exportación');
      expect(exportSuggestions.length).toBe(3);
      expect(exportSuggestions.some(s => s.display === 'markdown')).toBe(true);
      expect(exportSuggestions.some(s => s.display === 'json')).toBe(true);
      expect(exportSuggestions.some(s => s.display === 'pdf')).toBe(true);
    });
  });

  describe('getSuggestions - comandos de proyecto', () => {
    it('debe sugerir /current', async () => {
      const suggestions = getSuggestions('/cu');
      expect(suggestions.some(s => s.display.includes('/current'))).toBe(true);
    });

    it('debe sugerir /use', async () => {
      const suggestions = getSuggestions('/us');
      expect(suggestions.some(s => s.display.includes('/use'))).toBe(true);
    });

    it('debe sugerir /docs', async () => {
      const suggestions = getSuggestions('/do');
      expect(suggestions.some(s => s.display.includes('/docs'))).toBe(true);
    });
  });

  describe('Validación de estructura', () => {
    it('todas las sugerencias deben tener la estructura correcta', async () => {
      const suggestions = getSuggestions('/');
      suggestions.forEach(s => {
        expect(s.type).toBeDefined();
        expect(s.display).toBeDefined();
        expect(s.description).toBeDefined();
        expect(s.category).toBeDefined();
        expect(s.insertText).toBeDefined();
      });
    });

    it('no debe haber más de 8 sugerencias', async () => {
      const suggestions = getSuggestions('/');
      expect(suggestions.length).toBeLessThanOrEqual(8);
    });

    it('COMMANDS debe tener al menos 20 comandos definidos', async () => {
      expect(COMMANDS.length).toBeGreaterThanOrEqual(20);
    });

    it('Cada comando debe tener cmd, desc y category', async () => {
      COMMANDS.forEach(cmd => {
        expect(cmd.cmd).toBeDefined();
        expect(cmd.desc).toBeDefined();
        expect(cmd.category).toBeDefined();
      });
    });
  });
});
