"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { ProductCard } from "@/components/ProductCard";
import { BrutalistAsterisk } from "@/components/BrutalistAsterisk";
import {
  Check,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  Sparkles,
} from "lucide-react";

interface ProductDetailViewProps {
  product: Product;
  pairedProducts: Product[];
}

export function ProductDetailView({ product, pairedProducts }: ProductDetailViewProps) {
  const { formatPrice, addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [added, setAdded] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>("details");

  const toggleAccordion = (id: string) => {
    setOpenAccordion((prev) => (prev === id ? null : id));
  };

  const handleAddToCart = () => {
    addItem(product, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14">
      {/* Breadcrumb path */}
      <div className="flex items-center space-x-2 text-[10px] font-mono text-neutral-400 uppercase tracking-widest mb-8">
        <Link href="/" className="hover:text-black">
          Home
        </Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-black">
          Catalog
        </Link>
        <span>/</span>
        <span className="text-neutral-900 font-semibold">{product.name}</span>
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
        {/* Left Column: Multi-Angle Lookbook Gallery */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Selected Image */}
          <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#ECECE9] border border-neutral-300 shadow-sm">
            <Image
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              fill
              priority
              className="object-cover object-top"
            />
            <div className="absolute top-4 left-4 bg-neutral-950 text-white text-[9px] font-mono tracking-widest px-2.5 py-1 uppercase">
              {product.edition}
            </div>
          </div>

          {/* Secondary Gallery Row */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-2 gap-4">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative aspect-[3/4] w-full overflow-hidden bg-[#ECECE9] border transition-all ${
                    selectedImageIndex === idx
                      ? "border-black ring-2 ring-black"
                      : "border-neutral-300 opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} angle ${idx + 1}`}
                    fill
                    className="object-cover object-top"
                  />
                  <span className="absolute bottom-2 right-2 text-[9px] font-mono bg-white/90 px-1.5 py-0.5 text-neutral-700">
                    VIEW 0{idx + 1}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Sticky Product Information Rail */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-neutral-400 uppercase tracking-widest mb-1.5">
              <span>{product.gender} · {product.category}</span>
              <span>SKU: {product.id}</span>
            </div>

            <h1 className="font-display font-black text-2xl sm:text-4xl text-neutral-950 uppercase tracking-tight leading-tight">
              {product.name}
            </h1>

            <div className="mt-3 flex items-baseline space-x-3">
              <span className="font-mono text-xl sm:text-2xl font-bold text-neutral-950">
                {formatPrice(product.price)}
              </span>
              <span className="text-[11px] font-mono text-neutral-400">
                Inclusive of all 2026 import tariffs
              </span>
            </div>
          </div>

          <div className="w-full h-[1px] bg-neutral-200" />

          {/* Color Display */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-neutral-500 uppercase">Shade:</span>
              <span className="font-bold text-neutral-900">{product.color}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div
                className="w-6 h-6 rounded-none border border-neutral-400 shadow-xs"
                style={{ backgroundColor: product.colorHex }}
                title={product.color}
              />
              <span className="text-xs font-mono text-neutral-600">
                Natural mineral dye finish
              </span>
            </div>
          </div>

          {/* Size Selection */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-neutral-600 uppercase">Select Proportion:</span>
              <span className="text-neutral-400 hover:text-black cursor-pointer underline">
                Measurement Chart
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {product.sizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`py-3 text-xs font-mono uppercase tracking-wider border transition-all ${
                    selectedSize === sz
                      ? "bg-neutral-950 text-white border-neutral-950 font-bold"
                      : "bg-white text-neutral-800 border-neutral-300 hover:border-black"
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Bag CTA */}
          <div className="pt-2 space-y-3">
            <button
              onClick={handleAddToCart}
              className="w-full bg-neutral-950 hover:bg-black text-white py-4 px-6 text-xs font-mono uppercase tracking-widest font-semibold flex items-center justify-center space-x-2 transition-all shadow-md"
            >
              {added ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Secured in Bag</span>
                </>
              ) : (
                <>
                  <span>Acquire Garment — {formatPrice(product.price)}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center space-x-3 text-[10px] font-mono text-neutral-500 uppercase tracking-wider pt-1">
              <span className="flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3 text-neutral-600" />
                <span>Certified Sustainable</span>
              </span>
              <span>·</span>
              <span className="flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-neutral-600" />
                <span>Biella Tailoring</span>
              </span>
            </div>
          </div>

          {/* Garment Technical Metrics */}
          {product.stats && (
            <div className="grid grid-cols-3 gap-2 p-3 bg-neutral-100 border border-neutral-200 text-[10px] font-mono">
              <div>
                <span className="text-neutral-400 block uppercase">Weight</span>
                <span className="font-bold text-neutral-900">{product.stats.weight}</span>
              </div>
              <div>
                <span className="text-neutral-400 block uppercase">Provenance</span>
                <span className="font-bold text-neutral-900">{product.stats.origin}</span>
              </div>
              <div>
                <span className="text-neutral-400 block uppercase">Cut</span>
                <span className="font-bold text-neutral-900">{product.stats.silhouette}</span>
              </div>
            </div>
          )}

          {/* Accordion Specification Tabs */}
          <div className="border-t border-neutral-200 pt-4 space-y-3">
            {/* 1. Design & Specifications */}
            <div className="border-b border-neutral-200 pb-3">
              <button
                onClick={() => toggleAccordion("details")}
                className="w-full flex justify-between items-center text-xs font-mono uppercase tracking-wider text-neutral-900 font-bold py-1"
              >
                <span>Fabric & Craftsmanship Details</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    openAccordion === "details" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openAccordion === "details" && (
                <div className="pt-2 text-xs font-sans text-neutral-600 space-y-2">
                  <p className="leading-relaxed">{product.description}</p>
                  <ul className="list-disc list-inside space-y-1 pt-1 font-mono text-[11px] text-neutral-700">
                    {product.details.map((detail, idx) => (
                      <li key={idx}>{detail}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* 2. Fit & Measurements */}
            <div className="border-b border-neutral-200 pb-3">
              <button
                onClick={() => toggleAccordion("fit")}
                className="w-full flex justify-between items-center text-xs font-mono uppercase tracking-wider text-neutral-900 font-bold py-1"
              >
                <span>Architectural Fit Architecture</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    openAccordion === "fit" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openAccordion === "fit" && (
                <div className="pt-2 text-xs font-sans text-neutral-600 space-y-2">
                  <p className="leading-relaxed">{product.fit}</p>
                </div>
              )}
            </div>

            {/* 3. Sustainability */}
            <div className="border-b border-neutral-200 pb-3">
              <button
                onClick={() => toggleAccordion("sustainability")}
                className="w-full flex justify-between items-center text-xs font-mono uppercase tracking-wider text-neutral-900 font-bold py-1"
              >
                <span>2026 Circularity & Sustainability</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    openAccordion === "sustainability" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openAccordion === "sustainability" && (
                <div className="pt-2 text-xs font-sans text-neutral-600 space-y-2">
                  <p className="leading-relaxed">{product.sustainability}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* "COMPLETE THE LOOK" Recommendation Section */}
      {pairedProducts.length > 0 && (
        <section className="mt-24 pt-16 border-t border-neutral-300">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
                CURATED COMPANIONS
              </span>
              <h2 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-neutral-950 mt-0.5">
                STYLE WITH
              </h2>
            </div>
            <BrutalistAsterisk size={24} className="text-neutral-800" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {pairedProducts.map((p) => (
              <ProductCard key={`pair-${p.id}`} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
