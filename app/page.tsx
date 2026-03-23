"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { customAlphabet } from "nanoid";
import { Zap } from "lucide-react";
import Script from "next/script";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "ctrl-c-ctrl-v",
  url: "https://ctrl-c-ctrl-v.up.railway.app",
  description:
    "Real-time code and text sharing. Create a room, post snippets, everyone sees it live. No sign up required.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Real-time code sharing",
    "Syntax highlighting",
    "No sign up required",
    "One-click copy",
    "Multiple syntax themes",
  ],
};

const nanoid = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 6);

export default function LandingPage() {
  const router = useRouter();
  const [joinCode, setJoinCode] = useState("");
  const [showJoin, setShowJoin] = useState(false);
  const [error, setError] = useState("");

  function createRoom() {
    const code = nanoid();
    router.push(`/room/${code}`);
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
      <main className="min-h-screen flex flex-col items-center justify-center px-4"
        style={{ background: "#0a0a0f" }}>

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-2 mb-8"
      >
        <Zap size={28} className="text-indigo-500" fill="#6366f1" />
        <span className="text-xl font-semibold tracking-tight text-white">CodeShare</span>
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-4xl sm:text-6xl font-bold text-center text-white leading-tight mb-4"
      >
        Share code.
        <br />
        <span style={{ color: "#6366f1" }}>Instantly.</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-slate-400 text-center text-lg mb-12 max-w-md"
      >
        Join a room, post code or text, everyone sees it live. No accounts. No friction.
      </motion.p>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-4 w-full max-w-sm"
      >
        <button
          onClick={createRoom}
          className="flex-1 py-4 rounded-xl font-semibold text-white text-lg transition-all duration-150 hover:brightness-110 active:scale-95"
          style={{ background: "#6366f1" }}
        >
          Create Room
        </button>

        <button
          onClick={() => { setShowJoin((v) => !v); setError(""); }}
          className="flex-1 py-4 rounded-xl font-semibold text-white text-lg border transition-all duration-150 hover:border-indigo-500 hover:text-indigo-400 active:scale-95"
          style={{ borderColor: "#2d2d3d", background: "#111118" }}
        >
          Join Room
        </button>
      </motion.div>

      {/* Join input */}
      {showJoin && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.25 }}
          className="mt-4 w-full max-w-sm overflow-hidden"
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
              className="flex-1 px-4 py-3 rounded-xl text-white font-mono text-lg tracking-widest outline-none border focus:border-indigo-500 transition-colors"
              style={{ background: "#111118", borderColor: "#2d2d3d" }}
            />
            <button
              onClick={joinRoom}
              className="px-5 py-3 rounded-xl font-semibold text-white transition-all hover:brightness-110 active:scale-95"
              style={{ background: "#6366f1" }}
            >
              Go
            </button>
          </div>
          {error && <p className="text-red-400 text-sm mt-2 pl-1">{error}</p>}
        </motion.div>
      )}

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-slate-600 text-sm mt-16"
      >
        No sign up. No data stored. Posts vanish when the room empties.
      </motion.p>
    </main>
    </>
  );
}
