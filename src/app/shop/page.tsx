"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PRODUCTS } from "@/data/products";
import { ProductCategory, GenderCategory } from "@/types";
import { ProductCard } from "@/components/ProductCard";
import { BrutalistAsterisk } from "@/components/BrutalistAsterisk";
import { LayoutGrid, Grid2X2, RotateCcw } from "lucide-react";

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = (searchParams.get("category") as ProductCategory) || "all";

  const [categoryFilter, setCategoryFilter] = useState<ProductCategory>(initialCategory);
  const [genderFilter, setGenderFilter] = useState<GenderCategory>("all");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "newest">("featured");
  const [gridColumns, setGridColumns] = useState<2 | 4>(4);

  const categories: { label: string; value: ProductCategory }[] = [
    { label: "ALL CATEGORIES", value: "all" },
    { label: "OUTERWEAR", value: "outerwear" },
    { label: "TAILORING", value: "tailoring" },
    { label: "KNITWEAR", value: "knitwear" },
    { label: "BOTTOMS", value: "bottoms" },
    { label: "TOPS", value: "tops" },
    { label: "DRESSES", value: "dresses" },
  ];

  const genders: { label: string; value: GenderCategory }[] = [
    { label: "ALL SILHOUETTES", value: "all" },
    { label: "WOMEN", value: "female" },
    { label: "MEN", value: "male" },
    { label: "UNISEX", value: "unisex" },
  ];

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((item) => {
      const matchCategory = categoryFilter === "all" || item.category === categoryFilter;
      const matchGender =
        genderFilter === "all" ||
        item.gender === genderFilter ||
        item.gender === "unisex";
      return matchCategory && matchGender;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "newest") return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [categoryFilter, genderFilter, sortBy]);

  const hasActiveFilters = categoryFilter !== "all" || genderFilter !== "all";

  const resetFilters = () => {
    setCategoryFilter("all");
    setGenderFilter("all");
    setSortBy("featured");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Catalog Title Header */}
      <div className="border-b border-neutral-200 pb-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-[10px] font-mono tracking-[0.25em] text-neutral-400 uppercase mb-2">
              <span>EDITION 2026</span>
              <span>·</span>
              <span>12 SCULPTURAL SILHOUETTES</span>
            </div>
            <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight uppercase text-neutral-950">
              FULL CATALOG
            </h1>
          </div>

          <div className="flex items-center space-x-4 text-xs font-mono text-neutral-500">
            <span>
              SHOWING <strong className="text-neutral-900">{filteredProducts.length}</strong> OF 12 DESIGNS
            </span>
            <div className="hidden sm:flex items-center border border-neutral-300">
              <button
                onClick={() => setGridColumns(2)}
                className={`p-1.5 transition-colors ${
                  gridColumns === 2 ? "bg-black text-white" : "text-neutral-600 hover:text-black"
                }`}
                title="2-Column Editorial View"
              >
                <Grid2X2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setGridColumns(4)}
                className={`p-1.5 transition-colors ${
                  gridColumns === 4 ? "bg-black text-white" : "text-neutral-600 hover:text-black"
                }`}
                title="4-Column Precision View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="mb-10 space-y-4">
        {/* Desktop Filter Row */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Gender Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-mono uppercase text-neutral-400 mr-2 tracking-wider hidden sm:inline">
              Gender:
            </span>
            {genders.map((g) => (
              <button
                key={g.value}
                onClick={() => setGenderFilter(g.value)}
                className={`px-3 py-1 text-xs font-mono uppercase tracking-wider transition-all border ${
                  genderFilter === g.value
                    ? "bg-neutral-900 text-white border-neutral-900 font-semibold"
                    : "bg-white text-neutral-700 border-neutral-300 hover:border-black"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono uppercase text-neutral-400 tracking-wider">
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value as "featured" | "price-asc" | "price-desc" | "newest"
                )
              }
              className="bg-white border border-neutral-300 text-xs font-mono text-neutral-800 py-1.5 px-3 uppercase tracking-wider focus:outline-none focus:border-black rounded-none cursor-pointer"
            >
              <option value="featured">Featured Curations</option>
              <option value="newest">2026 Releases</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center space-x-1 text-xs font-mono text-neutral-500 hover:text-black border border-neutral-300 px-2.5 py-1.5 transition-colors"
                title="Reset filters"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Pills Row */}
        <div className="flex items-center overflow-x-auto no-scrollbar gap-1.5 pt-2 border-t border-neutral-100 pb-1">
          <span className="text-[10px] font-mono uppercase text-neutral-400 mr-2 tracking-wider whitespace-nowrap">
            Category:
          </span>
          {categories.map((c) => (
            <button
              key={c.value}
              onClick={() => setCategoryFilter(c.value)}
              className={`px-3 py-1 text-[11px] font-mono uppercase tracking-wider transition-all whitespace-nowrap border ${
                categoryFilter === c.value
                  ? "bg-neutral-950 text-white border-neutral-950 font-semibold"
                  : "bg-white text-neutral-600 border-neutral-200 hover:border-black hover:text-black"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Display Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-24 text-center space-y-4 border border-dashed border-neutral-300 p-8">
          <BrutalistAsterisk size={36} className="text-neutral-400 mx-auto" />
          <h3 className="font-display text-lg font-bold uppercase tracking-wider text-neutral-800">
            No Silhouettes Match Selected Criteria
          </h3>
          <p className="text-xs font-mono text-neutral-500 max-w-sm mx-auto">
            Try adjusting your category or silhouette filter to inspect the remainder of the 2026 wardrobe collection.
          </p>
          <button
            onClick={resetFilters}
            className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-widest bg-neutral-900 text-white px-5 py-2.5 hover:bg-black transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      ) : (
        <div
          className={`grid gap-4 sm:gap-6 lg:gap-8 ${
            gridColumns === 2
              ? "grid-cols-1 sm:grid-cols-2"
              : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          }`}
        >
          {filteredProducts.map((product, idx) => (
            <ProductCard
              key={product.id}
              product={product}
              priority={idx < 4}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-12 text-xs font-mono">Loading Blinc Catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}
