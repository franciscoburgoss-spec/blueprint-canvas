import { useEffect } from 'react';
import { useProjectStore } from '../store/projectStore';

export const useKeyboardShortcuts = (callbacks = {}) => {
  const { clearHistory } = useProjectStore();

  useEffect(() => {
    const handleKeyDown = (e) => {
      const { executeCommand, focusInput, setInput, clearInput } = callbacks;

      // Cmd/Ctrl + K: Enfocar input
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (focusInput) focusInput();
        return;
      }

      // Cmd/Ctrl + L: Limpiar chat
      if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault();
        clearHistory();
        return;
      }

      // Cmd/Ctrl + H: Ejecutar /help directamente (sin tocar el input)
      if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
        e.preventDefault();
        if (executeCommand) executeCommand('/help');
        return;
      }

      // Cmd/Ctrl + S: Ejecutar /status directamente
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (executeCommand) executeCommand('/status');
        return;
      }

      // Cmd/Ctrl + E: Ejecutar /export markdown directamente
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        if (executeCommand) executeCommand('/export markdown');
        return;
      }

      // Cmd/Ctrl + N: Iniciar /note " en el input (permitiendo escribir)
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        if (setInput) {
          setInput('/note "');
          if (focusInput) {
            setTimeout(() => focusInput(), 0);
          }
        }
        return;
      }

      // Escape: Limpiar input
      if (e.key === 'Escape') {
        e.preventDefault();
        if (clearInput) clearInput();
        return;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [clearHistory, callbacks]);
};

export const SHORTCUTS = [
  { keys: '⌘/Ctrl + K', description: 'Enfocar input de comandos' },
  { keys: '⌘/Ctrl + L', description: 'Limpiar el chat' },
  { keys: '⌘/Ctrl + H', description: 'Ejecutar /help' },
  { keys: '⌘/Ctrl + S', description: 'Ejecutar /status' },
  { keys: '⌘/Ctrl + E', description: 'Exportar a Markdown' },
  { keys: '⌘/Ctrl + N', description: 'Iniciar nueva nota' },
  { keys: 'Esc', description: 'Limpiar y salir del input' },
  { keys: '↑ / ↓', description: 'Navegar historial de comandos' },
];
