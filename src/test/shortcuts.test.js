import { describe, it, expect } from 'vitest';
import { SHORTCUTS } from '../hooks/useKeyboardShortcuts';

describe('Keyboard Shortcuts', () => {
  it('debe tener todos los atajos definidos', () => {
    expect(SHORTCUTS.length).toBeGreaterThan(0);
  });

  it('debe incluir el atajo para enfocar input', () => {
    const focusShortcut = SHORTCUTS.find(s => s.keys.includes('K'));
    expect(focusShortcut).toBeDefined();
    expect(focusShortcut.description).toContain('Enfocar');
  });

  it('debe incluir el atajo para limpiar chat', () => {
    const clearShortcut = SHORTCUTS.find(s => s.keys.includes('L'));
    expect(clearShortcut).toBeDefined();
    expect(clearShortcut.description).toContain('Limpiar');
  });

  it('debe incluir el atajo de Escape', () => {
    const escShortcut = SHORTCUTS.find(s => s.keys.includes('Esc'));
    expect(escShortcut).toBeDefined();
  });

  it('debe incluir el atajo para ejecutar /help', () => {
    const helpShortcut = SHORTCUTS.find(s => s.keys.includes('H'));
    expect(helpShortcut).toBeDefined();
    expect(helpShortcut.description).toContain('/help');
  });

  it('debe incluir el atajo para ejecutar /status', () => {
    const statusShortcut = SHORTCUTS.find(s => s.keys.includes('S'));
    expect(statusShortcut).toBeDefined();
    expect(statusShortcut.description).toContain('/status');
  });

  it('debe incluir el atajo para exportar', () => {
    const exportShortcut = SHORTCUTS.find(s => s.keys.includes('E'));
    expect(exportShortcut).toBeDefined();
    expect(exportShortcut.description).toContain('Markdown');
  });

  it('debe incluir el atajo para nueva nota', () => {
    const noteShortcut = SHORTCUTS.find(s => s.keys.includes('N'));
    expect(noteShortcut).toBeDefined();
    expect(noteShortcut.description).toContain('nota');
  });

  it('cada atajo debe tener keys y description', () => {
    SHORTCUTS.forEach(shortcut => {
      expect(shortcut.keys).toBeDefined();
      expect(shortcut.description).toBeDefined();
      expect(shortcut.keys.length).toBeGreaterThan(0);
      expect(shortcut.description.length).toBeGreaterThan(0);
    });
  });

  it('no debe tener atajos duplicados', () => {
    const keys = SHORTCUTS.map(s => s.keys);
    const uniqueKeys = new Set(keys);
    expect(uniqueKeys.size).toBe(keys.length);
  });
});
