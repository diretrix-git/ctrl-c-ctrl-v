"use client";

import { useEffect, useRef, useState, useCallback, use } from "react";
import { codeToHtml } from "shiki";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { customAlphabet } from "nanoid";
import { getSocket } from "@/lib/socket";
import { useRoomStore } from "@/lib/store";
import { Post, Language } from "@/types";
import RoomHeader from "@/components/RoomHeader";
import PostCard from "@/components/PostCard";
import InputPanel from "@/components/InputPanel";
import UsernameModal from "@/components/UsernameModal";
import Toast, { ToastMessage } from "@/components/Toast";

export default function RoomPage({ params, searchParams }: { params: Promise<{ code: string }>; searchParams: Promise<{ new?: string }> }) {
  const resolvedParams = use(params);
  const resolvedSearch = use(searchParams);
  const code = resolvedParams.code.toUpperCase();
  const isCreating = resolvedSearch.new === "1";

  const { posts, userCount, username, theme, setPosts, addPost, setUserCount, setUsername, setOnlineUsers } =
    useRoomStore();

  const [highlightCache, setHighlightCache] = useState<Record<string, string>>({});
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [roomReady, setRoomReady] = useState(false);
  const [roomNotFound, setRoomNotFound] = useState(false);
  const router = useRouter();
  const nanoid = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 6);
  const feedRef = useRef<HTMLDivElement>(null);

  function createNewRoom() {
    router.push(`/room/${nanoid()}?new=1`);
  }
  const joinedRef = useRef(false);

  function addToast(text: string, type: ToastMessage["type"]) {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev.slice(-4), { id, text, type }]);
  }

  function removeToast(id: string) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  const highlight = useCallback(
    async (post: Post, currentTheme: string) => {
      if (post.type !== "code" || !post.language) return;
      const cacheKey = `${post.id}__${currentTheme}`;
      if (highlightCache[cacheKey]) return;
      try {
        const html = await codeToHtml(post.content, {
          lang: post.language,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          theme: currentTheme as any,
        });
        setHighlightCache((prev) => ({ ...prev, [cacheKey]: html }));
      } catch {
        // fallback: plain text
      }
    },
    [highlightCache]
  );

  function scrollToBottom() {
    setTimeout(() => {
      if (feedRef.current) {
        feedRef.current.scrollTop = feedRef.current.scrollHeight;
      }
    }, 50);
  }

  function joinRoom(name: string) {
    setUsername(name);
    setShowModal(false);
    localStorage.setItem("codeshare_username", name);

    if (joinedRef.current) return;
    joinedRef.current = true;

    const socket = getSocket();
    socket.emit("join_room", { code, username: name, create: isCreating });

    socket.on("room_history", (history: Post[]) => {
      setPosts(history);
      history.forEach((p) => highlight(p, theme));
      scrollToBottom();
      setRoomReady(true);
    });

    socket.on("room_not_found", () => {
      setRoomNotFound(true);
      setRoomReady(true);
    });

    socket.on("receive_snippet", (post: Post) => {
      addPost(post);
      highlight(post, theme);
      scrollToBottom();
    });

    socket.on("room_user_count", (count: number) => {
      setUserCount(count);
    });

    socket.on("room_users", (users: string[]) => {
      setOnlineUsers(users);
    });

    socket.on("user_joined", ({ username: who }: { username: string }) => {
      addToast(`${who} joined`, "join");
    });

    socket.on("user_left", ({ username: who }: { username: string }) => {
      addToast(`${who} left`, "leave");
    });
  }

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("codeshare_username");
    if (saved) {
      joinRoom(saved);
    } else {
      setShowModal(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      const socket = getSocket();
      socket.emit("leave_room");
      socket.off("room_history");
      socket.off("receive_snippet");
      socket.off("room_user_count");
      socket.off("room_users");
      socket.off("room_not_found");
      socket.off("user_joined");
      socket.off("user_left");
    };
  }, []);

  // Re-highlight when theme changes
  useEffect(() => {
    posts.forEach((p) => highlight(p, theme));
  }, [theme, posts, highlight]);

  function handleSend(content: string, type: "code" | "text", language: Language | null) {
    const socket = getSocket();
    socket.emit("post_snippet", { code, content, language, type, username });
  }

  // Get highlight for current theme
  function getHtml(postId: string) {
    return highlightCache[`${postId}__${theme}`] ?? null;
  }

  return (
    <>
      {mounted && showModal && <UsernameModal roomCode={code} onConfirm={joinRoom} />}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: roomReady || !showModal ? 1 : 0, y: roomReady || !showModal ? 0 : 10 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="flex flex-col h-screen"
        style={{ background: "#0a0a0f" }}
      >
        <RoomHeader code={code} userCount={userCount} />

        {/* Feed */}
        <div
          ref={feedRef}
          className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-3"
        >
          <AnimatePresence mode="wait">
            {roomNotFound ? (
              /* Room not found error state */
              <motion.div
                key="not-found"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center h-full text-center px-4"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: "#1e1e2e" }}
                >
                  <span className="text-2xl">🚪</span>
                </div>
                <h2 className="text-white font-semibold text-xl mb-2">Room not found</h2>
                <p className="text-slate-400 text-sm max-w-xs leading-relaxed mb-6">
                  This room is empty or no longer exists. Rooms vanish when everyone leaves.
                </p>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={createNewRoom}
                  className="px-6 py-3 rounded-xl font-semibold text-white text-sm"
                  style={{ background: "#6366f1" }}
                >
                  Create a new room
                </motion.button>
              </motion.div>
            ) : roomReady && posts.length === 0 && !showModal ? (
              /* Empty room — only shown once server confirmed room is valid */
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col items-center justify-center h-full text-center"
              >
                <p className="text-slate-400 text-lg mb-2">Room is empty</p>
                <p className="text-slate-500 text-sm">
                  Share the code{" "}
                  <span className="font-mono text-indigo-400">{code}</span> and start posting.
                </p>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              highlightedHtml={getHtml(post.id)}
            />
          ))}
        </div>

        {!roomNotFound && <InputPanel onSend={handleSend} />}
      </motion.div>

      <Toast toasts={toasts} onRemove={removeToast} />
    </>
  );
}
