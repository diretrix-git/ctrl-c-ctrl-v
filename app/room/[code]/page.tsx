"use client";

import { useEffect, useRef, useState, useCallback, use } from "react";
import { codeToHtml } from "shiki";
import { getSocket } from "@/lib/socket";
import { useRoomStore } from "@/lib/store";
import { Post, Language } from "@/types";
import RoomHeader from "@/components/RoomHeader";
import PostCard from "@/components/PostCard";
import InputPanel from "@/components/InputPanel";
import UsernameModal from "@/components/UsernameModal";
import Toast, { ToastMessage } from "@/components/Toast";

export default function RoomPage({ params }: { params: Promise<{ code: string }> }) {
  const resolvedParams = use(params);
  const code = resolvedParams.code.toUpperCase();

  const { posts, userCount, username, theme, setPosts, addPost, setUserCount, setUsername, setOnlineUsers } =
    useRoomStore();

  const [highlightCache, setHighlightCache] = useState<Record<string, string>>({});
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const feedRef = useRef<HTMLDivElement>(null);
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
    socket.emit("join_room", { code, username: name });

    socket.on("room_history", (history: Post[]) => {
      setPosts(history);
      history.forEach((p) => highlight(p, theme));
      scrollToBottom();
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

      <div className="flex flex-col h-screen" style={{ background: "#0a0a0f" }}>
        <RoomHeader code={code} userCount={userCount} />

        {/* Feed */}
        <div
          ref={feedRef}
          className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-3"
        >
          {posts.length === 0 && !showModal && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-slate-500 text-lg mb-2">Room is empty</p>
              <p className="text-slate-600 text-sm">
                Share the code{" "}
                <span className="font-mono text-indigo-500">{code}</span> and start posting.
              </p>
            </div>
          )}

          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              highlightedHtml={getHtml(post.id)}
            />
          ))}
        </div>

        <InputPanel onSend={handleSend} />
      </div>

      <Toast toasts={toasts} onRemove={removeToast} />
    </>
  );
}
