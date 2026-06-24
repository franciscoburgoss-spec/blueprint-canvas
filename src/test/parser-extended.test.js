import { describe, it, expect } from 'vitest';
import { parseCommand } from '../utils/parser';

describe('Parser Extended', () => {
  describe('LIST command', () => {
    it('debe parsear /list projects', () => {
      const result = parseCommand('/list projects');
      expect(result.type).toBe('LIST');
      expect(result.itemType).toBe('projects');
    });

    it('debe parsear /list docs', () => {
      const result = parseCommand('/list docs');
      expect(result.type).toBe('LIST');
      expect(result.itemType).toBe('docs');
    });

    it('debe parsear /list obs', () => {
      const result = parseCommand('/list obs');
      expect(result.type).toBe('LIST');
      expect(result.itemType).toBe('obs');
    });
  });

  describe('DELETE command', () => {
    it('debe parsear /delete project', () => {
      const result = parseCommand('/delete project "Test"');
      expect(result.type).toBe('DELETE');
      expect(result.itemType).toBe('project');
      expect(result.itemName).toBe('"Test"');
    });

    it('debe parsear /delete doc', () => {
      const result = parseCommand('/delete doc ELEC-01');
      expect(result.type).toBe('DELETE');
      expect(result.itemType).toBe('doc');
      expect(result.itemName).toBe('ELEC-01');
    });

    it('debe parsear /delete obs', () => {
      const result = parseCommand('/delete obs OBS-2026-001');
      expect(result.type).toBe('DELETE');
      expect(result.itemType).toBe('obs');
      expect(result.itemName).toBe('OBS-2026-001');
    });
  });

  describe('APPROVE/REJECT commands', () => {
    it('debe parsear /approve', () => {
      const result = parseCommand('/approve OBS-2026-001');
      expect(result.type).toBe('APPROVE');
      expect(result.obsId).toBe('OBS-2026-001');
    });

    it('debe parsear /reject', () => {
      const result = parseCommand('/reject OBS-2026-001');
      expect(result.type).toBe('REJECT');
      expect(result.obsId).toBe('OBS-2026-001');
    });
  });

  describe('EXPORT command', () => {
    it('debe parsear /export markdown', () => {
      const result = parseCommand('/export markdown');
      expect(result.type).toBe('EXPORT');
      expect(result.format).toBe('markdown');
    });

    it('debe parsear /export json', () => {
      const result = parseCommand('/export json');
      expect(result.type).toBe('EXPORT');
      expect(result.format).toBe('json');
    });
  });

  describe('SEARCH command', () => {
    it('debe parsear /search', () => {
      const result = parseCommand('/search "tensión"');
      expect(result.type).toBe('SEARCH');
      expect(result.query).toBe('tensión');
    });
  });

  describe('FILTER command', () => {
    it('debe parsear /filter type', () => {
      const result = parseCommand('/filter type "Coherencia Global"');
      expect(result.type).toBe('FILTER');
      expect(result.filterType).toBe('type');
      expect(result.filterValue).toBe('Coherencia Global');
    });

    it('debe parsear /filter status', () => {
      const result = parseCommand('/filter status "pendiente"');
      expect(result.type).toBe('FILTER');
      expect(result.filterType).toBe('status');
      expect(result.filterValue).toBe('pendiente');
    });
  });

  describe('TAG command', () => {
    it('debe parsear /tag', () => {
      const result = parseCommand('/tag OBS-2026-001 "crítico"');
      expect(result.type).toBe('TAG');
      expect(result.obsId).toBe('OBS-2026-001');
      expect(result.tag).toBe('crítico');
    });
  });

  describe('PRIORITY command', () => {
    it('debe parsear /priority alta', () => {
      const result = parseCommand('/priority OBS-2026-001 alta');
      expect(result.type).toBe('PRIORITY');
      expect(result.obsId).toBe('OBS-2026-001');
      expect(result.priority).toBe('alta');
    });

    it('debe parsear /priority media', () => {
      const result = parseCommand('/priority OBS-2026-001 media');
      expect(result.type).toBe('PRIORITY');
      expect(result.priority).toBe('media');
    });

    it('debe parsear /priority baja', () => {
      const result = parseCommand('/priority OBS-2026-001 baja');
      expect(result.type).toBe('PRIORITY');
      expect(result.priority).toBe('baja');
    });
  });

  describe('COMMENT command', () => {
    it('debe parsear /comment', () => {
      const result = parseCommand('/comment OBS-2026-001 "Revisar con equipo"');
      expect(result.type).toBe('COMMENT');
      expect(result.obsId).toBe('OBS-2026-001');
      expect(result.comment).toBe('Revisar con equipo');
    });
  });

  describe('CLEAR and STATUS commands', () => {
    it('debe parsear /clear', () => {
      const result = parseCommand('/clear');
      expect(result.type).toBe('CLEAR');
    });

    it('debe parsear /status', () => {
      const result = parseCommand('/status');
      expect(result.type).toBe('STATUS');
    });
  });
});
