"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";

export default function NotFound() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
      style={{ background: "#0a0a0f" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Zap size={40} className="text-indigo-500 mx-auto mb-6" fill="#6366f1" />
        <h1 className="text-7xl font-bold text-white mb-4">404</h1>
        <p className="text-slate-400 text-lg mb-8">
          This page doesn&apos;t exist. Maybe the room expired?
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 rounded-xl font-semibold text-white transition-all hover:brightness-110 active:scale-95"
          style={{ background: "#6366f1" }}
        >
          Back to Home
        </Link>
      </motion.div>
    </main>
  );
}
