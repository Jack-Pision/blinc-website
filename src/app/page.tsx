"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PRODUCTS } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { CapsuleMixer } from "@/components/CapsuleMixer";

type GenderFilter = "all" | "female" | "male" | "unisex";

export default function HomePage() {
  const [activeGender, setActiveGender] = useState<GenderFilter>("all");

  const filteredProducts =
    activeGender === "all"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.gender === activeGender);

  return (
    <div className="w-full bg-[#fbfbfd]">
      {/* 1. HERO SECTION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-16">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 text-xs font-medium text-[#86868b] bg-[#f5f5f7] px-3 py-1 rounded-full border border-[#e5e5ea]">
            <span>Concept Wardrobe 2026</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-[#1d1d1f] leading-[1.08]">
            Twelve pieces.
            <br />
            Built for modern life.
          </h1>

          <p className="text-base sm:text-lg text-[#86868b] leading-relaxed pt-1">
            An intentional capsule collection exploring form, movement, and enduring textiles.
          </p>

          <div className="pt-4 flex items-center justify-center gap-3">
            <Link
              href="/shop"
              className="bg-[#1d1d1f] hover:bg-black text-white text-sm font-medium px-6 py-2.5 rounded-full transition-colors inline-flex items-center"
            >
              Explore collection
            </Link>
            <Link
              href="/philosophy"
              className="bg-[#f5f5f7] hover:bg-[#e5e5ea] text-[#1d1d1f] text-sm font-medium px-6 py-2.5 rounded-full transition-colors"
            >
              Philosophy
            </Link>
          </div>
        </div>

        {/* Hero Visual Banner */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-[#f5f5f7]">
            <Image
              src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85"
              alt="Blinc Tailored Silhouette 2026"
              fill
              priority
              className="object-cover object-top"
            />
          </div>
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-[#f5f5f7]">
            <Image
              src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=85"
              alt="Blinc Knitwear Silhouette 2026"
              fill
              priority
              className="object-cover object-top"
            />
          </div>
        </div>
      </section>

      {/* 2. COLLECTION SECTION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 border-t border-[#e5e5ea]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">
              The 2026 Capsule
            </h2>
            <p className="text-xs text-[#86868b] mt-0.5">
              Showing {filteredProducts.length} of {PRODUCTS.length} curated garments.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="inline-flex p-1 bg-[#f5f5f7] rounded-full border border-[#e5e5ea] self-start sm:self-auto">
            {(
              [
                { label: "All (12)", value: "all" },
                { label: "Women", value: "female" },
                { label: "Men", value: "male" },
                { label: "Unisex", value: "unisex" },
              ] as const
            ).map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveGender(filter.value)}
                className={`px-3.5 py-1 text-xs font-medium rounded-full transition-all ${
                  activeGender === filter.value
                    ? "bg-white text-[#1d1d1f] shadow-xs"
                    : "text-[#86868b] hover:text-[#1d1d1f]"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4-Column Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/shop"
            className="inline-flex items-center text-xs font-medium text-[#1d1d1f] hover:text-[#0071e3] transition-colors"
          >
            Open catalog with filters and technical specs →
          </Link>
        </div>
      </section>

      {/* 3. CAPSULE MIXER & SILHOUETTE LAB */}
      <section id="capsule-mixer" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 border-t border-[#e5e5ea]">
        <CapsuleMixer />
      </section>
    </div>
  );
}
