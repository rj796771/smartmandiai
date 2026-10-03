import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message?: string;
}

interface ToastNotificationProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastNotificationContainer: React.FC<ToastNotificationProps> = ({
  toasts,
  onDismiss
}) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2.5 max-w-sm w-full px-4 sm:px-0 pointer-events-none">
      {toasts.map(toast => {
        const getStyles = () => {
          switch (toast.type) {
            case 'error':
              return {
                bg: 'bg-rose-900/95 text-rose-100 border-rose-700',
                icon: <AlertCircle className="w-5 h-5 text-rose-300 flex-shrink-0" />
              };
            case 'warning':
              return {
                bg: 'bg-amber-900/95 text-amber-100 border-amber-700',
                icon: <AlertTriangle className="w-5 h-5 text-amber-300 flex-shrink-0" />
              };
            case 'success':
              return {
                bg: 'bg-emerald-900/95 text-emerald-100 border-emerald-700',
                icon: <CheckCircle2 className="w-5 h-5 text-emerald-300 flex-shrink-0" />
              };
            default:
              return {
                bg: 'bg-slate-900/95 text-slate-100 border-slate-700',
                icon: <Info className="w-5 h-5 text-blue-300 flex-shrink-0" />
              };
          }
        };

        const style = getStyles();

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl border shadow-xl backdrop-blur-md transition-all animate-in slide-in-from-bottom-5 duration-300 flex items-start justify-between gap-3 ${style.bg}`}
          >
            <div className="flex items-start space-x-3">
              {style.icon}
              <div className="text-xs">
                <h5 className="font-extrabold text-sm font-['Poppins']">{toast.title}</h5>
                {toast.message && <p className="mt-0.5 opacity-90 leading-relaxed">{toast.message}</p>}
              </div>
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
