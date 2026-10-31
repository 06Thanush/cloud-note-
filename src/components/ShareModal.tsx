"use client";

import { useState, useEffect } from "react";
import {
  X,
  Share2,
  Copy,
  Check,
  Clock,
  Globe,
  ShieldAlert,
  ExternalLink,
  Power,
} from "lucide-react";
import { Note } from "@/types/note";

interface ShareModalProps {
  note: Note | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateShare: (
    noteId: string,
    isShared: boolean,
    shareExpiresAt?: number | null
  ) => Promise<void>;
  onToast: (type: "success" | "error" | "info", title: string, message?: string) => void;
}

export default function ShareModal({
  note,
  isOpen,
  onClose,
  onUpdateShare,
  onToast,
}: ShareModalProps) {
  const [isShared, setIsShared] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expiryOption, setExpiryOption] = useState<string>("never");

  useEffect(() => {
    if (note) {
      setIsShared(Boolean(note.isShared));
      if (!note.shareExpiresAt) {
        setExpiryOption("never");
      } else {
        const remainingHours = (note.shareExpiresAt - Date.now()) / (1000 * 60 * 60);
        if (remainingHours <= 1.5) setExpiryOption("1h");
        else if (remainingHours <= 25) setExpiryOption("24h");
        else if (remainingHours <= 7 * 25) setExpiryOption("7d");
        else setExpiryOption("30d");
      }
    }
  }, [note]);

  if (!isOpen || !note) return null;

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const shareUrl = `${origin}/share/${note.shareId || note.id}`;

  const handleToggleShare = async (enable: boolean) => {
    try {
      setLoading(true);
      let expiresAt: number | null = null;
      if (enable) {
        if (expiryOption === "1h") expiresAt = Date.now() + 60 * 60 * 1000;
        else if (expiryOption === "24h") expiresAt = Date.now() + 24 * 60 * 60 * 1000;
        else if (expiryOption === "7d") expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
        else if (expiryOption === "30d") expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;
      }

      await onUpdateShare(note.id, enable, expiresAt);
      setIsShared(enable);
      onToast(
        "success",
        enable ? "Public link activated" : "Sharing disabled",
        enable
          ? "Anyone with this link can view this note read-only."
          : "Access to this link has been revoked."
      );
    } catch (err) {
      console.error(err);
      onToast("error", "Failed to update sharing settings");
    } finally {
      setLoading(false);
    }
  };

  const handleExpiryChange = async (option: string) => {
    setExpiryOption(option);
    if (!isShared) return;

    try {
      setLoading(true);
      let expiresAt: number | null = null;
      if (option === "1h") expiresAt = Date.now() + 60 * 60 * 1000;
      else if (option === "24h") expiresAt = Date.now() + 24 * 60 * 60 * 1000;
      else if (option === "7d") expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
      else if (option === "30d") expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;

      await onUpdateShare(note.id, true, expiresAt);
      onToast("success", "Expiration time updated");
    } catch (err) {
      console.error(err);
      onToast("error", "Failed to update expiration");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      onToast("success", "Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Clipboard copy failed", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl border border-purple-100 dark:border-zinc-800 shadow-2xl overflow-hidden p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-purple-50 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-300 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                Share Note
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Generate a secure, public read-only link
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Note title preview */}
        <div className="p-3.5 rounded-xl bg-purple-50/50 dark:bg-zinc-800/50 border border-purple-100/60 dark:border-zinc-700/60 flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate">
            {note.title || "Untitled Note"}
          </span>
          <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
            {note.content.length} characters
          </span>
        </div>

        {/* Share switch */}
        <div className="flex items-center justify-between p-4 rounded-2xl border border-purple-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
          <div className="flex items-start gap-3">
            <Globe className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Public Read-Only Access
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Anyone with the link can view this note in their browser
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isShared}
              onChange={(e) => handleToggleShare(e.target.checked)}
              disabled={loading}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600" />
          </label>
        </div>

        {/* If enabled: Link Box and Expiration settings */}
        {isShared ? (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-150">
            {/* Shareable Link Input */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Shareable Link
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="w-full text-xs py-2.5 px-3 rounded-xl bg-purple-50/50 dark:bg-zinc-800 border border-purple-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 select-all"
                />
                <button
                  onClick={handleCopy}
                  type="button"
                  className="flex items-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 transition-colors shrink-0 shadow-sm shadow-purple-500/20 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>

            {/* Expiration options */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                <Clock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>Link Expiration</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: "never", label: "Never" },
                  { id: "1h", label: "1 Hour" },
                  { id: "24h", label: "24 Hours" },
                  { id: "7d", label: "7 Days" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleExpiryChange(item.id)}
                    type="button"
                    className={`py-2 px-3 rounded-xl text-xs font-medium border transition-colors cursor-pointer text-center ${
                      expiryOption === item.id
                        ? "bg-purple-100/80 dark:bg-purple-950/60 border-purple-400 dark:border-purple-600 text-purple-900 dark:text-purple-200 font-semibold"
                        : "border-purple-100 dark:border-zinc-800 hover:bg-purple-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview link in new tab */}
            <div className="pt-2 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
              <a
                href={shareUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-purple-600 dark:text-purple-400 hover:underline font-medium"
              >
                <span>Preview public note page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => handleToggleShare(false)}
                type="button"
                className="flex items-center gap-1 text-rose-600 dark:text-rose-400 hover:underline font-medium"
              >
                <Power className="w-3 h-3" />
                <span>Disable sharing</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-purple-50/40 dark:bg-zinc-800/40 border border-purple-100/50 dark:border-zinc-800 text-center text-xs text-zinc-500 dark:text-zinc-400">
            Enable public read-only access above to share this note with anyone via a secure URL.
          </div>
        )}

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            type="button"
            className="py-2 px-5 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-purple-50 dark:hover:bg-zinc-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
