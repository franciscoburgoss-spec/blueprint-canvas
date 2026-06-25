import { useInstallPrompt } from '../hooks/useInstallPrompt';
import { Download, X } from 'lucide-react';
import { useState } from 'react';

export const InstallBanner = () => {
  const { installPrompt, isInstalled, install } = useInstallPrompt();
  const [dismissed, setDismissed] = useState(false);

  // No mostrar si ya está instalada, no hay prompt, o fue descartada
  if (isInstalled || !installPrompt || dismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-blueprint-panel border border-blueprint-grid/40 rounded-lg p-4 shadow-2xl max-w-sm animate-in slide-in-from-bottom">
      <div className="flex items-start gap-3">
        <Download size={20} className="text-blueprint-grid flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="font-mono text-sm text-blueprint-grid mb-1">
            Instalar Blueprint Canvas
          </div>
          <div className="text-xs text-current/70 mb-3">
            Accede sin conexión y úsalo como app nativa
          </div>
          <div className="flex gap-2">
            <button
              onClick={install}
              className="px-3 py-1.5 bg-blueprint-grid/20 hover:bg-blueprint-grid/30 border border-blueprint-grid/40 rounded text-xs font-mono text-blueprint-grid transition-colors"
            >
              Instalar
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="px-3 py-1.5 text-xs font-mono text-current/50 hover:text-current/80 transition-colors"
            >
              Ahora no
            </button>
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-current/40 hover:text-current/80 transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};
