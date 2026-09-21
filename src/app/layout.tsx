import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { MarketProvider } from "@/context/MarketContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RIL Intelligence OS — Petchem SCADA, Economics & Optimization",
  description:
    "Executive-grade institutional intelligence operating system for Reliance Industries Limited (O2C / Petrochemicals & Cracker Business).",
  icons: {
    icon: "/images/reliance-logo.png",
    apple: "/images/reliance-logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <meta name="color-scheme" content="light dark" />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--bg-canvas)] text-[var(--text-primary)] antialiased transition-colors duration-200">
        <ThemeProvider>
          <MarketProvider>
            {children}
          </MarketProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
