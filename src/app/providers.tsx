"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { MotionConfig } from "motion/react";
import { type ReactNode, useState } from "react";

import { Toaster } from "@/components/ui/toaster";
import { createQueryClient } from "@/lib/query/query-client";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => createQueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <MotionConfig reducedMotion="user">
        {children}
        <Toaster />
      </MotionConfig>
    </QueryClientProvider>
  );
}
