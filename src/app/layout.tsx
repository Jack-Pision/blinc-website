import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { ClientLayout } from "@/components/ClientLayout";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://blinc.luxury"),
  title: "Blinc — Modern Outfits 2026",
  description: "Simple, timeless clothing engineered for modern living. Curated 12-piece wardrobe for women and men.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-[#fbfbfd] text-[#1d1d1f] selection:bg-[#0071e3] selection:text-white">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
