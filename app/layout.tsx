import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import { MotionProvider } from "@/components/motion-provider";

import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  applicationName: "The Roundtable",
  title: {
    default: "The Roundtable — Better decisions",
    template: "%s | The Roundtable",
  },
  description: "One question. Multiple AI experts. Better decisions.",
  manifest: "/manifest.webmanifest",
  keywords: ["AI decision making", "AI experts", "expert debate", "The Roundtable", "decision intelligence"],
  openGraph: {
    type: "website",
    siteName: "The Roundtable",
    title: "The Roundtable — Better decisions",
    description: "Bring your toughest questions to The Roundtable. Multiple AI experts debate before you decide.",
  },
  twitter: {
    card: "summary",
    title: "The Roundtable — Better decisions",
    description: "One question. Multiple AI experts. Better decisions.",
  },
  robots: { index: true, follow: true },
  category: "productivity",
};

export const viewport: Viewport = { themeColor: "#07090f", colorScheme: "dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} bg-ink font-sans antialiased`}><MotionProvider>{children}</MotionProvider></body>
    </html>
  );
}
