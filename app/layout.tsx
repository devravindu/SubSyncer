import type { Metadata } from "next";
import { Orbitron, Space_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "@/styles/globals.css";
import { cn } from "@/lib/utils";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
});

export const metadata: Metadata = {
  title: "Subs Syncer",
  description: "Sync your subtitles in seconds",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn(
          "min-h-screen bg-background font-mono text-foreground antialiased",
          orbitron.variable,
          spaceMono.variable
        )}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
