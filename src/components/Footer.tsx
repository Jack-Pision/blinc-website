"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BrutalistAsterisk } from "./BrutalistAsterisk";
import { ArrowRight, Check } from "lucide-react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail("");
      setSubscribed(false);
    }, 4000);
  };

  return (
    <footer className="bg-[#FBFBFA] border-t border-neutral-300 pt-16 pb-12 overflow-hidden">
      {/* Pre-Footer Monumental Marquee ("BEYOND BOUNDARIES") matching screenshot */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="flex justify-between items-center text-[10px] font-mono tracking-[0.3em] uppercase text-neutral-400 mb-2 border-b border-neutral-200 pb-2">
          <span>GLOBAL VISION</span>
          <span className="flex items-center space-x-2">
            <BrutalistAsterisk size={14} className="text-neutral-500" />
            <span>RESPONSIBLE LUXURY</span>
          </span>
        </div>

        <div className="w-full text-center py-6 sm:py-10">
          <h2 className="font-display font-black text-4xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight uppercase text-neutral-950 select-none">
            BEYOND BOUNDARIES
          </h2>
        </div>
      </div>

      {/* Main Footer Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-neutral-200">
          {/* Brand Info & Newsletter */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex flex-col items-start">
              <span className="font-display text-2xl font-bold tracking-[0.3em] text-neutral-950">
                B L I N C
              </span>
              <span className="text-[10px] font-mono tracking-[0.3em] text-neutral-400 uppercase mt-1">
                CONCEPT WARDROBE 2026
              </span>
            </div>

            <p className="text-xs font-sans text-neutral-600 max-w-sm leading-relaxed">
              Blinc engineers high-standard contemporary silhouettes for 2026. A synthesis of tactile brutalism, structural tailoring, and sustainable Italian wool.
            </p>

            {/* Newsletter input */}
            <form onSubmit={handleSubmit} className="space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 block">
                Receive the 2026 Lookbook Gazette
              </span>
              <div className="flex max-w-sm">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="atelier@domain.com"
                  required
                  className="flex-1 bg-white border border-neutral-300 px-3.5 py-2 text-xs font-mono text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-black rounded-none"
                />
                <button
                  type="submit"
                  className="bg-neutral-900 hover:bg-black text-white px-4 py-2 text-xs font-mono uppercase tracking-wider transition-colors flex items-center space-x-1"
                >
                  {subscribed ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <>
                      <span>Join</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
              {subscribed && (
                <p className="text-[10px] font-mono text-emerald-600">
                  Invitation confirmed. Edition release notes dispatched.
                </p>
              )}
            </form>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs font-mono">
            {/* Information */}
            <div className="space-y-4">
              <h4 className="font-bold tracking-widest uppercase text-neutral-900">
                Information
              </h4>
              <ul className="space-y-2.5 text-neutral-600 uppercase tracking-wider text-[11px]">
                <li>
                  <Link href="/#about" className="hover:text-black transition-colors">
                    Philosophy
                  </Link>
                </li>
                <li>
                  <Link href="/shop" className="hover:text-black transition-colors">
                    The 12 Pieces
                  </Link>
                </li>
                <li>
                  <Link href="/#lookbook" className="hover:text-black transition-colors">
                    Lookbook 2026
                  </Link>
                </li>
                <li>
                  <span className="text-neutral-400 cursor-not-allowed">
                    Press Archive
                  </span>
                </li>
              </ul>
            </div>

            {/* Shopping */}
            <div className="space-y-4">
              <h4 className="font-bold tracking-widest uppercase text-neutral-900">
                Client Care
              </h4>
              <ul className="space-y-2.5 text-neutral-600 uppercase tracking-wider text-[11px]">
                <li>
                  <span className="hover:text-black cursor-pointer transition-colors">
                    Global Shipping
                  </span>
                </li>
                <li>
                  <span className="hover:text-black cursor-pointer transition-colors">
                    Sizing Matrix
                  </span>
                </li>
                <li>
                  <span className="hover:text-black cursor-pointer transition-colors">
                    Garment Care
                  </span>
                </li>
                <li>
                  <span className="hover:text-black cursor-pointer transition-colors">
                    Legacy Warranty
                  </span>
                </li>
              </ul>
            </div>

            {/* Connect */}
            <div className="space-y-4 col-span-2 sm:col-span-1">
              <h4 className="font-bold tracking-widest uppercase text-neutral-900">
                Ateliers
              </h4>
              <ul className="space-y-2.5 text-neutral-600 uppercase tracking-wider text-[11px]">
                <li>
                  <span className="hover:text-black cursor-pointer transition-colors">
                    Paris Studio
                  </span>
                </li>
                <li>
                  <span className="hover:text-black cursor-pointer transition-colors">
                    Milan Milled
                  </span>
                </li>
                <li>
                  <span className="hover:text-black cursor-pointer transition-colors">
                    Tokyo Showroom
                  </span>
                </li>
                <li>
                  <span className="hover:text-black cursor-pointer transition-colors">
                    Instagram 2026
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono text-neutral-500 uppercase tracking-wider space-y-4 sm:space-y-0">
          <div>
            © 2026 BLINC CONCEPT WARDROBE. ALL RIGHTS RESERVED.
          </div>
          <div className="flex space-x-6">
            <span className="hover:text-black cursor-pointer">PRIVACY POLICY</span>
            <span className="hover:text-black cursor-pointer">TERMS OF USE</span>
            <span className="hover:text-black cursor-pointer">CARBON AUDIT</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
