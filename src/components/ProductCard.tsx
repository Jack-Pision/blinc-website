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
      {/* Image Container with Studio Neutral Backdrop */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#ECECE9] border border-neutral-200/60 transition-all duration-300">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          {/* Primary Lookbook Image */}
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            priority={priority}
            className={`object-cover object-top transition-all duration-700 ease-out ${
              isHovered && hoverImage !== primaryImage
                ? "opacity-0 scale-105"
                : "opacity-100 scale-100"
            }`}
          />

          {/* Secondary Hover Lookbook Image */}
          {hoverImage && (
            <Image
              src={hoverImage}
              alt={`${product.name} editorial detail`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className={`object-cover object-top transition-all duration-700 ease-out absolute inset-0 ${
                isHovered ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
            />
          )}
        </Link>

        {/* Edition Badge */}
        {product.isNew && (
          <div className="absolute top-2.5 left-2.5 z-10 bg-neutral-900 text-white text-[9px] font-mono tracking-widest uppercase px-2 py-0.5">
            NEW 2026
          </div>
        )}

        {/* Floating Quick Action Overlay on Desktop */}
        <div
          className={`absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col space-y-2 transition-all duration-300 ${
            isHovered
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2 pointer-events-none"
          }`}
        >
          {showSizes ? (
            <div className="bg-white/95 backdrop-blur-sm p-2 flex items-center justify-center space-x-1.5 border border-neutral-200">
              <span className="text-[10px] font-mono text-neutral-500 uppercase mr-1">
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
                  className="w-7 h-7 text-xs font-mono font-medium hover:bg-black hover:text-white border border-neutral-300 transition-colors flex items-center justify-center"
                >
                  {sz}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  openQuickView(product);
                }}
                className="flex-1 bg-white/90 hover:bg-white text-neutral-900 text-[11px] font-mono uppercase tracking-wider py-2 flex items-center justify-center space-x-1.5 transition-colors shadow-sm"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Quick View</span>
              </button>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowSizes(true);
                }}
                className="bg-neutral-900 hover:bg-black text-white px-3 py-2 text-[11px] font-mono uppercase tracking-wider flex items-center justify-center transition-colors"
                title="Select size to add"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Product Metadata — Centered minimalist typography matching reference */}
      <div className="pt-3 pb-2 text-center flex flex-col items-center">
        <Link
          href={`/product/${product.slug}`}
          className="text-xs font-sans font-medium text-neutral-900 hover:text-neutral-600 transition-colors tracking-wide truncate max-w-full"
        >
          {product.name}
        </Link>
        <span className="text-xs font-mono font-bold text-neutral-900 mt-1 tracking-wider">
          {formatPrice(product.price)}
        </span>
        <span className="text-[10px] font-mono text-neutral-400 uppercase mt-0.5 tracking-widest">
          {product.gender} · {product.category}
        </span>
      </div>
    </div>
  );
}
