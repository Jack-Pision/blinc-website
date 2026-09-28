import type { Metadata } from "next";
import { DM_Sans, DM_Mono } from "next/font/google";
import { ClientLayout } from "@/components/ClientLayout";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "BLINC — Modern Wardrobe 2026",
  description: "An independent modern luxury fashion atelier. 12 architectural silhouettes engineered for 2026 across female and male forms.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${dmMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#FAF9F5] text-[#141413] selection:bg-[#141413] selection:text-[#FAF9F5]">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
