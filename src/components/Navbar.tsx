"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Currency } from "@/types";
import { ShoppingBag, Menu, X, Globe } from "lucide-react";

export function Navbar() {
  const { totalItems, openCart, currency, setCurrency } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const pathname = usePathname();

  const currencies: Currency[] = ["USD", "EUR", "GBP", "JPY"];

  return (
    <header className="sticky top-0 z-40 bg-[#FBFBFA]/90 backdrop-blur-md border-b border-neutral-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Left Navigation */}
        <nav className="hidden md:flex items-center space-x-8 text-xs font-mono tracking-widest uppercase text-neutral-600">
          <Link
            href="/"
            className={`hover:text-black transition-colors ${
              pathname === "/" ? "text-black font-semibold" : ""
            }`}
          >
            Home
          </Link>
          <Link
            href="/shop"
            className={`hover:text-black transition-colors ${
              pathname === "/shop" ? "text-black font-semibold" : ""
            }`}
          >
            Catalog
          </Link>
          <Link
            href="/#lookbook"
            className="hover:text-black transition-colors"
          >
            Lookbook
          </Link>
          <Link
            href="/#about"
            className="hover:text-black transition-colors"
          >
            Philosophy
          </Link>
        </nav>

        {/* Center Brand Identity */}
        <div className="flex flex-col items-center justify-center">
          <Link href="/" className="group flex flex-col items-center">
            <span className="font-display text-2xl sm:text-3xl font-bold tracking-[0.28em] text-neutral-950 group-hover:opacity-80 transition-opacity">
              B L I N C
            </span>
            <div className="w-6 h-[2px] bg-neutral-900 mt-0.5 group-hover:w-12 transition-all duration-300" />
            <span className="text-[9px] font-mono tracking-[0.25em] text-neutral-400 uppercase mt-0.5">
              CONCEPT 2026
            </span>
          </Link>
        </div>

        {/* Right Navigation & Utilities */}
        <div className="flex items-center space-x-4 sm:space-x-6">
          {/* Currency Switcher */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
              className="flex items-center space-x-1.5 text-xs font-mono text-neutral-600 hover:text-black transition-colors py-1 px-2 border border-neutral-200 rounded-sm"
              aria-label="Change currency"
            >
              <Globe className="w-3 h-3 text-neutral-500" />
              <span>{currency}</span>
            </button>

            {currencyDropdownOpen && (
              <div className="absolute right-0 mt-2 w-24 bg-white border border-neutral-200 shadow-lg py-1 z-50 rounded-sm">
                {currencies.map((curr) => (
                  <button
                    key={curr}
                    onClick={() => {
                      setCurrency(curr);
                      setCurrencyDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-mono transition-colors ${
                      currency === curr
                        ? "bg-neutral-900 text-white font-semibold"
                        : "text-neutral-700 hover:bg-neutral-100"
                    }`}
                  >
                    {curr}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Shop Link */}
          <Link
            href="/shop"
            className="hidden sm:inline-block text-xs font-mono tracking-widest uppercase text-neutral-600 hover:text-black transition-colors"
          >
            Shop All (12)
          </Link>

          {/* Cart Trigger */}
          <button
            onClick={openCart}
            className="relative flex items-center space-x-2 text-xs font-mono tracking-wider uppercase bg-neutral-900 text-white px-3.5 py-2 hover:bg-neutral-800 transition-colors"
            aria-label={`Open shopping bag, ${totalItems} items`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="font-semibold">Bag ({totalItems})</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-neutral-800 hover:text-black"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-neutral-200 px-6 py-8 space-y-6">
          <nav className="flex flex-col space-y-4 text-sm font-mono tracking-widest uppercase">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-neutral-900 font-semibold"
            >
              Home / Lookbook
            </Link>
            <Link
              href="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="text-neutral-600 hover:text-neutral-900"
            >
              Full Catalog (12 Outfits)
            </Link>
            <Link
              href="/#lookbook"
              onClick={() => setMobileMenuOpen(false)}
              className="text-neutral-600 hover:text-neutral-900"
            >
              2026 Editorial
            </Link>
            <Link
              href="/#about"
              onClick={() => setMobileMenuOpen(false)}
              className="text-neutral-600 hover:text-neutral-900"
            >
              Design Philosophy
            </Link>
          </nav>

          <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
            <span className="text-xs font-mono text-neutral-500 uppercase">Currency:</span>
            <div className="flex space-x-2">
              {currencies.map((curr) => (
                <button
                  key={curr}
                  onClick={() => {
                    setCurrency(curr);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-2 py-1 text-xs font-mono border ${
                    currency === curr
                      ? "bg-neutral-900 text-white border-neutral-900"
                      : "bg-white text-neutral-700 border-neutral-200"
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
