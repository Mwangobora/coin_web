"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

import { Toaster } from "@/components/ui/toaster";
import { QueryProvider } from "@/providers/query-provider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <MotionConfig reducedMotion="user">
        {children}
        <Toaster />
      </MotionConfig>
    </QueryProvider>
  );
}
