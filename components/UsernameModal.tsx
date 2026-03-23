"use client";

import { useState, useEffect, KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";

interface Props {
  roomCode: string;
  onConfirm: (username: string) => void;
}

const ADJECTIVES = ["Swift", "Quiet", "Bold", "Sharp", "Calm", "Bright", "Dark", "Neon", "Lazy", "Wild"];
const NOUNS = ["Fox", "Owl", "Dev", "Coder", "Hawk", "Wolf", "Byte", "Node", "Loop", "Stack"];

function randomName() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  return `${adj}${noun}${Math.floor(Math.random() * 90 + 10)}`;
}

export default function UsernameModal({ roomCode, onConfirm }: Props) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("codeshare_username");
    setName(saved || randomName());
  }, []);

  function handleConfirm() {
    const trimmed = name.trim();
    if (!trimmed) { setError("Enter a name."); return; }
    if (trimmed.length > 20) { setError("Max 20 characters."); return; }
    onConfirm(trimmed);
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleConfirm();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-sm rounded-2xl p-6"
        style={{ background: "#111118", border: "1px solid #2d2d3d" }}
      >
        <div className="flex items-center gap-2 mb-1">
          <Zap size={18} style={{ color: "#6366f1" }} fill="#6366f1" />
          <span className="text-white font-semibold">Joining room</span>
          <span
            className="font-mono font-bold tracking-widest px-2 py-0.5 rounded text-sm"
            style={{ background: "#1e1e2e", color: "#6366f1" }}
          >
            {roomCode}
          </span>
        </div>

        <p className="text-slate-500 text-sm mb-5">Pick a display name for this session.</p>

        <label className="block text-xs text-slate-400 mb-1.5 font-medium">Your name</label>
        <input
          autoFocus
          type="text"
          value={name}
          onChange={(e) => { setName(e.target.value); setError(""); }}
          onKeyDown={handleKey}
          maxLength={20}
          placeholder="e.g. SwiftFox42"
          className="w-full px-4 py-3 rounded-xl text-white outline-none border focus:border-indigo-500 transition-colors mb-1"
          style={{ background: "#0a0a0f", borderColor: error ? "#ef4444" : "#2d2d3d" }}
        />
        {error && <p className="text-red-400 text-xs mb-3">{error}</p>}

        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => setName(randomName())}
            className="text-xs text-slate-500 hover:text-indigo-400 transition-colors"
          >
            ↺ Random name
          </button>
          <button
            onClick={handleConfirm}
            className="px-5 py-2.5 rounded-xl font-semibold text-white text-sm transition-all hover:brightness-110 active:scale-95"
            style={{ background: "#6366f1" }}
          >
            Enter Room →
          </button>
        </div>
      </motion.div>
    </div>
  );
}
