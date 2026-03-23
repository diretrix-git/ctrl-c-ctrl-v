import { create } from "zustand";
import { Post } from "@/types";

export type ShikiTheme = "vitesse-dark" | "github-dark" | "dracula" | "nord" | "one-dark-pro";

export const THEMES: { value: ShikiTheme; label: string }[] = [
  { value: "vitesse-dark", label: "Vitesse" },
  { value: "github-dark", label: "GitHub" },
  { value: "dracula", label: "Dracula" },
  { value: "nord", label: "Nord" },
  { value: "one-dark-pro", label: "One Dark" },
];

interface RoomStore {
  posts: Post[];
  userCount: number;
  username: string;
  theme: ShikiTheme;
  compactMode: boolean;
  onlineUsers: string[];
  setPosts: (posts: Post[]) => void;
  addPost: (post: Post) => void;
  setUserCount: (count: number) => void;
  setUsername: (name: string) => void;
  setTheme: (theme: ShikiTheme) => void;
  setCompactMode: (compact: boolean) => void;
  setOnlineUsers: (users: string[]) => void;
}

export const useRoomStore = create<RoomStore>((set) => ({
  posts: [],
  userCount: 0,
  username: "",
  theme: "vitesse-dark",
  compactMode: false,
  onlineUsers: [],
  setPosts: (posts) => set({ posts }),
  addPost: (post) => set((state) => ({ posts: [...state.posts, post] })),
  setUserCount: (userCount) => set({ userCount }),
  setUsername: (username) => set({ username }),
  setTheme: (theme) => set({ theme }),
  setCompactMode: (compactMode) => set({ compactMode }),
  setOnlineUsers: (onlineUsers) => set({ onlineUsers }),
}));
