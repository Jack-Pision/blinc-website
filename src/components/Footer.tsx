import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[#e5e5ea] bg-[#fbfbfd] text-xs text-[#86868b]">
      {/* Brand & Site Navigation */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
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

      {/* Signature Watermark Bar */}
      <div className="border-t border-[#1a191a] bg-black text-white py-6 px-4">
        <div className="max-w-6xl mx-auto flex flex-col items-center justify-center space-y-2.5 text-center">
          <p className="text-xs text-[#7293a9] font-normal tracking-wide">
            Designed &amp; built by{" "}
            <span className="font-semibold text-white">Jack Pision</span>
          </p>
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/Jack-Pision"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#a09da9] hover:text-white transition-colors p-1"
              aria-label="GitHub: Jack-Pision"
              title="GitHub: Jack-Pision"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
            </a>
            <a
              href="https://x.com/Jack_pision"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#a09da9] hover:text-white transition-colors p-1"
              aria-label="X: Jack_pision"
              title="X: Jack_pision"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
