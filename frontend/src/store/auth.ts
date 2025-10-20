"use client";

import { create } from "zustand";

import { apiFetch } from "@/lib/api-client";
import { UserProfile } from "@/types/user";

type AuthResponse = {
  token: string;
  user: UserProfile;
};

type AuthState = {
  user: UserProfile | null;
  token: string | null;
  initialized: boolean;
  hydrate: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    fullName: string,
    gradeLevel?: string
  ) => Promise<void>;
  logout: () => void;
};

const TOKEN_KEY = "essay-tutor-token";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  initialized: false,
  hydrate: () => {
    if (typeof window === "undefined") return;
    const storedToken = localStorage.getItem(TOKEN_KEY);
    if (!storedToken) {
      set({ initialized: true });
      return;
    }

    apiFetch<{ user: UserProfile }>("/auth/me", { auth: true })
      .then((data) => {
        set({ token: storedToken, user: data.user, initialized: true });
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        set({ token: null, user: null, initialized: true });
      });
  },
  login: async (email, password) => {
    const data = await apiFetch<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    localStorage.setItem(TOKEN_KEY, data.token);
    set({ user: data.user, token: data.token, initialized: true });
  },
  register: async (email, password, fullName, gradeLevel) => {
    const data = await apiFetch<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, fullName, gradeLevel }),
    });

    localStorage.setItem(TOKEN_KEY, data.token);
    set({ user: data.user, token: data.token, initialized: true });
  },
  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
    }
    set({ user: null, token: null, initialized: true });
  },
}));
