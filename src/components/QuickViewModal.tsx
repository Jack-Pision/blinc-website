"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { X, Check } from "lucide-react";

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
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        onClick={closeQuickView}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative bg-white max-w-3xl w-full rounded-3xl border border-[#e5e5ea] shadow-2xl overflow-hidden z-10 my-8">
        {/* Close Button */}
        <button
          onClick={closeQuickView}
          className="absolute top-4 right-4 z-20 p-2 bg-[#f5f5f7] hover:bg-[#e5e5ea] text-[#1d1d1f] rounded-full transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Gallery */}
          <div className="relative bg-[#f5f5f7] p-6 flex flex-col items-center justify-center">
            <div className="relative aspect-[3/4] w-full max-w-xs overflow-hidden rounded-2xl">
              <Image
                src={quickViewProduct.images[selectedImageIndex] || quickViewProduct.images[0]}
                alt={quickViewProduct.name}
                fill
                className="object-cover object-top"
              />
            </div>

            {quickViewProduct.images.length > 1 && (
              <div className="flex space-x-2 mt-4">
                {quickViewProduct.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-12 h-14 rounded-lg overflow-hidden transition-all ${
                      selectedImageIndex === idx
                        ? "ring-2 ring-[#1d1d1f]"
                        : "opacity-60 hover:opacity-100"
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

          {/* Right: Product Details */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-xs text-[#86868b] capitalize">
                <span>{quickViewProduct.gender}</span>
                <span>·</span>
                <span>{quickViewProduct.category}</span>
              </div>

              <h3 className="text-xl font-semibold text-[#1d1d1f]">
                {quickViewProduct.name}
              </h3>

              <div className="text-lg font-medium text-[#1d1d1f]">
                {formatPrice(quickViewProduct.price)}
              </div>

              <p className="text-xs text-[#515154] leading-relaxed pt-1">
                {quickViewProduct.description}
              </p>
            </div>

            {/* Size Selector */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#86868b]">Select Size</span>
                <span className="text-[#1d1d1f] font-medium">{activeSize}</span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {quickViewProduct.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`py-2 text-xs font-medium rounded-xl border transition-all ${
                      activeSize === sz
                        ? "bg-[#1d1d1f] text-white border-[#1d1d1f]"
                        : "bg-white text-[#1d1d1f] border-[#e5e5ea] hover:border-[#1d1d1f]"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleAddToCart}
                className="w-full bg-[#1d1d1f] hover:bg-black text-white py-3 rounded-full text-xs font-medium transition-colors flex items-center justify-center space-x-1.5"
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <span>Add to Bag · {formatPrice(quickViewProduct.price)}</span>
                )}
              </button>

              <Link
                href={`/product/${quickViewProduct.slug}`}
                onClick={closeQuickView}
                className="block text-center text-xs text-[#86868b] hover:text-[#1d1d1f] py-1 transition-colors"
              >
                View full garment specifications →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
