"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { X, ArrowRight, Check } from "lucide-react";

export function QuickViewModal() {
  const { quickViewProduct, closeQuickView, formatPrice, addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [added, setAdded] = useState(false);

  if (!quickViewProduct) return null;

  const activeSize = selectedSize || quickViewProduct.sizes[0];

  const handleAddToCart = () => {
    addItem(quickViewProduct, activeSize);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      closeQuickView();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Backdrop */}
      <div
        onClick={closeQuickView}
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative bg-[#FBFBFA] max-w-4xl w-full border border-neutral-300 shadow-2xl overflow-hidden z-10 my-8">
        {/* Close Button */}
        <button
          onClick={closeQuickView}
          className="absolute top-4 right-4 z-20 p-2 bg-white/80 hover:bg-white text-neutral-900 border border-neutral-200 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Gallery */}
          <div className="relative bg-[#ECECE9] p-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-neutral-200">
            <div className="relative aspect-[3/4] w-full max-w-sm overflow-hidden bg-white shadow-inner">
              <Image
                src={quickViewProduct.images[selectedImageIndex] || quickViewProduct.images[0]}
                alt={quickViewProduct.name}
                fill
                className="object-cover object-top"
              />
            </div>

            {/* Thumbnail switcher if multiple images */}
            {quickViewProduct.images.length > 1 && (
              <div className="flex space-x-2 mt-3">
                {quickViewProduct.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-12 h-14 border overflow-hidden transition-all ${
                      selectedImageIndex === idx
                        ? "border-black ring-1 ring-black"
                        : "border-neutral-300 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt="Thumbnail"
                      fill
                      className="object-cover object-top"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Details */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-neutral-400 uppercase tracking-widest mb-1">
                <span>{quickViewProduct.edition}</span>
                <span>{quickViewProduct.gender} · {quickViewProduct.category}</span>
              </div>

              <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-neutral-950 uppercase">
                {quickViewProduct.name}
              </h2>

              <p className="text-base font-mono font-bold text-neutral-900 mt-2">
                {formatPrice(quickViewProduct.price)}
              </p>

              <div className="w-full h-[1px] bg-neutral-200 my-4" />

              <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                {quickViewProduct.description}
              </p>

              {/* Stats pill */}
              {quickViewProduct.stats && (
                <div className="grid grid-cols-3 gap-2 mt-4 p-3 bg-neutral-100 border border-neutral-200/60 text-[10px] font-mono">
                  <div>
                    <span className="text-neutral-400 block uppercase">Weight</span>
                    <span className="font-semibold text-neutral-800">{quickViewProduct.stats.weight}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block uppercase">Origin</span>
                    <span className="font-semibold text-neutral-800">{quickViewProduct.stats.origin}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block uppercase">Cut</span>
                    <span className="font-semibold text-neutral-800">{quickViewProduct.stats.silhouette}</span>
                  </div>
                </div>
              )}

              {/* Size Selector */}
              <div className="mt-6">
                <div className="flex justify-between items-center text-xs font-mono mb-2">
                  <span className="text-neutral-600 uppercase">Select Size:</span>
                  <span className="text-neutral-400 underline cursor-pointer hover:text-black">
                    Sizing Guide
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {quickViewProduct.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider border transition-all ${
                        activeSize === sz
                          ? "bg-neutral-900 text-white border-neutral-900 font-bold"
                          : "bg-white text-neutral-800 border-neutral-300 hover:border-black"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t border-neutral-200">
              <button
                onClick={handleAddToCart}
                className="w-full bg-neutral-900 hover:bg-black text-white py-3.5 px-6 text-xs font-mono uppercase tracking-widest font-semibold flex items-center justify-center space-x-2 transition-colors"
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <>
                    <span>Add to Bag — {formatPrice(quickViewProduct.price)}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <Link
                href={`/product/${quickViewProduct.slug}`}
                onClick={closeQuickView}
                className="w-full text-center block text-xs font-mono text-neutral-500 hover:text-neutral-900 uppercase tracking-wider py-1"
              >
                View Full Editorial Specifications →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
