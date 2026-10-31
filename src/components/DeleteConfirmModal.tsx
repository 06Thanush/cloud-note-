"use client";

import { AlertTriangle, Trash2, X } from "lucide-react";
import { Note } from "@/types/note";

interface DeleteConfirmModalProps {
  note: Note | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export default function DeleteConfirmModal({
  note,
  isOpen,
  onClose,
  onConfirm,
  isDeleting = false,
}: DeleteConfirmModalProps) {
  if (!isOpen || !note) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl border border-rose-100 dark:border-rose-950/80 shadow-2xl overflow-hidden p-6 space-y-4">
        <div className="flex items-start gap-3.5">
          <div className="p-3 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Delete this note?
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                "{note.title || "Untitled Note"}"
              </span>
              ? This action cannot be undone and will remove it from all your synced devices.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            disabled={isDeleting}
            type="button"
            className="py-2 px-4 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            type="button"
            className="flex items-center gap-1.5 py-2 px-4 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-sm shadow-rose-500/20 transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isDeleting ? "Deleting..." : "Delete Note"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
