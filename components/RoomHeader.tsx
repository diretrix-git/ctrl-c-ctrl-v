"use client";

import { useState, useEffect } from "react";
import { Copy, Check, Users, Zap } from "lucide-react";
import Link from "next/link";

interface Props {
  code: string;
  userCount: number;
}

export default function RoomHeader({ code, userCount }: Props) {
  const [copied, setCopied] = useState(false);

  function copyCode() {
    navigator.clipboard.writeText(code).then(() => setCopied(true));
  }

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  return (
    <header
      className="sticky top-0 z-10 flex items-center justify-between px-4 sm:px-6 py-3 border-b"
      style={{ background: "#0a0a0f", borderColor: "#1e1e2e" }}
    >
      {/* Left: logo */}
      <Link href="/" className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors">
        <Zap size={18} className="text-indigo-500" fill="#6366f1" />
        <span className="text-sm font-medium hidden sm:inline">CodeShare</span>
      </Link>

      {/* Center: room code */}
      <div className="flex items-center gap-3">
        <span
          className="font-mono font-bold tracking-[0.25em] text-white"
          style={{ fontSize: "clamp(1.1rem, 3vw, 1.5rem)" }}
        >
          {code}
        </span>
        <button
          onClick={copyCode}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-150 active:scale-95"
          style={{
            background: copied ? "#16a34a" : "#6366f1",
            color: "white",
          }}
          aria-label="Copy room code"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          <span className="hidden sm:inline">{copied ? "Copied!" : "Copy Code"}</span>
        </button>
      </div>

      {/* Right: user count */}
      <div className="flex items-center gap-1.5 text-slate-400">
        <Users size={16} />
        <span className="text-sm font-medium">{userCount}</span>
      </div>
    </header>
  );
}
