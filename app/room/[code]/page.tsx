"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { codeToHtml } from "shiki";
import { getSocket } from "@/lib/socket";
import { useRoomStore } from "@/lib/store";
import { Post, Language } from "@/types";
import RoomHeader from "@/components/RoomHeader";
import PostCard from "@/components/PostCard";
import InputPanel from "@/components/InputPanel";

// Generate a random guest username
function guestName() {
  const adj = ["Swift", "Quiet", "Bold", "Sharp", "Calm", "Bright"];
  const noun = ["Fox", "Owl", "Dev", "Coder", "Hawk", "Wolf"];
  return (
    adj[Math.floor(Math.random() * adj.length)] +
    noun[Math.floor(Math.random() * noun.length)] +
    Math.floor(Math.random() * 90 + 10)
  );
}

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const code = (params.code as string).toUpperCase();

  const { posts, userCount, username, setPosts, addPost, setUserCount, setUsername } =
    useRoomStore();

  const [highlightCache, setHighlightCache] = useState<Record<string, string>>({});
  const feedRef = useRef<HTMLDivElement>(null);
  const joinedRef = useRef(false);

  // Highlight a post and cache it
  const highlight = useCallback(
    async (post: Post) => {
      if (post.type !== "code" || !post.language || highlightCache[post.id]) return;
      try {
        const html = await codeToHtml(post.content, {
          lang: post.language,
          theme: "vitesse-dark",
        });
        setHighlightCache((prev) => ({ ...prev, [post.id]: html }));
      } catch {
        // fallback: leave as plain text
      }
    },
    [highlightCache]
  );

  // Scroll feed to bottom
  function scrollToBottom() {
    setTimeout(() => {
      if (feedRef.current) {
        feedRef.current.scrollTop = feedRef.current.scrollHeight;
      }
    }, 50);
  }

  useEffect(() => {
    if (joinedRef.current) return;
    joinedRef.current = true;

    const name = guestName();
    setUsername(name);

    const socket = getSocket();

    socket.emit("join_room", { code, username: name });

    socket.on("room_history", (history: Post[]) => {
      setPosts(history);
      history.forEach(highlight);
      scrollToBottom();
    });

    socket.on("receive_snippet", (post: Post) => {
      addPost(post);
      highlight(post);
      scrollToBottom();
    });

    socket.on("room_user_count", (count: number) => {
      setUserCount(count);
    });

    return () => {
      socket.emit("leave_room");
      socket.off("room_history");
      socket.off("receive_snippet");
      socket.off("room_user_count");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  // Highlight newly added posts
  useEffect(() => {
    posts.forEach((p) => {
      if (p.type === "code" && p.language && !highlightCache[p.id]) {
        highlight(p);
      }
    });
  }, [posts, highlight, highlightCache]);

  function handleSend(content: string, type: "code" | "text", language: Language | null) {
    const socket = getSocket();
    socket.emit("post_snippet", {
      code,
      content,
      language,
      type,
      username,
    });
  }

  return (
    <div className="flex flex-col h-screen" style={{ background: "#0a0a0f" }}>
      <RoomHeader code={code} userCount={userCount} />

      {/* Feed */}
      <div
        ref={feedRef}
        className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-3"
      >
        {posts.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-slate-500 text-lg mb-2">Room is empty</p>
            <p className="text-slate-600 text-sm">
              Share the code <span className="font-mono text-indigo-500">{code}</span> and start posting.
            </p>
          </div>
        )}

        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            highlightedHtml={highlightCache[post.id] ?? null}
          />
        ))}
      </div>

      <InputPanel onSend={handleSend} />
    </div>
  );
}
