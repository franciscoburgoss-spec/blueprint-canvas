import { describe, it, expect } from 'vitest';
import { COMMANDS, getSuggestions } from '../utils/autocomplete';

describe('Autocomplete Examples', () => {
  it('todos los comandos deben tener un ejemplo', async () => {
    COMMANDS.forEach(cmd => {
      expect(cmd.example).toBeDefined();
      expect(cmd.example.length).toBeGreaterThan(0);
    });
  });

  it('los ejemplos deben empezar con /', async () => {
    COMMANDS.forEach(cmd => {
      expect(cmd.example.startsWith('/')).toBe(true);
    });
  });

  it('los ejemplos deben ser coherentes con el comando', async () => {
    COMMANDS.forEach(cmd => {
      const cmdBase = cmd.cmd.split(' ')[0];
      const exampleBase = cmd.example.split(' ')[0];
      expect(cmdBase).toBe(exampleBase);
    });
  });

  it('las sugerencias deben incluir el campo example', async () => {
    const suggestions = getSuggestions('/create');
    const createCmd = suggestions.find(s => s.display.includes('/create'));
    expect(createCmd).toBeDefined();
    expect(createCmd.example).toBeDefined();
    expect(createCmd.example).toContain('/create project');
  });

  it('los ejemplos deben ser prácticos y realistas', async () => {
    const obsCmd = COMMANDS.find(c => c.cmd.startsWith('/obs'));
    expect(obsCmd.example).toContain('Coherencia');
    expect(obsCmd.example).toContain('Fuente:');
    
    const noteCmd = COMMANDS.find(c => c.cmd.startsWith('/note'));
    expect(noteCmd.example).toContain('"');
    
    const tagCmd = COMMANDS.find(c => c.cmd.startsWith('/tag'));
    expect(tagCmd.example).toContain('"');
  });

  it('debe haber ejemplos para todos los tipos de exportación', async () => {
    const exportCmds = COMMANDS.filter(c => c.cmd.startsWith('/export'));
    expect(exportCmds.length).toBe(3);
    
    const formats = exportCmds.map(c => c.example.split(' ')[1]);
    expect(formats).toContain('markdown');
    expect(formats).toContain('json');
    expect(formats).toContain('pdf');
  });
});
