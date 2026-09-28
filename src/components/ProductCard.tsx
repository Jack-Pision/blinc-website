"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { Eye, Plus, Check } from "lucide-react";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { formatPrice, addItem, openQuickView } = useCart();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showSizes, setShowSizes] = useState(false);
  const [addedSize, setAddedSize] = useState<string | null>(null);

  const images = product.images;

  return (
    <div
      className="group relative flex flex-col transition-all duration-300"
      onMouseLeave={() => {
        setActiveImageIndex(0);
        setShowSizes(false);
      }}
    >
      {/* Image Container with Tactile Studio Backdrop */}
      <div
        className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-[#f5f5f7] border border-[#e5e5ea]/60 transition-transform duration-300 group-hover:shadow-sm"
        onMouseMove={(e) => {
          if (images.length > 1) {
            const rect = e.currentTarget.getBoundingClientRect();
            const xPercent = (e.clientX - rect.left) / rect.width;
            const newIndex = xPercent > 0.5 ? 1 : 0;
            if (newIndex !== activeImageIndex) {
              setActiveImageIndex(newIndex);
            }
          }
        }}
      >
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          {images.map((img, idx) => (
            <Image
              key={idx}
              src={img}
              alt={`${product.name} angle ${idx + 1}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              priority={priority && idx === 0}
              className={`object-cover object-top transition-opacity duration-300 ease-out absolute inset-0 ${
                activeImageIndex === idx ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </Link>

        {/* Edition & Material Weight Pill */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none z-10">
          {product.isNew ? (
            <span className="bg-white/90 backdrop-blur-sm text-[#1d1d1f] text-[10px] font-medium px-2.5 py-0.5 rounded-full border border-black/5 shadow-2xs">
              2026 Edition
            </span>
          ) : (
            <span />
          )}

          {product.stats?.weight && (
            <span className="bg-black/40 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded-full shadow-2xs">
              {product.stats.weight}
            </span>
          )}
        </div>

        {/* Multi-angle indicator bar (visible on hover if multiple images) */}
        {images.length > 1 && (
          <div className="absolute bottom-14 inset-x-0 flex justify-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
            {images.map((_, i) => (
              <span
                key={i}
                className={`h-1 rounded-full transition-all duration-200 ${
                  activeImageIndex === i ? "w-4 bg-white" : "w-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        )}

        {/* Hover Quick Action Tray */}
        <div
          className="absolute bottom-3 inset-x-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200 z-20"
        >
          {showSizes ? (
            <div className="bg-white/95 backdrop-blur-md p-2 rounded-xl shadow-lg border border-[#e5e5ea] flex items-center justify-center space-x-1.5">
              <span className="text-[11px] text-[#86868b] mr-1">
                Size:
              </span>
              {product.sizes.map((sz) => (
                <button
                  key={sz}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    addItem(product, sz);
                    setAddedSize(sz);
                    setTimeout(() => {
                      setAddedSize(null);
                      setShowSizes(false);
                    }, 600);
                  }}
                  className={`w-7 h-7 text-xs font-medium rounded-lg transition-colors flex items-center justify-center ${
                    addedSize === sz
                      ? "bg-emerald-600 text-white"
                      : "bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#1d1d1f] hover:text-white"
                  }`}
                >
                  {addedSize === sz ? <Check className="w-3.5 h-3.5" /> : sz}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex space-x-1.5">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  openQuickView(product);
                }}
                className="flex-1 bg-white/95 hover:bg-white text-[#1d1d1f] text-xs font-medium py-2 rounded-xl flex items-center justify-center space-x-1.5 shadow-sm border border-[#e5e5ea] active:scale-[0.98] transition-all"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Quick look</span>
              </button>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowSizes(true);
                }}
                className="bg-[#1d1d1f] hover:bg-black text-white px-3 py-2 text-xs font-medium rounded-xl flex items-center justify-center transition-colors shadow-sm active:scale-[0.98]"
                title="Select size to bag"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Metadata */}
      <div className="pt-3 pb-1 flex flex-col items-start">
        <div className="w-full flex items-baseline justify-between">
          <Link
            href={`/product/${product.slug}`}
            className="text-sm font-medium text-[#1d1d1f] hover:text-[#0071e3] transition-colors truncate max-w-[70%]"
          >
            {product.name}
          </Link>
          <span className="text-xs font-medium text-[#1d1d1f]">
            {formatPrice(product.price)}
          </span>
        </div>
        <p className="text-xs text-[#86868b] capitalize mt-0.5">
          {product.gender} · {product.category}
        </p>
      </div>
    </div>
  );
}
