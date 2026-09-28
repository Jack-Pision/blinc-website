"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PRODUCTS } from "@/data/products";
import { ProductCategory } from "@/types";
import { ProductCard } from "@/components/ProductCard";
import { BrutalistAsterisk } from "@/components/BrutalistAsterisk";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<ProductCategory>("all");
  const [currentCapsuleIndex, setCurrentCapsuleIndex] = useState(0);

  const categories: { label: string; value: ProductCategory }[] = [
    { label: "ALL", value: "all" },
    { label: "OUTERWEAR", value: "outerwear" },
    { label: "TAILORING", value: "tailoring" },
    { label: "KNITWEAR", value: "knitwear" },
    { label: "BOTTOMS", value: "bottoms" },
    { label: "TOPS", value: "tops" },
    { label: "DRESSES", value: "dresses" },
  ];

  const filteredProducts =
    activeCategory === "all"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeCategory);

  const primaryGridProducts = filteredProducts.slice(0, 4);
  const secondaryGridProducts = filteredProducts.slice(4, 12);
  const recommendationProducts = [
    PRODUCTS[0], // Wool blazer
    PRODUCTS[5], // Leather biker
    PRODUCTS[2], // Architectural trousers
    PRODUCTS[4], // Mohair cardigan
  ];

  const capsuleHighlights = [
    {
      title: "STRUCTURAL SILVER & LEATHER",
      subTitle: "ACCENTS 2026",
      items: [
        "ARCHITECTURAL BANGLE 01",
        "SCULPTED EARCUFF",
        "GEOMETRIC PIN",
        "NAPPA WAIST HARNESS",
        "FACETED SIGNET RING",
      ],
      description:
        "Engineered jewelry and accents that interact directly with modern garment seams. Handcrafted in Milan from solid 925 sterling silver and vegetable-tanned French calfskin.",
      imageLeft:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85",
      imageRight:
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85",
    },
    {
      title: "MONOCHROME MINERAL CAPSULE",
      subTitle: "EDITION 02",
      items: [
        "TITANIUM CHOKER",
        "CONCEALED CUFF PIN",
        "MODULAR KEYCHAIN 26",
        "BRUSHED BOLO TIE",
      ],
      description:
        "Minimalist hardware designed to punctuate deconstructed lapels and heavy gauge knitwear without visual noise.",
      imageLeft:
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85",
      imageRight:
        "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=85",
    },
  ];

  const activeCapsule = capsuleHighlights[currentCapsuleIndex];

  return (
    <div className="w-full bg-[#FBFBFA]">
      {/* 1. HERO SECTION: "OUR LATEST OFFERINGS" */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14 pb-16 sm:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text Block */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center space-x-2 text-[10px] font-mono tracking-[0.3em] uppercase text-neutral-400">
              <span>WINTER / SPRING</span>
              <span>·</span>
              <span>2026 COLLECTION</span>
            </div>

            <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl leading-[0.92] tracking-tight uppercase text-neutral-950">
              OUR LATEST
              <br />
              OFFERINGS
            </h1>

            <p className="text-xs sm:text-sm font-sans text-neutral-600 max-w-sm leading-relaxed">
              Discover our latest offerings, featuring our top-tier designs, sculptural tailoring, and premium sustainable materials crafted for the 2026 silhouette.
            </p>

            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-widest bg-neutral-950 text-white px-6 py-3.5 hover:bg-neutral-800 transition-colors"
              >
                <span>View Full 12-Piece Wardrobe</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Asymmetric Angled Collage matching the screenshot */}
          <div className="lg:col-span-7 relative flex items-center justify-center gap-4 sm:gap-6 pt-4 lg:pt-0">
            {/* Image 1: Angled polygon trapezoid crop */}
            <div className="relative w-1/2 aspect-[4/5] sm:aspect-[3/4] overflow-hidden bg-neutral-200 clip-trapezoid-1 shadow-lg transform -rotate-1 hover:rotate-0 transition-transform duration-500">
              <Image
                src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=85"
                alt="Blinc Tailored Jacket 2026"
                fill
                priority
                className="object-cover object-top filter grayscale contrast-110"
              />
            </div>

            {/* Image 2: Angled polygon trapezoid crop */}
            <div className="relative w-1/2 aspect-[4/5] sm:aspect-[3/4] overflow-hidden bg-neutral-200 clip-trapezoid-2 shadow-lg transform rotate-2 hover:rotate-0 transition-transform duration-500 mt-6 sm:mt-10">
              <Image
                src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=85"
                alt="Blinc Knitwear 2026"
                fill
                priority
                className="object-cover object-top filter grayscale contrast-110"
              />
            </div>

            {/* Brutalist Asterisk Floating Decor */}
            <div className="absolute -bottom-6 -right-2 z-20 text-neutral-900 hidden sm:block">
              <BrutalistAsterisk size={44} />
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATALOG SECTION: "OUR PRODUCT" */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 border-t border-neutral-200">
        {/* Title */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="font-display font-black text-2xl sm:text-4xl tracking-tight uppercase text-neutral-950">
            OUR PRODUCT
          </h2>
          <p className="text-[11px] font-mono tracking-widest text-neutral-400 uppercase mt-1">
            2026 CAPSULE ARCHITECTURE
          </p>
        </div>

        {/* Filter Pills matching reference */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar gap-2 mb-10 pb-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-4 py-1.5 text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap border ${
                activeCategory === cat.value
                  ? "bg-neutral-950 text-white border-neutral-950 font-bold"
                  : "bg-white text-neutral-600 border-neutral-300 hover:border-black hover:text-black"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 4-Column Product Grid */}
        <div className="relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {primaryGridProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Brutalist decorative glyph */}
          <div className="absolute -right-4 top-1/2 -translate-y-1/2 text-neutral-900 hidden xl:block">
            <BrutalistAsterisk size={32} />
          </div>
        </div>
      </section>

      {/* 3. EDITORIAL FEATURE BREAKOUT: "PERFECT MATCH" */}
      <section id="lookbook" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="bg-[#F3F3F0] border border-neutral-300/80 p-6 sm:p-10 lg:p-14 relative overflow-hidden">
          {/* Asterisk Accent */}
          <div className="absolute top-6 right-6 text-neutral-900">
            <BrutalistAsterisk size={36} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* Left Large Lifestyle Shot */}
            <div className="lg:col-span-6 relative aspect-[4/3] w-full overflow-hidden bg-neutral-300 border border-neutral-300 shadow-md">
              <Image
                src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=85"
                alt="Seated Cashmere Knitwear Look 2026"
                fill
                className="object-cover object-center filter grayscale contrast-105"
              />
              <div className="absolute bottom-3 left-3 bg-neutral-900/80 text-white text-[10px] font-mono px-2.5 py-1">
                LOOK 05 · MOHAIR CARDIGAN
              </div>
            </div>

            {/* Right Editorial Text & Live Metrics */}
            <div className="lg:col-span-6 space-y-6">
              <h2 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl leading-[0.9] tracking-tight uppercase text-neutral-950">
                PERFECT
                <br />
                MATCH
              </h2>

              <p className="text-xs sm:text-sm font-sans text-neutral-600 leading-relaxed max-w-md">
                Modern silhouettes engineered for fluid movement and understated confidence. Each piece adapts effortlessly to both structured formal environments and relaxed evening wear. Find the perfect wardrobe harmony designed for 2026.
              </p>

              {/* Data Metrics Counter Row matching screenshot */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-neutral-300">
                <div>
                  <span className="font-display font-black text-2xl sm:text-3xl text-neutral-950 block">
                    700+
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mt-0.5 block">
                    Collection
                  </span>
                </div>

                <div>
                  <span className="font-display font-black text-2xl sm:text-3xl text-neutral-950 block">
                    12
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mt-0.5 block">
                    Silhouettes
                  </span>
                </div>

                <div>
                  <span className="font-display font-black text-2xl sm:text-3xl text-neutral-950 block">
                    5+
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mt-0.5 block">
                    Ateliers
                  </span>
                </div>

                <div>
                  <span className="font-display font-black text-2xl sm:text-3xl text-neutral-950 block">
                    2026
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mt-0.5 block">
                    Edition
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECONDARY PRODUCT GRID (Next 8 Pieces) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {secondaryGridProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Minimalist Lookbook Pagination matching screenshot */}
        <div className="flex items-center justify-center space-x-3 mt-12 pt-6 text-xs font-mono text-neutral-500">
          <button className="p-1 hover:text-black transition-colors" aria-label="Previous page">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-2 font-bold text-black border-b border-black">1</span>
          <span className="px-2 hover:text-black cursor-pointer">2</span>
          <span className="px-2 hover:text-black cursor-pointer">3</span>
          <span className="px-2 hover:text-black cursor-pointer">4</span>
          <button className="p-1 hover:text-black transition-colors" aria-label="Next page">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 5. SPOTLIGHT SECTION: "BLINC ACCENTS" (matching "ALMINA JEWELRY") */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-neutral-200">
        <div className="relative">
          {/* Giant Overlapping Headline */}
          <div className="mb-6 sm:mb-10">
            <h2 className="font-display font-black text-4xl sm:text-7xl lg:text-8xl tracking-tight uppercase text-neutral-950 leading-none">
              BLINC
              <br />
              ACCENTS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left Angled Image */}
            <div className="md:col-span-4 relative aspect-[3/4] overflow-hidden bg-neutral-200 clip-trapezoid-1 shadow-md">
              <Image
                src={activeCapsule.imageLeft}
                alt="Blinc Accents Editorial Portrait"
                fill
                className="object-cover object-top filter grayscale contrast-115"
              />
            </div>

            {/* Center Content Column */}
            <div className="md:col-span-4 space-y-6 text-center md:text-left px-2 sm:px-4">
              <div className="space-y-1.5 text-xs font-mono text-neutral-800 uppercase tracking-widest">
                {activeCapsule.items.map((item, idx) => (
                  <p key={idx} className="hover:text-black cursor-pointer transition-colors">
                    {item}
                  </p>
                ))}
              </div>

              <div className="w-12 h-[1px] bg-neutral-300 mx-auto md:mx-0 my-4" />

              <p className="text-xs font-sans text-neutral-600 leading-relaxed">
                {activeCapsule.description}
              </p>

              <div>
                <Link
                  href="/shop?category=tailoring"
                  className="inline-block bg-neutral-950 hover:bg-black text-white text-xs font-mono uppercase tracking-widest px-6 py-3 transition-colors"
                >
                  See More
                </Link>
              </div>

              {/* Slider Arrows */}
              <div className="flex justify-center md:justify-start items-center space-x-4 pt-4 text-neutral-700">
                <button
                  onClick={() =>
                    setCurrentCapsuleIndex((prev) =>
                      prev === 0 ? capsuleHighlights.length - 1 : prev - 1
                    )
                  }
                  className="p-1 hover:text-black transition-colors"
                  aria-label="Previous capsule"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-xs font-mono">
                  0{currentCapsuleIndex + 1} / 0{capsuleHighlights.length}
                </span>
                <button
                  onClick={() =>
                    setCurrentCapsuleIndex((prev) =>
                      prev === capsuleHighlights.length - 1 ? 0 : prev + 1
                    )
                  }
                  className="p-1 hover:text-black transition-colors"
                  aria-label="Next capsule"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Right Image Detail */}
            <div className="md:col-span-4 relative aspect-[3/4] overflow-hidden bg-neutral-200 border border-neutral-300 shadow-md">
              <Image
                src={activeCapsule.imageRight}
                alt="Blinc Accents Detail"
                fill
                className="object-cover object-center filter grayscale contrast-110"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. RECOMMENDATION ROW (matching screenshot) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 border-t border-neutral-200">
        <div className="text-center mb-10">
          <h2 className="font-display font-black text-2xl sm:text-3xl tracking-tight uppercase text-neutral-950">
            RECOMMENDATION
          </h2>
          <p className="text-[10px] font-mono tracking-[0.25em] text-neutral-400 uppercase mt-1">
            CURATED OUTFIT COMBINATIONS
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {recommendationProducts.map((product) => (
            <ProductCard key={`rec-${product.id}`} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
