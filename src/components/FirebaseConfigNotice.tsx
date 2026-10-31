"use client";

import { useState } from "react";
import { AlertTriangle, ChevronRight, X, ExternalLink, Key } from "lucide-react";
import { isFirebaseConfigured } from "@/lib/firebase";

export default function FirebaseConfigNotice() {
  const [show, setShow] = useState(() => !isFirebaseConfigured());
  const [showInstructions, setShowInstructions] = useState(false);

  if (!show) return null;

  return (
    <div className="bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-amber-500/10 border-b border-amber-200/80 dark:border-amber-800/60 px-4 py-2.5 text-xs text-amber-900 dark:text-amber-200">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>
            <strong>Firebase Setup Required:</strong> Connect your real Firebase project credentials in{" "}
            <code className="bg-amber-100 dark:bg-amber-950/80 px-1.5 py-0.5 rounded font-mono text-[11px] border border-amber-300 dark:border-amber-800">
              .env.local
            </code>{" "}
            to enable live cloud sync and authentication.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            className="font-medium underline hover:text-amber-800 dark:hover:text-amber-100 flex items-center gap-1 cursor-pointer"
          >
            <Key className="w-3.5 h-3.5" />
            {showInstructions ? "Hide instructions" : "How to connect"}
          </button>
          <button
            onClick={() => setShow(!show)}
            className="p-1 text-amber-700 hover:text-amber-900 dark:text-amber-300 dark:hover:text-amber-100 rounded cursor-pointer"
            aria-label="Dismiss notice"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {showInstructions && (
        <div className="mt-3 p-4 bg-white/90 dark:bg-zinc-900/90 rounded-xl border border-amber-300/80 dark:border-amber-800/80 shadow-md text-zinc-800 dark:text-zinc-200 space-y-2">
          <h4 className="font-semibold text-sm text-amber-900 dark:text-amber-300">
            Simple 3-Minute Firebase Setup:
          </h4>
          <ol className="list-decimal list-inside space-y-1 text-xs">
            <li>
              Go to the{" "}
              <a
                href="https://console.firebase.google.com"
                target="_blank"
                rel="noreferrer"
                className="text-purple-600 dark:text-purple-400 underline inline-flex items-center gap-0.5"
              >
                Firebase Console <ExternalLink className="w-3 h-3" />
              </a>{" "}
              and create a project.
            </li>
            <li>
              Under <strong>Authentication</strong>, enable <strong>Email/Password</strong> and{" "}
              <strong>Google</strong> sign-in providers.
            </li>
            <li>
              Under <strong>Firestore Database</strong>, create a database in test mode (or deploy the included{" "}
              <code className="font-mono text-[11px] bg-zinc-100 dark:bg-zinc-800 px-1 rounded">firestore.rules</code>).
            </li>
            <li>
              Go to <strong>Project Settings &gt; General &gt; Your apps</strong>, add a Web app, and copy the config keys into{" "}
              <code className="font-mono text-[11px] bg-zinc-100 dark:bg-zinc-800 px-1 rounded">.env.local</code>.
            </li>
          </ol>
        </div>
      )}
    </div>
  );
}
