"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { Post } from "@/types";
import { formatTime } from "@/lib/utils";
import { useRoomStore } from "@/lib/store";

interface Props {
  post: Post;
  highlightedHtml: string | null;
  compact?: boolean;
}

export default function PostCard({ post, highlightedHtml, compact = false }: Props) {
  const [copied, setCopied] = useState(false);
  const { compactMode } = useRoomStore();
  const isCompact = compact || compactMode;

  function handleCopy() {
    navigator.clipboard.writeText(post.content).then(() => setCopied(true));
  }

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  // Add line numbers to highlighted HTML
  function addLineNumbers(html: string, content: string): string {
    const lineCount = content.split("\n").length;
    if (lineCount <= 1) return html;
    const nums = Array.from({ length: lineCount }, (_, i) =>
      `<span class="ln">${i + 1}</span>`
    ).join("\n");
    return `<div class="code-with-lines"><div class="line-numbers" aria-hidden="true">${nums}</div><div class="code-content">${html}</div></div>`;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="rounded-xl overflow-hidden"
      style={{ background: "#111118" }}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between px-4 border-b ${isCompact ? "py-1.5" : "py-2.5"}`}
        style={{ borderColor: "#1e1e2e" }}
      >
        <div className="flex items-center gap-2.5">
          {/* Avatar dot */}
          <span
            className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
            style={{ background: stringToColor(post.username), color: "white" }}
          >
            {post.username[0].toUpperCase()}
          </span>
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
            className={`overflow-x-auto border-l-4 ${isCompact ? "px-3 py-2" : "px-4 py-4"}`}
            style={{ borderLeftColor: "#6366f1", background: "#0e0e16" }}
          >
            {highlightedHtml ? (
              <div
                className="shiki"
                dangerouslySetInnerHTML={{
                  __html: isCompact
                    ? highlightedHtml
                    : addLineNumbers(highlightedHtml, post.content),
                }}
              />
            ) : (
              <pre
                className="font-mono text-slate-300 whitespace-pre-wrap break-words"
                style={{ fontSize: isCompact ? "0.8rem" : "0.875rem" }}
              >
                {post.content}
              </pre>
            )}
          </div>
        ) : (
          <div className={isCompact ? "px-4 py-2" : "px-4 py-4"}>
            <p
              className="text-slate-200 leading-relaxed whitespace-pre-wrap break-words"
              style={{ fontSize: isCompact ? "0.8rem" : "0.875rem" }}
            >
              {post.content}
            </p>
          </div>
        )}

        {/* COPY BUTTON */}
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-sm transition-all duration-150 active:scale-95"
          style={{
            background: copied ? "#16a34a" : "#6366f1",
            color: "white",
            minWidth: "76px",
            justifyContent: "center",
          }}
          aria-label="Copy content"
        >
          {copied ? (
            <><Check size={13} />Copied ✓</>
          ) : (
            <><Copy size={13} />Copy</>
          )}
        </button>
      </div>
    </motion.div>
  );
}

// Deterministic color from username string
function stringToColor(str: string): string {
  const colors = [
    "#6366f1", "#8b5cf6", "#ec4899", "#f59e0b",
    "#10b981", "#3b82f6", "#ef4444", "#14b8a6",
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}
