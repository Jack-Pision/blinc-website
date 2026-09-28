"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { ProductCard } from "@/components/ProductCard";
import {
  Check,
  ChevronDown,
  ShieldCheck,
  Truck,
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-14 text-[#1d1d1f]">
      {/* Breadcrumb path */}
      <div className="flex items-center space-x-2 text-xs text-[#86868b] mb-8">
        <Link href="/" className="hover:text-[#1d1d1f] transition-colors">
          Overview
        </Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-[#1d1d1f] transition-colors">
          Collection
        </Link>
        <span>/</span>
        <span className="text-[#1d1d1f] font-medium">{product.name}</span>
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
        {/* Left Column: Multi-Angle Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl bg-[#f5f5f7] shadow-xs">
            <Image
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              fill
              priority
              className="object-cover object-top"
            />
            <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md text-[#1d1d1f] text-xs font-medium px-3 py-1 rounded-full shadow-2xs">
              {product.edition}
            </div>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex space-x-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-24 rounded-xl overflow-hidden bg-[#f5f5f7] transition-all ${
                    selectedImageIndex === idx
                      ? "ring-2 ring-[#1d1d1f]"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    fill
                    className="object-cover object-top"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Sticky Product Info */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-6">
          <div>
            <span className="text-xs font-medium text-[#86868b] block mb-1">
              {product.gender} · {product.category}
            </span>

            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1d1d1f]">
              {product.name}
            </h1>

            <div className="mt-2 text-xl font-semibold text-[#1d1d1f]">
              {formatPrice(product.price)}
            </div>
          </div>

          <div className="w-full h-[1px] bg-[#e5e5ea]" />

          {/* Color Selection */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-[#86868b]">Color:</span>
              <span className="font-medium text-[#1d1d1f]">{product.color}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div
                className="w-5 h-5 rounded-full border border-black/10 shadow-2xs"
                style={{ backgroundColor: product.colorHex }}
                title={product.color}
              />
              <span className="text-xs text-[#86868b]">Natural mineral dyed</span>
            </div>
          </div>

          {/* Size Selector */}
          <div className="space-y-2 pt-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#86868b]">Size:</span>
              <span className="text-[#0071e3] hover:underline cursor-pointer">
                Size guide
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {product.sizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`py-2 text-xs font-medium rounded-full transition-all border ${
                    selectedSize === sz
                      ? "bg-[#1d1d1f] text-white border-[#1d1d1f]"
                      : "bg-white text-[#1d1d1f] border-[#d2d2d7] hover:border-black"
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
              className="w-full bg-[#1d1d1f] hover:bg-black text-white py-3.5 px-6 rounded-full text-sm font-medium flex items-center justify-center space-x-2 transition-all shadow-sm"
            >
              {added ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Added to bag</span>
                </>
              ) : (
                <span>Add to bag — {formatPrice(product.price)}</span>
              )}
            </button>

            <div className="flex items-center justify-center space-x-4 text-xs text-[#86868b] pt-1">
              <span className="flex items-center space-x-1">
                <Truck className="w-3.5 h-3.5 text-[#86868b]" />
                <span>Complimentary express shipping</span>
              </span>
              <span>·</span>
              <span className="flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#86868b]" />
                <span>Lifetime repair guarantee</span>
              </span>
            </div>
          </div>

          {/* Technical Specs Card */}
          {product.stats && (
            <div className="grid grid-cols-3 gap-2 p-3.5 bg-[#f5f5f7] rounded-2xl text-xs">
              <div>
                <span className="text-[#86868b] block text-[11px]">Weight</span>
                <span className="font-medium text-[#1d1d1f]">{product.stats.weight}</span>
              </div>
              <div>
                <span className="text-[#86868b] block text-[11px]">Origin</span>
                <span className="font-medium text-[#1d1d1f]">{product.stats.origin}</span>
              </div>
              <div>
                <span className="text-[#86868b] block text-[11px]">Fit</span>
                <span className="font-medium text-[#1d1d1f]">{product.stats.silhouette}</span>
              </div>
            </div>
          )}

          {/* Accordion Tabs */}
          <div className="border-t border-[#e5e5ea] pt-3 space-y-2">
            <div className="border-b border-[#e5e5ea] pb-3">
              <button
                onClick={() => toggleAccordion("details")}
                className="w-full flex justify-between items-center text-xs font-medium text-[#1d1d1f] py-1"
              >
                <span>Fabric & craftsmanship details</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-[#86868b] transition-transform duration-200 ${
                    openAccordion === "details" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openAccordion === "details" && (
                <div className="pt-2 text-xs text-[#86868b] space-y-2 leading-relaxed">
                  <p>{product.description}</p>
                  <ul className="list-disc list-inside space-y-1 pt-1 text-[#1d1d1f]">
                    {product.details.map((detail, idx) => (
                      <li key={idx}>{detail}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="border-b border-[#e5e5ea] pb-3">
              <button
                onClick={() => toggleAccordion("fit")}
                className="w-full flex justify-between items-center text-xs font-medium text-[#1d1d1f] py-1"
              >
                <span>Fit & sizing</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-[#86868b] transition-transform duration-200 ${
                    openAccordion === "fit" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openAccordion === "fit" && (
                <div className="pt-2 text-xs text-[#86868b] leading-relaxed">
                  <p>{product.fit}</p>
                </div>
              )}
            </div>

            <div className="border-b border-[#e5e5ea] pb-3">
              <button
                onClick={() => toggleAccordion("sustainability")}
                className="w-full flex justify-between items-center text-xs font-medium text-[#1d1d1f] py-1"
              >
                <span>Environmental impact</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-[#86868b] transition-transform duration-200 ${
                    openAccordion === "sustainability" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openAccordion === "sustainability" && (
                <div className="pt-2 text-xs text-[#86868b] leading-relaxed">
                  <p>{product.sustainability}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Complete the Look Section */}
      {pairedProducts.length > 0 && (
        <section className="mt-20 pt-12 border-t border-[#e5e5ea]">
          <div className="mb-6">
            <h2 className="text-xl font-semibold tracking-tight text-[#1d1d1f]">
              Complete the look
            </h2>
            <p className="text-xs text-[#86868b] mt-0.5">
              Pieces designed to pair seamlessly with {product.name}.
            </p>
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
