import { useEffect } from 'react';

export interface Shortcut {
  keys: string;
  description: string;
  action: string;
}

export const SHORTCUTS: Shortcut[] = [
  { keys: 'Cmd+K', description: 'Enfocar input de comandos', action: 'focusInput' },
  { keys: 'Cmd+L', description: 'Limpiar chat', action: 'clearChat' },
  { keys: 'Cmd+E', description: 'Exportar a Markdown', action: 'exportMarkdown' },
  { keys: 'Cmd+H', description: 'Ejecutar /help', action: 'showHelp' },
  { keys: 'Cmd+D', description: 'Abrir documentación', action: 'showDocs' },
  { keys: 'Cmd+S', description: 'Ejecutar /status', action: 'executeStatus' },
  { keys: 'Cmd+N', description: 'Nueva nota', action: 'newNote' },
  { keys: 'Esc', description: 'Cerrar modales y sugerencias', action: 'closeModal' },
  { keys: 'Cmd+1', description: 'Ejecutar /list projects', action: 'executeListProjects' },
  { keys: 'Cmd+2', description: 'Ejecutar /list docs', action: 'executeListDocs' },
  { keys: 'Cmd+3', description: 'Ejecutar /list obs', action: 'executeListObs' },
  { keys: 'Cmd+4', description: 'Ejecutar /list notes', action: 'executeListNotes' },
  { keys: 'Cmd+↑', description: 'Comando anterior', action: 'previousCommand' },
  { keys: 'Cmd+↓', description: 'Comando siguiente', action: 'nextCommand' },
];

interface ShortcutCallbacks {
  focusInput?: () => void;
  clearChat?: () => void;
  exportMarkdown?: () => void;
  showHelp?: () => void;
  showDocs?: () => void;
  executeStatus?: () => void;
  newNote?: () => void;
  closeModal?: () => void;
  executeListProjects?: () => void;
  executeListDocs?: () => void;
  executeListObs?: () => void;
  executeListNotes?: () => void;
  executeCommand?: (command: string) => void;
  setInput?: (text: string) => void;
  clearInput?: () => void;
}

export const useKeyboardShortcuts = (callbacks: ShortcutCallbacks): void => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modKey = isMac ? e.metaKey : e.ctrlKey;

      // Escape no requiere modKey
      if (e.key === 'Escape') {
        callbacks.closeModal?.();
        return;
      }

      if (!modKey) return;

      const shortcuts: Record<string, () => void> = {
        k: () => callbacks.focusInput?.(),
        l: () => callbacks.clearChat?.(),
        e: () => callbacks.exportMarkdown?.(),
        h: () => callbacks.executeCommand?.('/help'),
        d: () => callbacks.showDocs?.(),
        s: () => callbacks.executeCommand?.('/status'),
        n: () => callbacks.newNote?.(),
        '1': () => callbacks.executeCommand?.('/list projects'),
        '2': () => callbacks.executeCommand?.('/list docs'),
        '3': () => callbacks.executeCommand?.('/list obs'),
        '4': () => callbacks.executeCommand?.('/list notes'),
      };

      const action = shortcuts[e.key.toLowerCase()];
      if (action) {
        e.preventDefault();
        action();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [callbacks]);
};
