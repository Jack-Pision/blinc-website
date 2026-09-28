"use client";

import React, { useState } from "react";
import Image from "next/image";
import { PRODUCTS } from "@/data/products";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { Shuffle, Check, Plus, Sparkles } from "lucide-react";

export function CapsuleMixer() {
  const { addItem, formatPrice } = useCart();

  // Categorize 12 pieces for 3 wardrobe roles
  const outerLayers = PRODUCTS.filter(
    (p) =>
      p.slug === "deconstructed-oversized-wool-blazer" ||
      p.slug === "bonded-lambskin-cropped-biker" ||
      p.slug === "minimalist-double-breasted-trench" ||
      p.slug === "boxy-brushed-mohair-cardigan"
  );

  const coreTops = PRODUCTS.filter(
    (p) =>
      p.slug === "asymmetric-draped-silk-blouse" ||
      p.slug === "sculpted-mock-neck-knit" ||
      p.slug === "concealed-placket-poplin-shirt" ||
      p.slug === "fine-gauge-merino-cocoon-knit"
  );

  const bottoms = PRODUCTS.filter(
    (p) =>
      p.slug === "pleated-architectural-trousers" ||
      p.slug === "high-waist-column-maxi-skirt" ||
      p.slug === "relaxed-studio-drawstring-pant" ||
      p.slug === "architectural-tailored-evening-mini"
  );

  const [selectedOuter, setSelectedOuter] = useState<Product>(outerLayers[0]);
  const [selectedTop, setSelectedTop] = useState<Product>(coreTops[0]);
  const [selectedBottom, setSelectedBottom] = useState<Product>(bottoms[0]);
  const [addedAll, setAddedAll] = useState(false);

  const handleShuffle = () => {
    const randomOuter = outerLayers[Math.floor(Math.random() * outerLayers.length)];
    const randomTop = coreTops[Math.floor(Math.random() * coreTops.length)];
    const randomBottom = bottoms[Math.floor(Math.random() * bottoms.length)];

    setSelectedOuter(randomOuter);
    setSelectedTop(randomTop);
    setSelectedBottom(randomBottom);
  };

  const ensemble = [selectedOuter, selectedTop, selectedBottom];
  const totalPrice = ensemble.reduce((acc, curr) => acc + curr.price, 0);

  const handleAddEnsemble = () => {
    ensemble.forEach((p) => {
      addItem(p, p.sizes[1] || p.sizes[0]);
    });
    setAddedAll(true);
    setTimeout(() => setAddedAll(false), 2000);
  };

  return (
    <section className="bg-[#f5f5f7] rounded-3xl p-6 sm:p-10 lg:p-14 border border-[#e5e5ea]/80">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-1.5 text-xs font-medium text-[#86868b] bg-white px-3 py-1 rounded-full border border-[#e5e5ea]">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Interactive Silhouette Lab</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1d1d1f]">
            Pair the 12 Pieces
          </h2>
          <p className="text-xs sm:text-sm text-[#86868b] max-w-lg leading-relaxed">
            Test modular compatibility in real time. Every top, bottom, and outerwear piece is architecturally engineered to harmonize in proportion, texture, and tone.
          </p>
        </div>

        <button
          type="button"
          onClick={handleShuffle}
          className="inline-flex items-center space-x-1.5 bg-white hover:bg-[#e5e5ea] text-[#1d1d1f] text-xs font-medium px-4 py-2 rounded-full border border-[#e5e5ea] transition-all shadow-xs self-start sm:self-auto"
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span>Shuffle Silhouette</span>
        </button>
      </div>

      {/* 3 Selected Garment Cards (Live Ensemble View) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Slot 1: Outerwear */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#e5e5ea] shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider">
              01 · Outer Layer
            </span>
            <span className="text-xs font-medium text-[#1d1d1f]">
              {formatPrice(selectedOuter.price)}
            </span>
          </div>

          <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#f5f5f7]">
            <Image
              src={selectedOuter.images[0]}
              alt={selectedOuter.name}
              fill
              className="object-cover object-top transition-transform duration-500 hover:scale-105"
            />
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[#1d1d1f] truncate">
              {selectedOuter.name}
            </h4>
            <p className="text-xs text-[#86868b] mt-0.5">
              {selectedOuter.color} · {selectedOuter.stats?.weight || "Heavyweight"}
            </p>
          </div>

          {/* Quick Picker Pills */}
          <div className="space-y-1.5 pt-2 border-t border-[#f5f5f7]">
            <span className="text-[10px] text-[#86868b] block">Select Layer:</span>
            <div className="grid grid-cols-2 gap-1.5">
              {outerLayers.map((outer) => (
                <button
                  key={outer.id}
                  onClick={() => setSelectedOuter(outer)}
                  className={`px-2 py-1 text-[11px] rounded-lg truncate text-left transition-all ${
                    selectedOuter.id === outer.id
                      ? "bg-[#1d1d1f] text-white font-medium shadow-xs"
                      : "bg-[#f5f5f7] text-[#515154] hover:bg-[#e5e5ea]"
                  }`}
                >
                  {outer.name.replace("Deconstructed ", "").replace("Minimalist ", "")}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Slot 2: Core Top */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#e5e5ea] shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider">
              02 · Core Top
            </span>
            <span className="text-xs font-medium text-[#1d1d1f]">
              {formatPrice(selectedTop.price)}
            </span>
          </div>

          <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#f5f5f7]">
            <Image
              src={selectedTop.images[0]}
              alt={selectedTop.name}
              fill
              className="object-cover object-top transition-transform duration-500 hover:scale-105"
            />
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[#1d1d1f] truncate">
              {selectedTop.name}
            </h4>
            <p className="text-xs text-[#86868b] mt-0.5">
              {selectedTop.color} · {selectedTop.stats?.weight || "Featherweight"}
            </p>
          </div>

          {/* Quick Picker Pills */}
          <div className="space-y-1.5 pt-2 border-t border-[#f5f5f7]">
            <span className="text-[10px] text-[#86868b] block">Select Top:</span>
            <div className="grid grid-cols-2 gap-1.5">
              {coreTops.map((top) => (
                <button
                  key={top.id}
                  onClick={() => setSelectedTop(top)}
                  className={`px-2 py-1 text-[11px] rounded-lg truncate text-left transition-all ${
                    selectedTop.id === top.id
                      ? "bg-[#1d1d1f] text-white font-medium shadow-xs"
                      : "bg-[#f5f5f7] text-[#515154] hover:bg-[#e5e5ea]"
                  }`}
                >
                  {top.name.replace("Asymmetric ", "").replace("Sculpted ", "")}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Slot 3: Bottom / Foundation */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#e5e5ea] shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider">
              03 · Foundation
            </span>
            <span className="text-xs font-medium text-[#1d1d1f]">
              {formatPrice(selectedBottom.price)}
            </span>
          </div>

          <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#f5f5f7]">
            <Image
              src={selectedBottom.images[0]}
              alt={selectedBottom.name}
              fill
              className="object-cover object-top transition-transform duration-500 hover:scale-105"
            />
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[#1d1d1f] truncate">
              {selectedBottom.name}
            </h4>
            <p className="text-xs text-[#86868b] mt-0.5">
              {selectedBottom.color} · {selectedBottom.stats?.weight || "Tailored"}
            </p>
          </div>

          {/* Quick Picker Pills */}
          <div className="space-y-1.5 pt-2 border-t border-[#f5f5f7]">
            <span className="text-[10px] text-[#86868b] block">Select Bottom:</span>
            <div className="grid grid-cols-2 gap-1.5">
              {bottoms.map((bottom) => (
                <button
                  key={bottom.id}
                  onClick={() => setSelectedBottom(bottom)}
                  className={`px-2 py-1 text-[11px] rounded-lg truncate text-left transition-all ${
                    selectedBottom.id === bottom.id
                      ? "bg-[#1d1d1f] text-white font-medium shadow-xs"
                      : "bg-[#f5f5f7] text-[#515154] hover:bg-[#e5e5ea]"
                  }`}
                >
                  {bottom.name.replace("Pleated ", "").replace("Architectural ", "")}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Ensemble Summary & Action Bar */}
      <div className="bg-white rounded-2xl p-6 border border-[#e5e5ea] flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start space-x-2">
            <span className="text-xs text-[#86868b]">Palette Harmony:</span>
            <div className="flex space-x-1.5 items-center">
              <span
                className="w-3 h-3 rounded-full border border-black/10"
                style={{ backgroundColor: selectedOuter.colorHex }}
                title={selectedOuter.color}
              />
              <span
                className="w-3 h-3 rounded-full border border-black/10"
                style={{ backgroundColor: selectedTop.colorHex }}
                title={selectedTop.color}
              />
              <span
                className="w-3 h-3 rounded-full border border-black/10"
                style={{ backgroundColor: selectedBottom.colorHex }}
                title={selectedBottom.color}
              />
            </div>
          </div>
          <div className="text-lg font-semibold text-[#1d1d1f]">
            Complete Ensemble Total: {formatPrice(totalPrice)}
          </div>
          <p className="text-xs text-[#86868b]">
            3 curated garments · Complies with 2026 modular silhouette guidelines
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleAddEnsemble}
            className="flex-1 sm:flex-none bg-[#1d1d1f] hover:bg-black text-white text-xs font-medium px-6 py-3.5 rounded-full transition-all flex items-center justify-center space-x-2 shadow-xs"
          >
            {addedAll ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>3 Garments Added to Bag</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Add Complete Silhouette ({formatPrice(totalPrice)})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
