"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

import { useAuthStore } from "@/store/auth";

interface ProtectedProps {
  children: ReactNode;
}

export const Protected = ({ children }: ProtectedProps) => {
  const router = useRouter();
  const { token, initialized } = useAuthStore((state) => ({
    token: state.token,
    initialized: state.initialized,
  }));

  useEffect(() => {
    if (initialized && !token) {
      router.replace("/login");
    }
  }, [initialized, token, router]);

  if (!initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-brand-50 to-white">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-300 border-t-brand-600" />
      </div>
    );
  }

  if (!token) {
    return null;
  }

  return <>{children}</>;
};
