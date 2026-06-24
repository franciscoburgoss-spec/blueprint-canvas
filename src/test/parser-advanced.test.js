import { describe, it, expect } from 'vitest';
import { parseCommand } from '../utils/parser';

describe('Parser Advanced', () => {
  describe('SHORTCUTS command', () => {
    it('debe parsear /shortcuts', () => {
      const result = parseCommand('/shortcuts');
      expect(result.type).toBe('SHORTCUTS');
    });
  });

  describe('REVIEW command', () => {
    it('debe parsear /review', () => {
      const result = parseCommand('/review');
      expect(result.type).toBe('REVIEW');
    });
  });

  describe('IMPORT command', () => {
    it('debe parsear /import con JSON', () => {
      const json = '{"name":"Test","documents":[]}';
      const result = parseCommand(`/import ${json}`);
      expect(result.type).toBe('IMPORT');
      expect(result.jsonData).toBe(json);
    });

    it('debe parsear /import con JSON multilinea', () => {
      const json = `{
        "name": "Test",
        "documents": []
      }`;
      const result = parseCommand(`/import ${json}`);
      expect(result.type).toBe('IMPORT');
      expect(result.jsonData).toContain('"name": "Test"');
    });
  });
});
