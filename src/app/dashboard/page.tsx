"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import {
  Plus,
  Pin,
  StickyNote,
  Tag as TagIcon,
  Search,
  Filter,
  Sparkles,
  Share2,
  Clock,
  Inbox,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  subscribeUserNotes,
  createNote,
  updateNote,
  deleteNote,
  togglePinNote,
  updateShareSettings,
} from "@/lib/notes";
import { Note, NoteFormData, FilterType } from "@/types/note";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import NoteCard from "@/components/NoteCard";
import NoteEditorModal from "@/components/NoteEditorModal";
import ShareModal from "@/components/ShareModal";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import Toast, { ToastMessage } from "@/components/Toast";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // State
  const [notes, setNotes] = useState<Note[]>([]);
  const [notesLoading, setNotesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFilter, setCurrentFilter] = useState<FilterType>("all");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Modals & UI
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [sharingNote, setSharingNote] = useState<Note | null>(null);
  const [deletingNote, setDeletingNote] = useState<Note | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback(
    (type: "success" | "error" | "info", title: string, message?: string) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, type, title, message }]);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Redirect if unauthenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Real-time Firestore Subscription
  useEffect(() => {
    if (!user) return;

    setNotesLoading(true);
    const unsubscribe = subscribeUserNotes(
      user.uid,
      (updatedNotes) => {
        setNotes(updatedNotes);
        setNotesLoading(false);
      },
      (err) => {
        console.error("Subscription error:", err);
        setError("Failed to sync notes with Firestore. Check your connection or Firebase setup.");
        setNotesLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Filtered & Searched Notes
  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      // Filter by tag
      if (selectedTag && !note.tags?.some((t) => t.toLowerCase() === selectedTag.toLowerCase())) {
        return false;
      }

      // Filter by category
      if (currentFilter === "pinned" && !note.isPinned) return false;
      if (currentFilter === "shared" && !note.isShared) return false;

      // Filter by search query (title, content, or tags)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = note.title?.toLowerCase().includes(query);
        const matchesContent = note.content?.toLowerCase().includes(query);
        const matchesTags = note.tags?.some((t) => t.toLowerCase().includes(query));
        return matchesTitle || matchesContent || matchesTags;
      }

      return true;
    });
  }, [notes, currentFilter, selectedTag, searchQuery]);

  // Split into pinned and regular notes if viewing "all"
  const pinnedNotes = useMemo(
    () => filteredNotes.filter((n) => n.isPinned),
    [filteredNotes]
  );
  const otherNotes = useMemo(
    () => filteredNotes.filter((n) => !n.isPinned),
    [filteredNotes]
  );

  // Recently edited notes (latest 3)
  const recentNotes = useMemo(() => {
    return [...notes].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 3);
  }, [notes]);

  // Handler: Save or Update Note
  const handleSaveNote = async (
    data: Partial<NoteFormData>,
    noteId?: string
  ): Promise<string | void> => {
    if (!user) return;

    try {
      if (noteId) {
        await updateNote(noteId, data);
        return noteId;
      } else {
        const isFirstNote = notes.length === 0;
        const newId = await createNote(user.uid, data);
        if (isFirstNote) {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
          addToast("success", "First note created!", "Welcome to CloudNotes.");
        }
        return newId;
      }
    } catch (err: any) {
      console.error(err);
      addToast("error", "Error saving note", err.message);
      throw err;
    }
  };

  // Handler: Toggle Pin
  const handleTogglePin = async (note: Note) => {
    try {
      await togglePinNote(note.id, note.isPinned);
      addToast(
        "info",
        note.isPinned ? "Note unpinned" : "Note pinned to top",
        note.title
      );
    } catch (err: any) {
      addToast("error", "Failed to toggle pin", err.message);
    }
  };

  // Handler: Delete Note Confirmation
  const handleConfirmDelete = async () => {
    if (!deletingNote) return;
    try {
      setIsDeleting(true);
      await deleteNote(deletingNote.id);
      addToast("success", "Note deleted successfully");
      setDeletingNote(null);
      if (editingNote?.id === deletingNote.id) {
        setIsEditorOpen(false);
      }
    } catch (err: any) {
      addToast("error", "Failed to delete note", err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Handler: Update Share Settings
  const handleUpdateShare = async (
    noteId: string,
    isShared: boolean,
    shareExpiresAt?: number | null
  ) => {
    await updateShareSettings(noteId, isShared, shareExpiresAt);
  };

  // Handler: New Note Trigger
  const handleOpenNewNote = () => {
    setEditingNote(null);
    setIsEditorOpen(true);
  };

  // Loading skeleton screen
  if (authLoading || (notesLoading && notes.length === 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcfbfe] dark:bg-[#0f0d15]">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/10 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
          <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            Connecting to CloudNotes...
          </p>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            Syncing real-time workspace
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#fcfbfe] dark:bg-[#0f0d15] text-zinc-900 dark:text-zinc-100">
      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={removeToast} />

      {/* Sidebar Navigation */}
      <Sidebar
        notes={notes}
        currentFilter={currentFilter}
        selectedTag={selectedTag}
        onFilterChange={(filter, tag) => {
          setCurrentFilter(filter);
          setSelectedTag(tag ?? null);
        }}
        onNewNote={handleOpenNewNote}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <Navbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onNewNote={handleOpenNewNote}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          notesCount={notes.length}
        />

        {/* Workspace Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-8">
          {/* Dashboard Summary Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-purple-100/80 dark:border-zinc-800 shadow-xs">
              <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                <span>Total Notes</span>
                <StickyNote className="w-4 h-4 text-purple-600" />
              </div>
              <span className="text-2xl font-bold text-zinc-900 dark:text-white">
                {notes.length}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-purple-100/80 dark:border-zinc-800 shadow-xs">
              <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                <span>Pinned</span>
                <Pin className="w-4 h-4 text-amber-500" />
              </div>
              <span className="text-2xl font-bold text-zinc-900 dark:text-white">
                {notes.filter((n) => n.isPinned).length}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-purple-100/80 dark:border-zinc-800 shadow-xs">
              <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                <span>Shared</span>
                <Share2 className="w-4 h-4 text-indigo-500" />
              </div>
              <span className="text-2xl font-bold text-zinc-900 dark:text-white">
                {notes.filter((n) => n.isShared).length}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-purple-100/80 dark:border-zinc-800 shadow-xs">
              <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                <span>Total Tags</span>
                <TagIcon className="w-4 h-4 text-emerald-500" />
              </div>
              <span className="text-2xl font-bold text-zinc-900 dark:text-white">
                {new Set(notes.flatMap((n) => n.tags || [])).size}
              </span>
            </div>
          </div>

          {/* Active Filter Pills Bar */}
          {(selectedTag || currentFilter !== "all" || searchQuery) && (
            <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-purple-50/60 dark:bg-zinc-900/60 border border-purple-100 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-300">
              <span className="font-semibold text-purple-700 dark:text-purple-300">
                Active Filter:
              </span>
              {currentFilter !== "all" && (
                <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-800 border border-purple-200 dark:border-zinc-700 capitalize font-medium">
                  {currentFilter} notes
                </span>
              )}
              {selectedTag && (
                <span className="px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800 font-medium text-purple-800 dark:text-purple-200">
                  #{selectedTag}
                </span>
              )}
              {searchQuery && (
                <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-800 border border-purple-200 dark:border-zinc-700 font-medium">
                  Search: "{searchQuery}"
                </span>
              )}

              <button
                onClick={() => {
                  setCurrentFilter("all");
                  setSelectedTag(null);
                  setSearchQuery("");
                }}
                className="ml-auto text-purple-600 dark:text-purple-400 font-semibold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 flex items-start gap-3 text-sm text-rose-800 dark:text-rose-200">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
              <div>
                <p className="font-semibold">{error}</p>
                <p className="text-xs text-rose-600 dark:text-rose-300 mt-1">
                  Ensure your Firebase keys in .env.local are valid and Cloud Firestore is enabled.
                </p>
              </div>
            </div>
          )}

          {/* EMPTY STATES */}
          {filteredNotes.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center max-w-md mx-auto p-6 rounded-3xl bg-white/60 dark:bg-zinc-900/40 border border-purple-100/60 dark:border-zinc-800/80">
              <div className="w-16 h-16 rounded-3xl bg-purple-100/80 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
                <Inbox className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1.5">
                {searchQuery || selectedTag || currentFilter !== "all"
                  ? "No matching notes found"
                  : "Your notebook is empty"}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6">
                {searchQuery || selectedTag || currentFilter !== "all"
                  ? "Try adjusting your search terms or clearing tag filters to see your notes."
                  : "Capture your ideas, checklists, and projects. Notes will synchronize instantly across all devices."}
              </p>
              <button
                onClick={handleOpenNewNote}
                type="button"
                className="flex items-center gap-2 py-2.5 px-5 rounded-xl text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-500/25 transition-all cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Create Your First Note</span>
              </button>
            </div>
          ) : (
            <div className="space-y-10">
              {/* PINNED NOTES SECTION (when viewing all or pinned) */}
              {pinnedNotes.length > 0 && currentFilter !== "shared" && (
                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    <Pin className="w-3.5 h-3.5 fill-amber-500" />
                    <span>Pinned Notes ({pinnedNotes.length})</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pinnedNotes.map((note) => (
                      <NoteCard
                        key={note.id}
                        note={note}
                        onEdit={(n) => {
                          setEditingNote(n);
                          setIsEditorOpen(true);
                        }}
                        onDelete={(n) => setDeletingNote(n)}
                        onTogglePin={handleTogglePin}
                        onShare={(n) => setSharingNote(n)}
                        onTagClick={(tag) => setSelectedTag(tag)}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* OTHER NOTES SECTION */}
              {otherNotes.length > 0 && (
                <section className="space-y-4">
                  {pinnedNotes.length > 0 && (
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 pt-4 border-t border-purple-100/60 dark:border-zinc-800/80">
                      <StickyNote className="w-3.5 h-3.5" />
                      <span>Other Notes ({otherNotes.length})</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {otherNotes.map((note) => (
                      <NoteCard
                        key={note.id}
                        note={note}
                        onEdit={(n) => {
                          setEditingNote(n);
                          setIsEditorOpen(true);
                        }}
                        onDelete={(n) => setDeletingNote(n)}
                        onTogglePin={handleTogglePin}
                        onShare={(n) => setSharingNote(n)}
                        onTagClick={(tag) => setSelectedTag(tag)}
                      />
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Note Editor Modal */}
      <NoteEditorModal
        note={editingNote}
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setEditingNote(null);
        }}
        onSave={handleSaveNote}
        onDelete={(note) => setDeletingNote(note)}
        onShare={(note) => setSharingNote(note)}
      />

      {/* Share Modal */}
      <ShareModal
        note={sharingNote}
        isOpen={Boolean(sharingNote)}
        onClose={() => setSharingNote(null)}
        onUpdateShare={handleUpdateShare}
        onToast={addToast}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        note={deletingNote}
        isOpen={Boolean(deletingNote)}
        onClose={() => setDeletingNote(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
