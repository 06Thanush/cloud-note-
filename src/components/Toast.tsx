"use client";

import { useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  title: string;
  message?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export default function Toast({ toasts, onDismiss }: ToastProps) {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />,
    info: <Info className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />,
  };

  const borders = {
    success: "border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/90 dark:bg-emerald-950/70",
    error: "border-rose-200 dark:border-rose-900/60 bg-rose-50/90 dark:bg-rose-950/70",
    info: "border-purple-200 dark:border-purple-900/60 bg-purple-50/90 dark:bg-purple-950/70",
  };

  return (
    <div
      role="alert"
      className={`pointer-events-auto flex items-start justify-between gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-md transition-all duration-200 animate-in fade-in slide-in-from-bottom-2 ${borders[toast.type]}`}
    >
      <div className="flex items-start gap-3">
        {icons[toast.type]}
        <div>
          <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {toast.title}
          </h4>
          {toast.message && (
            <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-0.5">
              {toast.message}
            </p>
          )}
        </div>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-0.5 rounded-md transition-colors"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
