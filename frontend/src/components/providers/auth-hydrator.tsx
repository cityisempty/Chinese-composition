"use client";

import { useEffect } from "react";

import { useAuthStore } from "@/store/auth";

export const AuthHydrator = () => {
  const hydrate = useAuthStore((state) => state.hydrate);
  const initialized = useAuthStore((state) => state.initialized);

  useEffect(() => {
    if (!initialized) {
      hydrate();
    }
  }, [hydrate, initialized]);

  return null;
};
