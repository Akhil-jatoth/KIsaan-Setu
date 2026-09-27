import React from 'react';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';
import { useAppStore } from '../store/appStore';

export function ToastContainer() {
  const { toasts, removeToast } = useAppStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-[90vw] pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-agri-accent flex-shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />,
          error: <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />,
          info: <Info className="w-5 h-5 text-sky-400 flex-shrink-0" />
        };

        const borders = {
          success: 'border-agri-accent/40 bg-[#082410]/95',
          warning: 'border-amber-500/40 bg-[#241c08]/95',
          error: 'border-rose-500/40 bg-[#260a0a]/95',
          info: 'border-sky-500/40 bg-[#0a1e28]/95'
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-2xl border backdrop-blur-xl shadow-2xl flex items-start gap-3 animate-slide-in ${borders[toast.type]}`}
          >
            {icons[toast.type]}
            <div className="flex-1">
              <h5 className="text-xs font-bold text-white leading-tight">{toast.title}</h5>
              <p className="text-[11px] text-gray-300 mt-0.5 leading-snug">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
