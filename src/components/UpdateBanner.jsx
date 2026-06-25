import { useUpdatePrompt } from '../hooks/useUpdatePrompt';
import { RefreshCw, X } from 'lucide-react';
import { useState } from 'react';

export const UpdateBanner = () => {
  const { updateAvailable, applyUpdate, dismissUpdate } = useUpdatePrompt();
  const [dismissed, setDismissed] = useState(false);

  if (!updateAvailable || dismissed) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 bg-blueprint-panel border border-blueprint-critical/50 rounded-lg p-3 shadow-2xl max-w-sm animate-in slide-in-from-top">
      <div className="flex items-start gap-3">
        <RefreshCw size={18} className="text-blueprint-critical flex-shrink-0 mt-0.5 animate-spin-slow" />
        <div className="flex-1">
          <div className="font-mono text-xs text-blueprint-critical mb-1 font-medium">
            Nueva versión disponible
          </div>
          <div className="text-[11px] text-current/70 mb-2">
            Hay una actualización lista para instalar
          </div>
          <div className="flex gap-2">
            <button
              onClick={applyUpdate}
              className="px-3 py-1 bg-blueprint-critical/20 hover:bg-blueprint-critical/30 border border-blueprint-critical/40 rounded text-xs font-mono text-blueprint-critical transition-colors"
            >
              Actualizar ahora
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="px-3 py-1 text-xs font-mono text-current/50 hover:text-current/80 transition-colors"
            >
              Después
            </button>
          </div>
        </div>
        <button onClick={() => setDismissed(true)} className="text-current/40 hover:text-current/80 transition-colors">
          <X size={14} />
        </button>
      </div>
    </div>
  );
};
