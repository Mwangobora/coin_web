import type { ReactNode } from "react";

export function PageContainer({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto min-h-dvh w-full max-w-xl overflow-x-hidden px-3 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-[calc(0.75rem+env(safe-area-inset-top))] min-[360px]:px-4 sm:max-w-2xl sm:py-8 lg:max-w-4xl lg:px-8">
      {children}
    </main>
  );
}
