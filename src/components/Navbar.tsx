"use client";

import { Search, Menu, Plus, RefreshCw, X } from "lucide-react";

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNewNote: () => void;
  onToggleSidebar: () => void;
  notesCount: number;
  isSyncing?: boolean;
}

export default function Navbar({
  searchQuery,
  onSearchChange,
  onNewNote,
  onToggleSidebar,
  notesCount,
  isSyncing = false,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 px-4 sm:px-6 py-3.5 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-purple-100 dark:border-zinc-800">
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onToggleSidebar}
          type="button"
          className="p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-purple-50 dark:hover:bg-zinc-800 lg:hidden"
          aria-label="Open navigation sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400 dark:text-purple-500 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search notes by title, content or #tag..."
            className="w-full pl-10 pr-9 py-2 rounded-xl text-sm bg-purple-50/50 dark:bg-zinc-800/80 border border-purple-100 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Real-time sync status indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/40 text-[11px] font-medium text-purple-700 dark:text-purple-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Realtime Sync</span>
        </div>

        <button
          onClick={onNewNote}
          type="button"
          className="flex items-center gap-1.5 py-2 px-3.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 shadow-sm shadow-purple-500/20 transition-all cursor-pointer active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span className="hidden sm:inline">New Note</span>
        </button>
      </div>
    </header>
  );
}
