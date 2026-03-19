import { create } from "zustand";
import { Post } from "@/types";

interface RoomStore {
  posts: Post[];
  userCount: number;
  username: string;
  setPosts: (posts: Post[]) => void;
  addPost: (post: Post) => void;
  setUserCount: (count: number) => void;
  setUsername: (name: string) => void;
}

export const useRoomStore = create<RoomStore>((set) => ({
  posts: [],
  userCount: 0,
  username: "",
  setPosts: (posts) => set({ posts }),
  addPost: (post) => set((state) => ({ posts: [...state.posts, post] })),
  setUserCount: (userCount) => set({ userCount }),
  setUsername: (username) => set({ username }),
}));
