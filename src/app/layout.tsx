import "./globals.css";

import type { Metadata } from "next";

import { AppProviders } from "@/providers/app-providers";

export const metadata: Metadata = {
  title: "Charge Link",
  description: "Public QR charging for mobile phones.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
