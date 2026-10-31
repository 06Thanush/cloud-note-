"use client";

import { Pin, Share2, Trash2, Edit3, Clock, Sparkles } from "lucide-react";
import { Note } from "@/types/note";

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (note: Note) => void;
  onTogglePin: (note: Note) => void;
  onShare: (note: Note) => void;
  onTagClick?: (tag: string) => void;
}

const colorStyles: Record<string, { bg: string; border: string; badge: string }> = {
  purple: {
    bg: "bg-white dark:bg-zinc-900",
    border: "border-purple-100 hover:border-purple-300 dark:border-zinc-800 dark:hover:border-purple-900/80",
    badge: "bg-purple-50 text-purple-700 border-purple-200/60 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800",
  },
  indigo: {
    bg: "bg-indigo-50/20 dark:bg-zinc-900",
    border: "border-indigo-100 hover:border-indigo-300 dark:border-zinc-800 dark:hover:border-indigo-900/80",
    badge: "bg-indigo-50 text-indigo-700 border-indigo-200/60 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800",
  },
  rose: {
    bg: "bg-rose-50/20 dark:bg-zinc-900",
    border: "border-rose-100 hover:border-rose-300 dark:border-zinc-800 dark:hover:border-rose-900/80",
    badge: "bg-rose-50 text-rose-700 border-rose-200/60 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800",
  },
  amber: {
    bg: "bg-amber-50/20 dark:bg-zinc-900",
    border: "border-amber-100 hover:border-amber-300 dark:border-zinc-800 dark:hover:border-amber-900/80",
    badge: "bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
  },
  emerald: {
    bg: "bg-emerald-50/20 dark:bg-zinc-900",
    border: "border-emerald-100 hover:border-emerald-300 dark:border-zinc-800 dark:hover:border-emerald-900/80",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
  },
  sky: {
    bg: "bg-sky-50/20 dark:bg-zinc-900",
    border: "border-sky-100 hover:border-sky-300 dark:border-zinc-800 dark:hover:border-sky-900/80",
    badge: "bg-sky-50 text-sky-700 border-sky-200/60 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800",
  },
};

export default function NoteCard({
  note,
  onEdit,
  onDelete,
  onTogglePin,
  onShare,
  onTagClick,
}: NoteCardProps) {
  const theme = colorStyles[note.color || "purple"] || colorStyles.purple;

  const formatDate = (ms: number) => {
    const diff = Date.now() - ms;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return new Date(ms).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      onClick={() => onEdit(note)}
      className={`group relative flex flex-col justify-between p-5 rounded-2xl border transition-all duration-200 shadow-xs hover:shadow-lg hover:-translate-y-0.5 cursor-pointer ${theme.bg} ${theme.border}`}
    >
      <div>
        {/* Card Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-base text-zinc-900 dark:text-zinc-100 leading-snug line-clamp-2">
            {note.title || "Untitled Note"}
          </h3>

          <div className="flex items-center gap-1 shrink-0 -mr-1 -mt-1" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => onTogglePin(note)}
              type="button"
              className={`p-1.5 rounded-lg transition-colors ${
                note.isPinned
                  ? "text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                  : "text-zinc-300 dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-purple-50 dark:hover:bg-zinc-800"
              }`}
              title={note.isPinned ? "Unpin note" : "Pin note"}
              aria-label={note.isPinned ? "Unpin note" : "Pin note"}
            >
              <Pin className={`w-4 h-4 ${note.isPinned ? "fill-amber-500" : ""}`} />
            </button>
          </div>
        </div>

        {/* Content Snippet */}
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 line-clamp-4 whitespace-pre-line mb-4 font-normal leading-relaxed">
          {note.content || <span className="italic text-zinc-400">No content</span>}
        </p>

        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {note.tags.map((tag) => (
              <span
                key={tag}
                onClick={(e) => {
                  e.stopPropagation();
                  onTagClick?.(tag);
                }}
                className={`text-[11px] font-medium px-2 py-0.5 rounded-md border transition-colors hover:opacity-80 ${theme.badge}`}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="pt-3 border-t border-purple-50 dark:border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400 dark:text-zinc-500">
        <div className="flex items-center gap-1.5 text-[11px]">
          <Clock className="w-3.5 h-3.5" />
          <span>{formatDate(note.updatedAt)}</span>
          {note.isShared && (
            <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-medium ml-1">
              • <Share2 className="w-3 h-3" /> Shared
            </span>
          )}
        </div>

        {/* Actions toolbar */}
        <div
          className="flex items-center gap-0.5 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => onShare(note)}
            type="button"
            className="p-1.5 rounded-lg text-zinc-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-zinc-800 dark:text-zinc-400 dark:hover:text-purple-300 transition-colors"
            title="Share note"
            aria-label="Share note"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onEdit(note)}
            type="button"
            className="p-1.5 rounded-lg text-zinc-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-zinc-800 dark:text-zinc-400 dark:hover:text-purple-300 transition-colors"
            title="Edit note"
            aria-label="Edit note"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(note)}
            type="button"
            className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 dark:text-zinc-400 dark:hover:text-rose-400 transition-colors"
            title="Delete note"
            aria-label="Delete note"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
