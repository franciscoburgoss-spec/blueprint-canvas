import { describe, it, expect } from 'vitest';
import { parseCommand, generateObservationId, getHelpText } from '../utils/parser';

describe('Parser', () => {
  describe('parseCommand', () => {
    it('debe parsear comando CREATE_PROJECT correctamente', () => {
      const input = '/create project "Edificio Central"';
      const result = parseCommand(input);
      
      expect(result.type).toBe('CREATE_PROJECT');
      expect(result.name).toBe('Edificio Central');
    });

    it('debe parsear comando LOAD_DOCUMENT con disciplina', () => {
      const input = '/doc ELEC-01 Eléctrica';
      const result = parseCommand(input);
      
      expect(result.type).toBe('LOAD_DOCUMENT');
      expect(result.docName).toBe('ELEC-01');
      expect(result.discipline).toBe('Eléctrica');
    });

    it('debe parsear comando LOAD_DOCUMENT sin disciplina (default: General)', () => {
      const input = '/doc MECH-02';
      const result = parseCommand(input);
      
      expect(result.type).toBe('LOAD_DOCUMENT');
      expect(result.docName).toBe('MECH-02');
      expect(result.discipline).toBe('General');
    });

    it('debe parsear comando ADD_OBSERVATION correctamente', () => {
      const input = '/obs ELEC-01 Coherencia Global: "Tensión no coincide" | Fuente: Sección 4.2';
      const result = parseCommand(input);
      
      expect(result.type).toBe('ADD_OBSERVATION');
      expect(result.docName).toBe('ELEC-01');
      expect(result.obsType).toBe('Coherencia Global');
      expect(result.text).toBe('Tensión no coincide');
      expect(result.source).toBe('Sección 4.2');
    });

    it('debe parsear comando ADD_NOTE correctamente', () => {
      const input = '/note "Verificar con equipo HVAC"';
      const result = parseCommand(input);
      
      expect(result.type).toBe('PROJECT_NOTE');
      expect(result.text).toBe('Verificar con equipo HVAC');
    });

    it('debe parsear comando HELP correctamente', () => {
      const input = '/help';
      const result = parseCommand(input);
      
      expect(result.type).toBe('HELP');
    });

    it('debe retornar INVALID_COMMAND para comandos no reconocidos', () => {
      const input = '/invalid command';
      const result = parseCommand(input);
      
      expect(result.type).toBe('INVALID_COMMAND');
      expect(result.error).toBeDefined();
    });

    it('debe ser case-insensitive', () => {
      const input = '/CREATE PROJECT "Test"';
      const result = parseCommand(input);
      
      expect(result.type).toBe('CREATE_PROJECT');
    });

    it('debe manejar espacios extra', () => {
      const input = '  /create   project   "Test"  ';
      const result = parseCommand(input);
      
      expect(result.type).toBe('CREATE_PROJECT');
      expect(result.name).toBe('Test');
    });
  });

  describe('generateObservationId', () => {
    it('debe generar un ID con formato OBS-AÑO-NÚMERO', () => {
      const id = generateObservationId();
      
      expect(id).toMatch(/^OBS-\d{4}-\d{3}$/);
    });

    it('debe generar IDs únicos', () => {
      const ids = new Set();
      for (let i = 0; i < 100; i++) {
        ids.add(generateObservationId());
      }
      
      // Aunque no garantiza unicidad absoluta, debería generar muchos únicos
      expect(ids.size).toBeGreaterThan(90);
    });
  });

  describe('getHelpText', () => {
    it('debe retornar texto de ayuda no vacío', () => {
      const helpText = getHelpText();
      
      expect(helpText).toBeDefined();
      expect(helpText.length).toBeGreaterThan(0);
    });

    it('debe incluir todos los comandos principales', () => {
      const helpText = getHelpText();
      
      expect(helpText).toContain('/create project');
      expect(helpText).toContain('/doc');
      expect(helpText).toContain('/obs');
      expect(helpText).toContain('/note');
      expect(helpText).toContain('/help');
    });
  });
});
