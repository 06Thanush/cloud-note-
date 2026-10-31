"use client";

import { useEffect, useState, use, Suspense } from "react";
import Link from "next/link";
import {
  Sparkles,
  Clock,
  Copy,
  Check,
  FileX2,
  Lock,
  ArrowRight,
} from "lucide-react";
import { getSharedNote } from "@/lib/notes";
import { Note } from "@/types/note";
import ThemeToggle from "@/components/ThemeToggle";


function SharedNoteContent({
  params,
}: {
  params: Promise<{ shareId: string }>;
}) {
  const resolvedParams = use(params);
  const shareId = resolvedParams.shareId;

  const [note, setNote] = useState<Note | null>(null);
  const [status, setStatus] = useState<"loading" | "found" | "not_found" | "expired" | "disabled">("loading");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function fetchNote() {
      if (!shareId) return;
      const res = await getSharedNote(shareId);
      if (!mounted) return;
      setNote(res.note);
      setStatus(res.status);
    }

    fetchNote();
    return () => {
      mounted = false;
    };
  }, [shareId]);

  const handleCopyText = async () => {
    if (!note) return;
    try {
      await navigator.clipboard.writeText(`${note.title}\n\n${note.content}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const formatDate = (ms: number) => {
    return new Date(ms).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50/40 via-white to-purple-50/20 dark:from-[#0f0d15] dark:via-zinc-950 dark:to-[#0f0d15] text-zinc-900 dark:text-zinc-100">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-white/70 dark:bg-zinc-950/70 border-b border-purple-100 dark:border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-purple-500/25 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-bold text-base tracking-tight bg-gradient-to-r from-purple-700 to-indigo-800 dark:from-purple-300 dark:to-indigo-200 bg-clip-text text-transparent">
              CloudNotes
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/register"
              className="hidden sm:flex items-center gap-1.5 py-1.5 px-3.5 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 shadow-sm transition-all"
            >
              <span>Create Free Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 sm:py-12">
        {status === "loading" && (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-full border-2 border-purple-600 border-t-transparent animate-spin mb-4" />
            <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
              Loading shared note...
            </p>
          </div>
        )}

        {status === "expired" && (
          <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-amber-200 dark:border-amber-900/60 shadow-lg text-center max-w-md mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
              <Clock className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
              Link has Expired
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              This shared note link had an expiration timer that has now elapsed. Please request a renewed link from the note author.
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 py-2.5 px-5 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 shadow-sm"
              >
                Go to CloudNotes Home
              </Link>
            </div>
          </div>
        )}

        {status === "disabled" && (
          <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-purple-100 dark:border-zinc-800 shadow-lg text-center max-w-md mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 flex items-center justify-center mx-auto">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
              Sharing Disabled
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Public access to this note has been turned off by the author.
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 py-2.5 px-5 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 shadow-sm"
              >
                Go to CloudNotes Home
              </Link>
            </div>
          </div>
        )}

        {status === "not_found" && (
          <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-purple-100 dark:border-zinc-800 shadow-lg text-center max-w-md mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <FileX2 className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
              Note Not Found
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              The requested note link is invalid or the note has been deleted by its owner.
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 py-2.5 px-5 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 shadow-sm"
              >
                Go to CloudNotes Home
              </Link>
            </div>
          </div>
        )}

        {status === "found" && note && (
          <article className="bg-white dark:bg-zinc-900 rounded-3xl border border-purple-100 dark:border-zinc-800 shadow-xl overflow-hidden p-6 sm:p-10 space-y-6">
            {/* Meta Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-purple-100 dark:border-zinc-800">
              <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                <Clock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>Last updated {formatDate(note.updatedAt)}</span>
                <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-medium text-[11px]">
                  Read Only
                </span>
              </div>

              <button
                onClick={handleCopyText}
                type="button"
                className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-200 bg-purple-50/70 hover:bg-purple-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-purple-200/60 dark:border-zinc-700 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied to Clipboard" : "Copy Content"}</span>
              </button>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-snug">
              {note.title || "Untitled Note"}
            </h1>

            {/* Tags */}
            {note.tags && note.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {note.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/70 dark:border-purple-800/80"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Note Content */}
            <div className="pt-2 text-sm sm:text-base text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-line font-normal">
              {note.content || <span className="italic text-zinc-400">Empty note</span>}
            </div>

            {/* Author note / CTA footer */}
            <div className="mt-12 pt-6 border-t border-purple-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                Shared securely via CloudNotes
              </span>

              <Link
                href="/register"
                className="text-purple-600 dark:text-purple-400 font-semibold hover:underline"
              >
                Create your own cloud notes &rarr;
              </Link>
            </div>
          </article>
        )}
      </main>
    </div>
  );
}

export default function SharedNotePage(props: {
  params: Promise<{ shareId: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#fcfbfe] dark:bg-[#0f0d15]">
          <div className="w-8 h-8 rounded-full border-2 border-purple-600 border-t-transparent animate-spin" />
        </div>
      }
    >
      <SharedNoteContent params={props.params} />
    </Suspense>
  );
}
