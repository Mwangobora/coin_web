import type { ReactNode } from "react";

export function PageContainer({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto min-h-dvh w-full max-w-xl px-4 py-4 sm:py-8">
      {children}
    </main>
  );
}
