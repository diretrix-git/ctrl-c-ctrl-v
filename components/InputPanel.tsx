"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { Send, Code2, Type } from "lucide-react";
import { Language, LANGUAGES } from "@/types";

interface Props {
  onSend: (content: string, type: "code" | "text", language: Language | null) => void;
}

export default function InputPanel({ onSend }: Props) {
  const [mode, setMode] = useState<"code" | "text">("code");
  const [content, setContent] = useState("");
  const [language, setLanguage] = useState<Language>("javascript");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleSend() {
    const trimmed = content.trim();
    if (!trimmed) return;
    onSend(trimmed, mode, mode === "code" ? language : null);
    setContent("");
    textareaRef.current?.focus();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div
      className="border-t px-4 py-4"
      style={{ background: "#0a0a0f", borderColor: "#1e1e2e" }}
    >
      {/* Mode toggle + language selector */}
      <div className="flex items-center gap-2 mb-3">
        <button
          onClick={() => setMode("code")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
          style={{
            background: mode === "code" ? "#6366f1" : "#111118",
            color: mode === "code" ? "white" : "#94a3b8",
            border: `1px solid ${mode === "code" ? "#6366f1" : "#2d2d3d"}`,
          }}
        >
          <Code2 size={14} />
          Code
        </button>
        <button
          onClick={() => setMode("text")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
          style={{
            background: mode === "text" ? "#6366f1" : "#111118",
            color: mode === "text" ? "white" : "#94a3b8",
            border: `1px solid ${mode === "text" ? "#6366f1" : "#2d2d3d"}`,
          }}
        >
          <Type size={14} />
          Text
        </button>

        {mode === "code" && (
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="ml-auto px-3 py-1.5 rounded-lg text-sm font-mono outline-none border transition-colors cursor-pointer"
            style={{
              background: "#111118",
              color: "#e2e8f0",
              borderColor: "#2d2d3d",
            }}
          >
            {LANGUAGES.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        )}

        <span className="text-xs text-slate-600 ml-auto hidden sm:inline">
          Ctrl+Enter to send
        </span>
      </div>

      {/* Textarea + send */}
      <div className="flex gap-2">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            mode === "code"
              ? `Paste your ${language} code here...`
              : "Type a message..."
          }
          rows={4}
          className="flex-1 px-4 py-3 rounded-xl text-sm outline-none border resize-none transition-colors focus:border-indigo-500"
          style={{
            background: "#111118",
            color: "#e2e8f0",
            borderColor: "#2d2d3d",
            fontFamily: mode === "code" ? '"JetBrains Mono", monospace' : "Inter, sans-serif",
            lineHeight: "1.6",
          }}
        />
        <button
          onClick={handleSend}
          disabled={!content.trim()}
          className="px-4 py-3 rounded-xl font-semibold transition-all duration-150 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed self-end"
          style={{ background: "#6366f1", color: "white" }}
          aria-label="Send"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
