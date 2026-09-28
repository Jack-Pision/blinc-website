"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { Eye, Plus } from "lucide-react";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { formatPrice, addItem, openQuickView } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [showSizes, setShowSizes] = useState(false);

  const primaryImage = product.images[0];
  const hoverImage = product.images[1] || product.images[0];

  return (
    <div
      className="group relative flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowSizes(false);
      }}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-[#f5f5f7] border border-[#e5e5ea]/60 transition-all duration-300">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            priority={priority}
            className={`object-cover object-top transition-all duration-500 ease-out ${
              isHovered && hoverImage !== primaryImage
                ? "opacity-0 scale-105"
                : "opacity-100 scale-100"
            }`}
          />

          {hoverImage && (
            <Image
              src={hoverImage}
              alt={`${product.name} detail view`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className={`object-cover object-top transition-all duration-500 ease-out absolute inset-0 ${
                isHovered ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
            />
          )}
        </Link>

        {/* Subtle pill for new badge */}
        {product.isNew && (
          <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-sm text-[#1d1d1f] text-[10px] font-medium px-2 py-0.5 rounded-full border border-black/5 shadow-xs">
            2026 Edition
          </div>
        )}

        {/* Hover Quick Action */}
        <div
          className={`absolute bottom-3 inset-x-3 flex flex-col space-y-2 transition-all duration-200 ${
            isHovered
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-1 pointer-events-none"
          }`}
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
                    setShowSizes(false);
                  }}
                  className="w-7 h-7 text-xs font-medium rounded-lg hover:bg-[#1d1d1f] hover:text-white bg-[#f5f5f7] text-[#1d1d1f] transition-colors flex items-center justify-center"
                >
                  {sz}
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
                className="flex-1 bg-white/95 hover:bg-white text-[#1d1d1f] text-xs font-medium py-2 rounded-xl flex items-center justify-center space-x-1.5 shadow-sm border border-[#e5e5ea] transition-all"
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
                className="bg-[#1d1d1f] hover:bg-black text-white px-3 py-2 text-xs font-medium rounded-xl flex items-center justify-center transition-colors shadow-sm"
                title="Select size"
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
