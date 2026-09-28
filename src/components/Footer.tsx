import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[#e5e5ea] py-10 bg-[#fbfbfd] text-xs text-[#86868b]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <span className="font-medium text-sm text-[#1d1d1f] tracking-tight">Blinc</span>
          <span className="text-[#d2d2d7]">·</span>
          <span>Modern Outfits 2026</span>
        </div>

        <nav className="flex items-center space-x-6 text-xs text-[#515154]">
          <Link href="/" className="hover:text-[#1d1d1f] transition-colors">
            Overview
          </Link>
          <Link href="/shop" className="hover:text-[#1d1d1f] transition-colors">
            Collection (12)
          </Link>
          <Link href="/materials" className="hover:text-[#1d1d1f] transition-colors">
            Materials
          </Link>
          <Link href="/philosophy" className="hover:text-[#1d1d1f] transition-colors">
            Philosophy
          </Link>
        </nav>

        <p className="text-[11px] text-[#86868b]">
          © 2026 Blinc · Concept clothing store
        </p>
      </div>
    </footer>
  );
}
