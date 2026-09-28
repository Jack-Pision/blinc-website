import type { Metadata } from "next";
import { Geist, Geist_Mono, Syne } from "next/font/google";
import { ClientLayout } from "@/components/ClientLayout";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["500", "700", "800"],
});

export const metadata: Metadata = {
  title: "BLINC — Concept Wardrobe 2026 | Modern Outfits",
  description: "High-standard modern luxury fashion concept store. 2026 male and female architectural silhouettes, tailoring, and knitwear.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${syne.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#FBFBFA] text-[#121212]">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
