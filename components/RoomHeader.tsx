"use client";

import { useState, useEffect } from "react";
import { Copy, Check, Users, Zap, Share2, Palette, AlignJustify, LayoutList } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRoomStore, THEMES } from "@/lib/store";

interface Props {
  code: string;
  userCount: number;
}

function avatarColor(name: string) {
  const colors = ["#6366f1","#8b5cf6","#ec4899","#f59e0b","#10b981","#3b82f6","#ef4444","#14b8a6"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

export default function RoomHeader({ code, userCount }: Props) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showTheme, setShowTheme] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const { theme, setTheme, compactMode, setCompactMode, onlineUsers } = useRoomStore();

  function copyCode() {
    navigator.clipboard.writeText(code).then(() => setCopiedCode(true));
  }

  function shareRoom() {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(window.location.href).then(() => setCopiedLink(true));
  }

  useEffect(() => {
    if (!copiedCode) return;
    const t = setTimeout(() => setCopiedCode(false), 2000);
    return () => clearTimeout(t);
  }, [copiedCode]);

  useEffect(() => {
    if (!copiedLink) return;
    const t = setTimeout(() => setCopiedLink(false), 2000);
    return () => clearTimeout(t);
  }, [copiedLink]);

  useEffect(() => {
    if (!showTheme) return;
    const handler = () => setShowTheme(false);
    setTimeout(() => document.addEventListener("click", handler), 0);
    return () => document.removeEventListener("click", handler);
  }, [showTheme]);

  useEffect(() => {
    if (!showUsers) return;
    const handler = () => setShowUsers(false);
    setTimeout(() => document.addEventListener("click", handler), 0);
    return () => document.removeEventListener("click", handler);
  }, [showUsers]);

  return (
    <>
      <header
        className="sticky top-0 z-10 flex items-center justify-between px-4 sm:px-6 py-3 border-b gap-2"
        style={{ background: "#0a0a0f", borderColor: "#1e1e2e" }}
      >
        {/* Left: logo */}
        <Link
          href="/"
          aria-label="Go to home page"
          className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors shrink-0"
        >
          <Zap size={18} style={{ color: "#6366f1" }} fill="#6366f1" />
          <span className="text-sm font-medium hidden sm:inline">ctrl-c-ctrl-v</span>
        </Link>

        {/* Center: room code + copy */}
        <div className="flex items-center gap-2">
          <span
            className="font-mono font-bold tracking-[0.25em] text-white"
            style={{ fontSize: "clamp(1rem, 3vw, 1.4rem)" }}
          >
            {code}
          </span>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={copyCode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors duration-150"
            style={{ background: copiedCode ? "#16a34a" : "#6366f1", color: "white" }}
            aria-label="Copy room code"
          >
            {copiedCode ? <Check size={14} /> : <Copy size={14} />}
            <span className="hidden sm:inline">{copiedCode ? "Copied!" : "Copy"}</span>
          </motion.button>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-1.5 shrink-0">

          {/* Share room link */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={shareRoom}
            aria-label="Share room link"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150"
            style={{
              background: copiedLink ? "#16a34a22" : "#1e1e2e",
              color: copiedLink ? "#4ade80" : "#94a3b8",
              border: "1px solid #2d2d3d",
            }}
          >
            {copiedLink ? <Check size={14} /> : <Share2 size={14} />}
            <span className="hidden sm:inline text-xs">{copiedLink ? "Copied!" : "Share"}</span>
          </motion.button>

          {/* Theme picker */}
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setShowTheme((v) => !v); }}
              aria-label="Switch syntax theme"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={{ background: "#1e1e2e", color: "#94a3b8", border: "1px solid #2d2d3d" }}
            >
              <Palette size={14} />
              <span className="hidden sm:inline text-xs">Theme</span>
            </button>

            {showTheme && (
              <div
                className="absolute right-0 top-full mt-1 rounded-xl overflow-hidden shadow-xl z-20"
                style={{ background: "#111118", border: "1px solid #2d2d3d", minWidth: "140px" }}
                onClick={(e) => e.stopPropagation()}
              >
                {THEMES.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => { setTheme(t.value); setShowTheme(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-indigo-500/10"
                    style={{
                      color: theme === t.value ? "#6366f1" : "#94a3b8",
                      fontWeight: theme === t.value ? 600 : 400,
                    }}
                  >
                    {theme === t.value && <span className="mr-2">✓</span>}
                    {t.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Compact mode toggle */}
          <button
            onClick={() => setCompactMode(!compactMode)}
            aria-label={compactMode ? "Switch to comfortable view" : "Switch to compact view"}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-all"
            style={{
              background: compactMode ? "#6366f122" : "#1e1e2e",
              color: compactMode ? "#6366f1" : "#94a3b8",
              border: `1px solid ${compactMode ? "#6366f1" : "#2d2d3d"}`,
            }}
          >
            {compactMode ? <LayoutList size={14} /> : <AlignJustify size={14} />}
          </button>

          {/* Online users with pulse dot */}
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setShowUsers((v) => !v); }}
              aria-label={`${userCount} user${userCount !== 1 ? "s" : ""} online — click to see who`}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer"
              style={{
                background: showUsers ? "#6366f122" : "#1e1e2e",
                border: `1px solid ${showUsers ? "#6366f1" : "#2d2d3d"}`,
              }}
            >
              <Users size={14} className="text-slate-400" />
              <span className="text-sm font-medium text-slate-300">{userCount}</span>
              {/* Live pulse dot */}
              {userCount > 0 && (
                <span className="relative flex h-2 w-2">
                  <motion.span
                    animate={{ scale: [1, 1.8, 1], opacity: [0.8, 0, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inline-flex h-full w-full rounded-full bg-emerald-400"
                  />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
              )}
            </button>

            <AnimatePresence>
              {showUsers && onlineUsers.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-1 rounded-xl shadow-xl z-20 py-1"
                  style={{ background: "#111118", border: "1px solid #2d2d3d", minWidth: "180px" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <p className="px-4 py-2 text-xs text-slate-500 font-medium uppercase tracking-wider border-b" style={{ borderColor: "#2d2d3d" }}>
                    Online — {onlineUsers.length}
                  </p>
                  {onlineUsers.map((user) => (
                    <div key={user} className="flex items-center gap-3 px-4 py-2.5 hover:bg-indigo-500/5 transition-colors">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                        style={{ background: avatarColor(user) }}
                      >
                        {user.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="text-sm text-slate-300 truncate">{user}</span>
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Share link copied toast */}
      <AnimatePresence>
        {copiedLink && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl text-sm font-medium text-white shadow-xl"
            style={{ background: "#16a34a", border: "1px solid #15803d" }}
          >
            Room link copied to clipboard ✓
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
