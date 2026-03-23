"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { customAlphabet } from "nanoid";
import { Zap, Plus, Hash, Code2, Share2, Eye } from "lucide-react";
import Script from "next/script";
import Link from "next/link";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "ctrl-c-ctrl-v",
  url: "https://ctrl-c-ctrl-v.up.railway.app",
  description:
    "Real-time code and text sharing. No login required. Rooms vanish when empty.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  featureList: [
    "Real-time code sharing",
    "Syntax highlighting",
    "No sign up required",
    "One-click copy",
    "Multiple syntax themes",
  ],
};

const nanoid = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 6);

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: Plus,
    title: "Create",
    desc: 'Click "Create Room" to instantly get a shareable link — no sign-up needed.',
  },
  {
    step: "02",
    icon: Share2,
    title: "Share",
    desc: "Send the link to anyone. They join in one click, no account required.",
  },
  {
    step: "03",
    icon: Eye,
    title: "Code together",
    desc: "Everyone sees every snippet live as you post. Copy and go.",
  },
];

// Keycap component
function Keycap({ label, delay }: { label: string; delay: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="inline-flex items-center justify-center font-mono font-bold text-sm px-3 py-1.5 rounded-lg select-none"
      style={{
        background: "#1a1a2e",
        color: "#a5b4fc",
        border: "1px solid #3d3d5c",
        boxShadow: "0 3px 0 #0d0d1a",
        letterSpacing: "0.05em",
      }}
    >
      {label}
    </motion.span>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const [joinCode, setJoinCode] = useState("");
  const [showJoin, setShowJoin] = useState(false);
  const [error, setError] = useState("");

  function createRoom() {
    const code = nanoid();
    router.push(`/room/${code}?new=1`);
  }

  function joinRoom() {
    const code = joinCode.trim().toUpperCase();
    if (code.length < 4) {
      setError("Enter a valid room code.");
      return;
    }
    router.push(`/room/${code}`);
  }

  return (
    <>
      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen flex flex-col" style={{ background: "#0a0a0f" }}>
        <main className="flex-1 flex flex-col items-center justify-center px-4 pt-16 pb-8">

          {/* Keyboard shortcut brand */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 mb-10"
          >
            <Keycap label="Ctrl" delay={0.1} />
            <Keycap label="C" delay={0.2} />
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-slate-600 text-sm font-mono"
            >
              +
            </motion.span>
            <Keycap label="Ctrl" delay={0.35} />
            <Keycap label="V" delay={0.45} />
          </motion.div>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex items-center gap-2 mb-8"
          >
            <Zap size={28} className="text-indigo-500" fill="#6366f1" />
            <span className="text-xl font-semibold tracking-tight text-white">ctrl-c-ctrl-v</span>
          </motion.div>

          {/* Headline — staggered word reveal */}
          <div className="text-center mb-4 overflow-hidden">
            {["Paste code.", "Share a link.", "Everyone sees it live."].map((line, i) => (
              <motion.div
                key={line}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.2 + i * 0.1 }}
              >
                <h1
                  className="font-bold text-white leading-tight"
                  style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)" }}
                >
                  {i === 2 ? (
                    <span style={{ color: "#6366f1" }}>{line}</span>
                  ) : (
                    line
                  )}
                </h1>
              </motion.div>
            ))}
          </div>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.55 }}
            className="text-slate-300 text-center text-lg mb-10 max-w-md"
          >
            No sign up. No data stored. Rooms vanish when empty.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.65 }}
            className="flex flex-col sm:flex-row gap-3 w-full max-w-sm"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={createRoom}
              aria-label="Create a new room"
              className="flex-1 py-4 rounded-xl font-bold text-white text-lg transition-colors"
              style={{ background: "#6366f1" }}
            >
              Create Room
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { setShowJoin((v) => !v); setError(""); }}
              aria-label="Join an existing room by code"
              className="flex-1 py-4 rounded-xl font-semibold text-slate-300 text-base border transition-colors hover:border-indigo-500 hover:text-indigo-400"
              style={{ borderColor: "#2d2d3d", background: "#111118" }}
            >
              Join Room
            </motion.button>
          </motion.div>

          {/* Join input */}
          <AnimatePresence>
            {showJoin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="mt-3 w-full max-w-sm overflow-hidden"
              >
                <div className="flex gap-2">
                  <input
                    autoFocus
                    type="text"
                    placeholder="Enter room code"
                    value={joinCode}
                    onChange={(e) => { setJoinCode(e.target.value.toUpperCase()); setError(""); }}
                    onKeyDown={(e) => e.key === "Enter" && joinRoom()}
                    maxLength={8}
                    aria-label="Room code"
                    className="flex-1 px-4 py-3 rounded-xl text-white font-mono text-lg tracking-widest outline-none border focus:border-indigo-500 transition-colors"
                    style={{ background: "#111118", borderColor: error ? "#ef4444" : "#2d2d3d" }}
                  />
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={joinRoom}
                    aria-label="Go to room"
                    className="px-5 py-3 rounded-xl font-semibold text-white transition-all"
                    style={{ background: "#6366f1" }}
                  >
                    Go
                  </motion.button>
                </div>
                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-red-400 text-sm mt-2 pl-1"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* How it works */}
          <div id="how-it-works" className="mt-20 w-full max-w-2xl">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="text-center text-xs font-semibold uppercase tracking-widest text-slate-500 mb-8"
            >
              How it works
            </motion.p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {HOW_IT_WORKS.map(({ step, icon: Icon, title, desc }, i) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="rounded-2xl p-5 flex flex-col gap-3"
                  style={{ background: "#111118", border: "1px solid #1e1e2e" }}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold" style={{ color: "#6366f1" }}>
                      {step}
                    </span>
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: "#6366f122" }}
                    >
                      <Icon size={16} style={{ color: "#6366f1" }} />
                    </div>
                    <span className="font-semibold text-white text-sm">{title}</span>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-slate-500 text-sm mt-12"
          >
            No sign up. No data stored. Posts vanish when the room empties.
          </motion.p>
        </main>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="w-full border-t px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderColor: "#1e1e2e" }}
        >
          <div className="flex items-center gap-2">
            <Zap size={16} style={{ color: "#6366f1" }} fill="#6366f1" />
            <span className="text-sm font-semibold text-white">ctrl-c-ctrl-v</span>
            <span className="text-slate-600 text-sm">— Real-time code sharing</span>
          </div>
          <div className="flex items-center gap-5 text-sm text-slate-500">
            <a
              href="#how-it-works"
              className="hover:text-slate-300 transition-colors"
            >
              How it works
            </a>
            <a
              href="https://github.com/diretrix-git/ctrl-c-ctrl-v"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 transition-colors flex items-center gap-1"
              aria-label="View source on GitHub"
            >
              <Code2 size={14} />
              GitHub
            </a>
            <span className="text-slate-600 text-xs">No data is stored.</span>
          </div>
        </motion.footer>
      </div>
    </>
  );
}
