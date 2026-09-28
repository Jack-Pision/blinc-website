"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Currency } from "@/types";
import { ShoppingBag, Menu, X, ChevronDown } from "lucide-react";

export function Navbar() {
  const { totalItems, openCart, currency, setCurrency } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const pathname = usePathname();

  const currencies: Currency[] = ["USD", "EUR", "GBP", "JPY"];

  return (
    <header className="sticky top-0 z-40 bg-[#fbfbfd]/85 backdrop-blur-md border-b border-[#e5e5ea] transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center space-x-8">
          <Link href="/" className="font-semibold text-lg tracking-tight text-[#1d1d1f] hover:opacity-80 transition-opacity">
            Blinc
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 text-xs text-[#515154]">
            <Link
              href="/"
              className={`hover:text-[#1d1d1f] transition-colors ${
                pathname === "/" ? "text-[#1d1d1f] font-medium" : ""
              }`}
            >
              Overview
            </Link>
            <Link
              href="/shop"
              className={`hover:text-[#1d1d1f] transition-colors ${
                pathname === "/shop" ? "text-[#1d1d1f] font-medium" : ""
              }`}
            >
              Collection (12)
            </Link>
            <Link
              href="/materials"
              className={`hover:text-[#1d1d1f] transition-colors ${
                pathname === "/materials" ? "text-[#1d1d1f] font-medium" : ""
              }`}
            >
              Materials
            </Link>
            <Link
              href="/philosophy"
              className={`hover:text-[#1d1d1f] transition-colors ${
                pathname === "/philosophy" ? "text-[#1d1d1f] font-medium" : ""
              }`}
            >
              Philosophy
            </Link>
          </nav>
        </div>

        {/* Right Utilities */}
        <div className="flex items-center space-x-3">
          {/* Currency Switcher */}
          <div className="relative">
            <button
              onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
              className="flex items-center space-x-1 text-xs text-[#515154] hover:text-[#1d1d1f] transition-colors py-1 px-2 rounded-md hover:bg-[#f5f5f7]"
              aria-label="Change currency"
            >
              <span>{currency}</span>
              <ChevronDown className="w-3 h-3 text-[#86868b]" />
            </button>

            {currencyDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-24 bg-white border border-[#e5e5ea] shadow-md rounded-xl py-1 z-50">
                {currencies.map((curr) => (
                  <button
                    key={curr}
                    onClick={() => {
                      setCurrency(curr);
                      setCurrencyDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${
                      currency === curr
                        ? "bg-[#f5f5f7] text-[#1d1d1f] font-medium"
                        : "text-[#515154] hover:bg-[#fbfbfd]"
                    }`}
                  >
                    {curr}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cart Trigger Pill */}
          <button
            onClick={openCart}
            className="flex items-center space-x-1.5 bg-[#1d1d1f] hover:bg-black text-white text-xs font-medium px-3.5 py-1.5 rounded-full transition-colors"
            aria-label={`Open bag, ${totalItems} items`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Bag</span>
            <span className="bg-white/20 text-white rounded-full px-1.5 py-0.2 text-[10px] min-w-[18px] text-center">
              {totalItems}
            </span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-[#515154] hover:text-[#1d1d1f]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#fbfbfd] border-b border-[#e5e5ea] px-6 py-6 space-y-4">
          <nav className="flex flex-col space-y-3 text-sm">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#1d1d1f] font-medium"
            >
              Overview
            </Link>
            <Link
              href="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#515154] hover:text-[#1d1d1f]"
            >
              Collection (12 Outfits)
            </Link>
            <Link
              href="/materials"
              onClick={() => setMobileMenuOpen(false)}
              className={`transition-colors ${
                pathname === "/materials" ? "text-[#1d1d1f] font-medium" : "text-[#515154] hover:text-[#1d1d1f]"
              }`}
            >
              Materials
            </Link>
            <Link
              href="/philosophy"
              onClick={() => setMobileMenuOpen(false)}
              className={`transition-colors ${
                pathname === "/philosophy" ? "text-[#1d1d1f] font-medium" : "text-[#515154] hover:text-[#1d1d1f]"
              }`}
            >
              Philosophy
            </Link>
          </nav>

          <div className="pt-3 border-t border-[#e5e5ea] flex items-center justify-between">
            <span className="text-xs text-[#86868b]">Currency:</span>
            <div className="flex space-x-1.5">
              {currencies.map((curr) => (
                <button
                  key={curr}
                  onClick={() => {
                    setCurrency(curr);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-2 py-1 text-xs rounded-md ${
                    currency === curr
                      ? "bg-[#1d1d1f] text-white"
                      : "bg-[#f5f5f7] text-[#515154]"
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
