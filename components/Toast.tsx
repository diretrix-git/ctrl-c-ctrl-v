"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserPlus, UserMinus } from "lucide-react";

export interface ToastMessage {
  id: string;
  text: string;
  type: "join" | "leave" | "info";
}

interface Props {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

export default function Toast({ toasts, onRemove }: Props) {
  return (
    <div className="fixed bottom-24 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onRemove={onRemove} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({ toast, onRemove }: { toast: ToastMessage; onRemove: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), 3000);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  const icon =
    toast.type === "join" ? (
      <UserPlus size={14} className="text-emerald-400 shrink-0" />
    ) : toast.type === "leave" ? (
      <UserMinus size={14} className="text-slate-400 shrink-0" />
    ) : null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 40, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="pointer-events-auto flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-300 shadow-lg"
      style={{ background: "#1a1a2e", border: "1px solid #2d2d3d", maxWidth: "220px" }}
    >
      {icon}
      <span className="truncate">{toast.text}</span>
      <button
        onClick={() => onRemove(toast.id)}
        className="ml-auto text-slate-500 hover:text-slate-300 transition-colors shrink-0"
      >
        <X size={12} />
      </button>
    </motion.div>
  );
}
