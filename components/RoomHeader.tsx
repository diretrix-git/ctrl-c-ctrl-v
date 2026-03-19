"use client";

import { useState, useEffect } from "react";
import { Copy, Check, Users, Zap, Share2, Palette, AlignJustify, LayoutList } from "lucide-react";
import Link from "next/link";
import { useRoomStore, THEMES } from "@/lib/store";

interface Props {
  code: string;
  userCount: number;
}

export default function RoomHeader({ code, userCount }: Props) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showTheme, setShowTheme] = useState(false);
  const { theme, setTheme, compactMode, setCompactMode } = useRoomStore();

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

  // Close theme picker on outside click
  useEffect(() => {
    if (!showTheme) return;
    const handler = () => setShowTheme(false);
    setTimeout(() => document.addEventListener("click", handler), 0);
    return () => document.removeEventListener("click", handler);
  }, [showTheme]);

  return (
    <header
      className="sticky top-0 z-10 flex items-center justify-between px-4 sm:px-6 py-3 border-b gap-2"
      style={{ background: "#0a0a0f", borderColor: "#1e1e2e" }}
    >
      {/* Left: logo */}
      <Link
        href="/"
        className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors shrink-0"
      >
        <Zap size={18} style={{ color: "#6366f1" }} fill="#6366f1" />
        <span className="text-sm font-medium hidden sm:inline">CodeShare</span>
      </Link>

      {/* Center: room code + copy */}
      <div className="flex items-center gap-2">
        <span
          className="font-mono font-bold tracking-[0.25em] text-white"
          style={{ fontSize: "clamp(1rem, 3vw, 1.4rem)" }}
        >
          {code}
        </span>
        <button
          onClick={copyCode}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-150 active:scale-95"
          style={{ background: copiedCode ? "#16a34a" : "#6366f1", color: "white" }}
          aria-label="Copy room code"
        >
          {copiedCode ? <Check size={14} /> : <Copy size={14} />}
          <span className="hidden sm:inline">{copiedCode ? "Copied!" : "Copy"}</span>
        </button>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1.5 shrink-0">

        {/* Share room link */}
        <button
          onClick={shareRoom}
          title="Copy room link"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 active:scale-95"
          style={{
            background: copiedLink ? "#16a34a22" : "#1e1e2e",
            color: copiedLink ? "#4ade80" : "#94a3b8",
            border: "1px solid #2d2d3d",
          }}
        >
          {copiedLink ? <Check size={14} /> : <Share2 size={14} />}
          <span className="hidden sm:inline text-xs">{copiedLink ? "Copied!" : "Share"}</span>
        </button>

        {/* Theme picker */}
        <div className="relative">
          <button
            onClick={(e) => { e.stopPropagation(); setShowTheme((v) => !v); }}
            title="Syntax theme"
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
          title={compactMode ? "Comfortable view" : "Compact view"}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-all"
          style={{
            background: compactMode ? "#6366f122" : "#1e1e2e",
            color: compactMode ? "#6366f1" : "#94a3b8",
            border: `1px solid ${compactMode ? "#6366f1" : "#2d2d3d"}`,
          }}
        >
          {compactMode ? <LayoutList size={14} /> : <AlignJustify size={14} />}
        </button>

        {/* User count */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
          style={{ background: "#1e1e2e", border: "1px solid #2d2d3d" }}
        >
          <Users size={14} className="text-slate-400" />
          <span className="text-sm font-medium text-slate-300">{userCount}</span>
        </div>
      </div>
    </header>
  );
}
