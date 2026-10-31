"use client";

import { useState, useEffect, useRef } from "react";
import {
  X,
  Pin,
  Tag as TagIcon,
  Palette,
  Check,
  Share2,
  Trash2,
  Save,
  Bold,
  List,
  ListOrdered,
  CheckSquare,
  Code,
  Heading2,
} from "lucide-react";
import { Note, NoteFormData } from "@/types/note";

interface NoteEditorModalProps {
  note: Note | null; // null if creating a new note
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<NoteFormData>, noteId?: string) => Promise<string | void>;
  onDelete?: (note: Note) => void;
  onShare?: (note: Note) => void;
}

const colorOptions = [
  { id: "purple", label: "Purple", class: "bg-purple-500", ring: "ring-purple-400" },
  { id: "indigo", label: "Indigo", class: "bg-indigo-500", ring: "ring-indigo-400" },
  { id: "rose", label: "Rose", class: "bg-rose-500", ring: "ring-rose-400" },
  { id: "amber", label: "Amber", class: "bg-amber-500", ring: "ring-amber-400" },
  { id: "emerald", label: "Emerald", class: "bg-emerald-500", ring: "ring-emerald-400" },
  { id: "sky", label: "Sky", class: "bg-sky-500", ring: "ring-sky-400" },
];

export default function NoteEditorModal({
  note,
  isOpen,
  onClose,
  onSave,
  onDelete,
  onShare,
}: NoteEditorModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [color, setColor] = useState("purple");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [currentNoteId, setCurrentNoteId] = useState<string | undefined>(note?.id);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstRender = useRef(true);

  // Sync state whenever active note changes
  useEffect(() => {
    if (isOpen) {
      if (note) {
        setTitle(note.title);
        setContent(note.content);
        setTags(note.tags || []);
        setIsPinned(Boolean(note.isPinned));
        setColor(note.color || "purple");
        setCurrentNoteId(note.id);
        setSaveStatus("saved");
      } else {
        setTitle("");
        setContent("");
        setTags([]);
        setIsPinned(false);
        setColor("purple");
        setCurrentNoteId(undefined);
        setSaveStatus("idle");
      }
      isFirstRender.current = true;
    }
  }, [note, isOpen]);

  // Debounced auto-save when user edits title, content, or tags
  useEffect(() => {
    if (!isOpen) return;
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Auto-save only if there is a title or content
    if (!title.trim() && !content.trim()) {
      return;
    }

    setSaveStatus("saving");

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(async () => {
      try {
        const id = await onSave(
          {
            title: title || "Untitled Note",
            content,
            tags,
            isPinned,
            color,
          },
          currentNoteId
        );
        if (id && !currentNoteId) {
          setCurrentNoteId(id);
        }
        setSaveStatus("saved");
      } catch (err) {
        console.error("Auto save failed:", err);
        setSaveStatus("idle");
      }
    }, 800);

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [title, content, tags, isPinned, color, isOpen, currentNoteId, onSave]);

  if (!isOpen) return null;

  // Add tag handler
  const handleAddTag = () => {
    const clean = tagInput.trim().toLowerCase().replace(/^#/, "");
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Text formatting helpers for rich editing
  const insertFormatting = (prefix: string, suffix: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);
    const replacement = `${prefix}${selected || "text"}${suffix}`;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + (selected ? selected.length : 4)
      );
    }, 10);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-zinc-950/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-white dark:bg-zinc-900 rounded-3xl border border-purple-100 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-50 dark:border-zinc-800 bg-purple-50/40 dark:bg-zinc-900/40">
          <div className="flex items-center gap-3">
            {/* Auto-save status badge */}
            <div className="flex items-center gap-1.5 text-xs">
              {saveStatus === "saving" && (
                <span className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-purple-600 animate-ping" />
                  Saving changes...
                </span>
              )}
              {saveStatus === "saved" && (
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                  <Check className="w-3.5 h-3.5" />
                  Saved to Cloud
                </span>
              )}
              {saveStatus === "idle" && (
                <span className="text-zinc-400 dark:text-zinc-500">
                  {note ? "Ready" : "New Note"}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Pin toggle */}
            <button
              onClick={() => setIsPinned(!isPinned)}
              type="button"
              className={`p-2 rounded-xl transition-colors ${
                isPinned
                  ? "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
                  : "text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-purple-100/50 dark:hover:bg-zinc-800"
              }`}
              title={isPinned ? "Unpin note" : "Pin note"}
            >
              <Pin className={`w-4 h-4 ${isPinned ? "fill-amber-500" : ""}`} />
            </button>

            {/* Share CTA if editing existing note */}
            {note && onShare && (
              <button
                onClick={() => onShare(note)}
                type="button"
                className="p-2 rounded-xl text-zinc-500 hover:text-purple-600 dark:text-zinc-400 dark:hover:text-purple-300 hover:bg-purple-100/50 dark:hover:bg-zinc-800 transition-colors"
                title="Share note"
              >
                <Share2 className="w-4 h-4" />
              </button>
            )}

            {/* Delete CTA if editing existing note */}
            {note && onDelete && (
              <button
                onClick={() => onDelete(note)}
                type="button"
                className="p-2 rounded-xl text-zinc-500 hover:text-rose-600 dark:text-zinc-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                title="Delete note"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onClose}
              type="button"
              className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-purple-100/50 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Note Body Inputs */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Note Title Input */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note Title"
            className="w-full text-2xl font-bold bg-transparent text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-300 dark:placeholder:text-zinc-600 focus:outline-none tracking-tight"
          />

          {/* Formatting Toolbar */}
          <div className="flex items-center flex-wrap gap-1 py-1.5 px-2 bg-purple-50/50 dark:bg-zinc-800/50 rounded-xl border border-purple-100 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs">
            <button
              onClick={() => insertFormatting("**", "**")}
              type="button"
              className="p-1.5 hover:bg-purple-100/60 dark:hover:bg-zinc-700 rounded-lg transition-colors"
              title="Bold"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertFormatting("## ")}
              type="button"
              className="p-1.5 hover:bg-purple-100/60 dark:hover:bg-zinc-700 rounded-lg transition-colors font-semibold"
              title="Heading"
            >
              <Heading2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertFormatting("- ")}
              type="button"
              className="p-1.5 hover:bg-purple-100/60 dark:hover:bg-zinc-700 rounded-lg transition-colors"
              title="Bullet list"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertFormatting("1. ")}
              type="button"
              className="p-1.5 hover:bg-purple-100/60 dark:hover:bg-zinc-700 rounded-lg transition-colors"
              title="Numbered list"
            >
              <ListOrdered className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertFormatting("- [ ] ")}
              type="button"
              className="p-1.5 hover:bg-purple-100/60 dark:hover:bg-zinc-700 rounded-lg transition-colors"
              title="Checklist item"
            >
              <CheckSquare className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertFormatting("```\n", "\n```")}
              type="button"
              className="p-1.5 hover:bg-purple-100/60 dark:hover:bg-zinc-700 rounded-lg transition-colors"
              title="Code block"
            >
              <Code className="w-3.5 h-3.5" />
            </button>

            {/* Color Accent Picker */}
            <div className="ml-auto flex items-center gap-1.5 pl-2 border-l border-purple-200 dark:border-zinc-700">
              <Palette className="w-3.5 h-3.5 text-zinc-400" />
              {colorOptions.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setColor(c.id)}
                  type="button"
                  className={`w-4 h-4 rounded-full ${c.class} transition-transform ${
                    color === c.id ? `ring-2 ${c.ring} scale-125` : "opacity-70 hover:opacity-100"
                  }`}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          {/* Main Description/Content Area */}
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note description, checklist, thoughts, or ideas here..."
            rows={12}
            className="w-full text-sm sm:text-base leading-relaxed bg-transparent text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-300 dark:placeholder:text-zinc-600 focus:outline-none resize-none font-normal"
          />

          {/* Tags Section */}
          <div className="pt-3 border-t border-purple-50 dark:border-zinc-800 space-y-2">
            <div className="flex items-center gap-2">
              <TagIcon className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Organize with Tags
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-purple-100/80 dark:bg-purple-950/70 text-purple-800 dark:text-purple-200 border border-purple-200 dark:border-purple-800"
                >
                  #{tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    type="button"
                    className="hover:text-purple-950 dark:hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Add a tag and press Enter..."
                className="text-xs py-1 px-3 rounded-lg bg-purple-50/60 dark:bg-zinc-800 border border-purple-100 dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-purple-500 text-zinc-800 dark:text-zinc-200"
              />
            </div>
          </div>
        </div>

        {/* Footer with Manual Done / Close button */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-purple-50 dark:border-zinc-800 bg-purple-50/20 dark:bg-zinc-900/20">
          <span className="text-xs text-zinc-400 dark:text-zinc-500">
            Notes auto-save continuously to your cloud account
          </span>
          <button
            onClick={onClose}
            type="button"
            className="py-2 px-5 rounded-xl text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-500/20 transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
