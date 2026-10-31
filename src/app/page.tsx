"use client";

import Link from "next/link";
import {
  Sparkles,
  Zap,
  Shield,
  Share2,
  Tag,
  ArrowRight,
  CheckCircle,
  Cloud,
  Lock,
  Smartphone,
  Flame,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50/50 via-white to-purple-50/30 dark:from-[#0f0d15] dark:via-zinc-950 dark:to-[#0f0d15] text-zinc-900 dark:text-zinc-100 selection:bg-purple-500/20">
      {/* Navigation Header */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-white/70 dark:bg-zinc-950/70 border-b border-purple-100 dark:border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-purple-500/25 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-purple-700 via-purple-900 to-indigo-800 dark:from-purple-300 dark:via-purple-100 dark:to-indigo-200 bg-clip-text text-transparent">
                CloudNotes
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            {user ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 py-2 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-500/25 transition-all"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="py-2 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-purple-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-1.5 py-2 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-500/25 transition-all"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 sm:pt-28 sm:pb-24 px-4 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-purple-400/20 to-indigo-400/20 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100/80 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-semibold mb-6 animate-pulse">
            <Flame className="w-3.5 h-3.5 text-purple-600 fill-purple-600" />
            <span>Next-Gen Cloud Note-Taking & Sharing</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.15] text-zinc-900 dark:text-white mb-6">
            Think, write, organize and share —{" "}
            <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-800 dark:from-purple-400 dark:via-indigo-300 dark:to-purple-300 bg-clip-text text-transparent">
              in real time.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            A fast, cloud-based note-taking application powered by Next.js and Firebase.
            Auto-saves your ideas, synchronizes instantly across devices, and lets you share notes with secure expiry links.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={user ? "/dashboard" : "/register"}
              className="w-full sm:w-auto flex items-center justify-center gap-2 py-3.5 px-8 rounded-2xl text-sm sm:text-base font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all cursor-pointer active:scale-[0.98]"
            >
              <span>{user ? "Open Dashboard" : "Start Writing for Free"}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto flex items-center justify-center py-3.5 px-6 rounded-2xl text-sm sm:text-base font-semibold text-zinc-800 dark:text-zinc-200 bg-white/80 dark:bg-zinc-900/80 border border-purple-200/80 dark:border-zinc-800 hover:bg-purple-50/50 dark:hover:bg-zinc-800 transition-all cursor-pointer shadow-xs"
            >
              Sign In to Your Notes
            </Link>
          </div>

          {/* Social Proof & Features Pills */}
          <div className="mt-12 pt-8 border-t border-purple-100/60 dark:border-zinc-800/80 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-500" /> Real-time Cloud Sync
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-500" /> Continuous Auto-Save
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-500" /> Public Share Links with Expiry
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-500" /> Light & Dark SaaS Mode
            </span>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="py-16 px-4 bg-purple-50/40 dark:bg-zinc-900/30 border-y border-purple-100/80 dark:border-zinc-800/60">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              Built for speed, focus and effortless organization
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
              Everything you need in a modern cloud workspace without the clutter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-purple-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-300 flex items-center justify-center mb-5">
                <Cloud className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">
                Real-Time Cloud Sync
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Powered by Cloud Firestore. Every edit, pin, tag, or deletion updates instantaneously across all open browsers and devices.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-purple-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-300 flex items-center justify-center mb-5">
                <Share2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">
                Secure Link Sharing
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Generate shareable read-only URLs with customizable expiration timers (1 hour, 24 hours, 7 days) and instant revocation.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-purple-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-300 flex items-center justify-center mb-5">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">
                Auto-Save & Smart Tags
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Never lose a thought. Debounced auto-saving writes smoothly in the background while tags, colors, and pins keep you organized.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 px-4 text-center text-xs text-zinc-400 dark:text-zinc-500">
        <p>Built with Next.js, TypeScript, Tailwind CSS, and Firebase.</p>
      </footer>
    </div>
  );
}
