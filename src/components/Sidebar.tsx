"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  StickyNote,
  Pin,
  Share2,
  Tag,
  Plus,
  LogOut,
  Sparkles,
  X,
  User as UserIcon,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import ThemeToggle from "./ThemeToggle";
import { Note, FilterType } from "@/types/note";

interface SidebarProps {
  notes: Note[];
  currentFilter: FilterType;
  selectedTag: string | null;
  onFilterChange: (filter: FilterType, tag?: string | null) => void;
  onNewNote: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({
  notes,
  currentFilter,
  selectedTag,
  onFilterChange,
  onNewNote,
  isOpen,
  onClose,
}: SidebarProps) {
  const { user, logout } = useAuth();

  const totalCount = notes.length;
  const pinnedCount = useMemo(() => notes.filter((n) => n.isPinned).length, [notes]);
  const sharedCount = useMemo(() => notes.filter((n) => n.isShared).length, [notes]);

  // Aggregate all unique tags with counts
  const tagsMap = useMemo(() => {
    const map = new Map<string, number>();
    notes.forEach((note) => {
      note.tags?.forEach((t) => {
        const clean = t.trim().toLowerCase();
        if (clean) {
          map.set(clean, (map.get(clean) || 0) + 1);
        }
      });
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [notes]);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-zinc-900/40 backdrop-blur-xs lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-72 flex flex-col justify-between bg-white/95 dark:bg-zinc-900/95 border-r border-purple-100 dark:border-zinc-800 transition-transform duration-300 ease-in-out backdrop-blur-md ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Top Header & Branding */}
        <div className="p-5 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-purple-500/25 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-purple-700 via-purple-900 to-indigo-800 dark:from-purple-300 dark:via-purple-100 dark:to-indigo-200 bg-clip-text text-transparent">
                  CloudNotes
                </span>
                <span className="block text-[10px] font-medium uppercase tracking-wider text-purple-600/80 dark:text-purple-400">
                  Realtime Cloud
                </span>
              </div>
            </Link>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 lg:hidden"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Create Note CTA */}
          <button
            onClick={() => {
              onNewNote();
              onClose();
            }}
            type="button"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md shadow-purple-500/20 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-200 cursor-pointer active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create Note</span>
          </button>

          {/* Navigation Filters */}
          <nav className="flex flex-col gap-1">
            <button
              onClick={() => {
                onFilterChange("all");
                onClose();
              }}
              type="button"
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                currentFilter === "all" && !selectedTag
                  ? "bg-purple-100/70 dark:bg-purple-950/50 text-purple-900 dark:text-purple-200 font-semibold"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-purple-50/50 dark:hover:bg-zinc-800/60"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <StickyNote className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>All Notes</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-semibold">
                {totalCount}
              </span>
            </button>

            <button
              onClick={() => {
                onFilterChange("pinned");
                onClose();
              }}
              type="button"
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                currentFilter === "pinned"
                  ? "bg-purple-100/70 dark:bg-purple-950/50 text-purple-900 dark:text-purple-200 font-semibold"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-purple-50/50 dark:hover:bg-zinc-800/60"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Pin className="w-4 h-4 text-amber-500 fill-amber-500/20" />
                <span>Pinned Notes</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-semibold">
                {pinnedCount}
              </span>
            </button>

            <button
              onClick={() => {
                onFilterChange("shared");
                onClose();
              }}
              type="button"
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                currentFilter === "shared"
                  ? "bg-purple-100/70 dark:bg-purple-950/50 text-purple-900 dark:text-purple-200 font-semibold"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-purple-50/50 dark:hover:bg-zinc-800/60"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Share2 className="w-4 h-4 text-indigo-500" />
                <span>Shared Notes</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold">
                {sharedCount}
              </span>
            </button>
          </nav>

          {/* Tags Section */}
          <div className="pt-2">
            <div className="flex items-center justify-between px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              <span className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                Tags ({tagsMap.length})
              </span>
              {selectedTag && (
                <button
                  onClick={() => onFilterChange("all", null)}
                  className="text-purple-600 dark:text-purple-400 hover:underline normal-case text-[11px] font-medium"
                >
                  Clear filter
                </button>
              )}
            </div>

            <div className="max-h-48 overflow-y-auto space-y-0.5 pr-1 text-sm custom-scrollbar">
              {tagsMap.length === 0 ? (
                <p className="px-3 py-2 text-xs text-zinc-400 dark:text-zinc-500 italic">
                  No tags added yet
                </p>
              ) : (
                tagsMap.map(([tag, count]) => {
                  const isSelected = selectedTag === tag;
                  return (
                    <button
                      key={tag}
                      onClick={() => {
                        onFilterChange("tag", tag);
                        onClose();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-purple-200/70 dark:bg-purple-900/60 text-purple-900 dark:text-purple-100 font-semibold"
                          : "text-zinc-600 dark:text-zinc-400 hover:bg-purple-50 dark:hover:bg-zinc-800/60"
                      }`}
                    >
                      <span className="truncate">#{tag}</span>
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                        {count}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Bottom Profile & Controls */}
        <div className="p-4 border-t border-purple-100 dark:border-zinc-800 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "User"}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : user?.displayName ? (
                  user.displayName.charAt(0)
                ) : user?.email ? (
                  user.email.charAt(0)
                ) : (
                  <UserIcon className="w-4 h-4" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate">
                  {user?.displayName || "Signed In"}
                </p>
                <p className="text-[11px] text-zinc-400 dark:text-zinc-500 truncate">
                  {user?.email || "cloud-user@notes.app"}
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>

          <button
            onClick={() => logout()}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-transparent hover:border-rose-200 dark:hover:border-rose-900/50 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
