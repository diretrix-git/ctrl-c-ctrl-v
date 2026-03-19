"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { Post } from "@/types";
import { formatTime } from "@/lib/utils";

interface Props {
  post: Post;
  highlightedHtml: string | null;
}

export default function PostCard({ post, highlightedHtml }: Props) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(post.content).then(() => {
      setCopied(true);
    });
  }

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="rounded-xl overflow-hidden"
      style={{ background: "#111118" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b"
        style={{ borderColor: "#1e1e2e" }}>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-300">{post.username}</span>
          {post.type === "code" && post.language && (
            <span
              className="text-xs px-2 py-0.5 rounded font-mono font-medium"
              style={{ background: "#1e1e2e", color: "#6366f1" }}
            >
              {post.language}
            </span>
          )}
          {post.type === "text" && (
            <span
              className="text-xs px-2 py-0.5 rounded font-medium"
              style={{ background: "#1e1e2e", color: "#94a3b8" }}
            >
              text
            </span>
          )}
        </div>
        <span className="text-xs text-slate-500">{formatTime(post.timestamp)}</span>
      </div>

      {/* Content */}
      <div className="relative">
        {post.type === "code" ? (
          <div
            className="px-4 py-4 overflow-x-auto border-l-4"
            style={{ borderLeftColor: "#6366f1", background: "#0e0e16" }}
          >
            {highlightedHtml ? (
              <div
                className="shiki"
                dangerouslySetInnerHTML={{ __html: highlightedHtml }}
              />
            ) : (
              <pre className="font-mono text-sm text-slate-300 whitespace-pre-wrap break-words">
                {post.content}
              </pre>
            )}
          </div>
        ) : (
          <div className="px-4 py-4">
            <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap break-words">
              {post.content}
            </p>
          </div>
        )}

        {/* COPY BUTTON — always visible, impossible to miss */}
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-sm transition-all duration-150 active:scale-95"
          style={{
            background: copied ? "#16a34a" : "#6366f1",
            color: "white",
            minWidth: "80px",
            justifyContent: "center",
          }}
          aria-label="Copy content"
        >
          {copied ? (
            <>
              <Check size={14} />
              Copied ✓
            </>
          ) : (
            <>
              <Copy size={14} />
              Copy
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
