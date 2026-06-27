import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { parseCommand } from '../utils/parser';

describe('Documentation System', () => {
  describe('Parser', () => {
    it('debe parsear /docs correctamente', async () => {
      const result = parseCommand('/docs');
      expect(result.type).toBe('DOCS');
    });

    it('debe ser case-insensitive para /docs', async () => {
      const result = parseCommand('/DOCS');
      expect(result.type).toBe('DOCS');
    });

    it('debe incluir /docs en la ayuda', async () => {
      const { getHelpText } = await import('../utils/parser');
      const help = getHelpText();
      expect(help).toContain('/docs');
    });
  });

  describe('Autocomplete', () => {
    it('debe incluir /docs en las sugerencias', async () => {
      const { getSuggestions } = await import('../utils/autocomplete');
      const suggestions = getSuggestions('/do');
      expect(suggestions.some(s => s.display.includes('/docs'))).toBe(true);
    });

    it('debe incluir /current en las sugerencias', async () => {
      const { getSuggestions } = await import('../utils/autocomplete');
      const suggestions = getSuggestions('/cu');
      expect(suggestions.some(s => s.display.includes('/current'))).toBe(true);
    });

    it('debe incluir /use en las sugerencias', async () => {
      const { getSuggestions } = await import('../utils/autocomplete');
      const suggestions = getSuggestions('/us');
      expect(suggestions.some(s => s.display.includes('/use'))).toBe(true);
    });

    it('debe incluir /export pdf en las sugerencias', async () => {
      const { getSuggestions } = await import('../utils/autocomplete');
      const suggestions = getSuggestions('/export ');
      expect(suggestions.some(s => s.display === 'pdf')).toBe(true);
    });
  });

  describe('Componente DocumentationModal', () => {
    it('debe existir el archivo DocumentationModal.tsx', async () => {
      const modalPath = path.join(process.cwd(), 'src/components/DocumentationModal.tsx');
      expect(fs.existsSync(modalPath)).toBe(true);
    });

    it('debe incluir secciones principales', async () => {
      const modalPath = path.join(process.cwd(), 'src/components/DocumentationModal.tsx');
      const content = fs.readFileSync(modalPath, 'utf8');
      expect(content).toContain('Gestión de Proyectos');
      expect(content).toContain('Gestión de Documentos');
      expect(content).toContain('Gestión de Observaciones');
      expect(content).toContain('Notas');
      expect(content).toContain('Búsqueda y Filtros');
      expect(content).toContain('Exportación');
      expect(content).toContain('Utilidades');
    });

    it('debe incluir ejemplos para cada comando', async () => {
      const modalPath = path.join(process.cwd(), 'src/components/DocumentationModal.tsx');
      const content = fs.readFileSync(modalPath, 'utf8');
      expect(content).toContain('/create project');
      expect(content).toContain('/use');
      expect(content).toContain('/current');
      expect(content).toContain('/obs');
      expect(content).toContain('/note');
      expect(content).toContain('/export pdf');
    });

    it('debe tener notas sobre sintaxis', async () => {
      const modalPath = path.join(process.cwd(), 'src/components/DocumentationModal.tsx');
      const content = fs.readFileSync(modalPath, 'utf8');
      expect(content).toContain('comillas');
      expect(content).toContain('espacios');
    });
  });
});
