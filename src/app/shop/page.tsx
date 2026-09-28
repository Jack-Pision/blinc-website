"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PRODUCTS } from "@/data/products";
import { ProductCategory, GenderCategory } from "@/types";
import { ProductCard } from "@/components/ProductCard";
import { CapsuleMixer } from "@/components/CapsuleMixer";
import { LayoutGrid, Grid2X2, RotateCcw, Sparkles } from "lucide-react";

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = (searchParams.get("category") as ProductCategory) || "all";
  const initialGender = (searchParams.get("gender") as GenderCategory) || "all";

  const [categoryFilter, setCategoryFilter] = useState<ProductCategory>(initialCategory);
  const [genderFilter, setGenderFilter] = useState<GenderCategory>(initialGender);
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "newest">("featured");
  const [gridColumns, setGridColumns] = useState<2 | 4>(4);
  const [viewMode, setViewMode] = useState<"grid" | "mixer">("grid");

  const categories: { label: string; value: ProductCategory }[] = [
    { label: "All garments", value: "all" },
    { label: "Outerwear", value: "outerwear" },
    { label: "Tailoring", value: "tailoring" },
    { label: "Knitwear", value: "knitwear" },
    { label: "Bottoms", value: "bottoms" },
    { label: "Tops", value: "tops" },
    { label: "Dresses", value: "dresses" },
  ];

  const genders: { label: string; value: GenderCategory }[] = [
    { label: "All (12)", value: "all" },
    { label: "Women", value: "female" },
    { label: "Men", value: "male" },
    { label: "Unisex", value: "unisex" },
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 text-[#1d1d1f]">
      {/* Apple-style Catalog Header */}
      <div className="border-b border-[#e5e5ea] pb-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-medium text-[#86868b] block mb-1">
              2026 Collection
            </span>
            <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-[#1d1d1f]">
              Shop the Collection
            </h1>
            <p className="text-sm text-[#86868b] mt-1.5">
              Showing {filteredProducts.length} of 12 garments designed for modern living.
            </p>
          </div>

          {/* Mode & Grid Switcher */}
          <div className="flex items-center space-x-3">
            {/* View Mode Pill */}
            <div className="flex items-center p-1 bg-[#f5f5f7] rounded-full border border-[#e5e5ea]">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                  viewMode === "grid"
                    ? "bg-white text-[#1d1d1f] shadow-xs"
                    : "text-[#86868b] hover:text-[#1d1d1f]"
                }`}
              >
                Wardrobe Grid
              </button>
              <button
                onClick={() => setViewMode("mixer")}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-all flex items-center space-x-1.5 ${
                  viewMode === "mixer"
                    ? "bg-white text-[#1d1d1f] shadow-xs"
                    : "text-[#86868b] hover:text-[#1d1d1f]"
                }`}
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Silhouette Lab</span>
              </button>
            </div>

            {/* Grid Density Toggle (only active in grid mode) */}
            {viewMode === "grid" && (
              <div className="hidden sm:flex items-center space-x-1 bg-[#f5f5f7] p-1 rounded-full border border-[#e5e5ea]">
                <button
                  onClick={() => setGridColumns(2)}
                  className={`p-1.5 rounded-full transition-all ${
                    gridColumns === 2 ? "bg-white text-[#1d1d1f] shadow-xs" : "text-[#86868b] hover:text-[#1d1d1f]"
                  }`}
                  title="2-Column View"
                >
                  <Grid2X2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setGridColumns(4)}
                  className={`p-1.5 rounded-full transition-all ${
                    gridColumns === 4 ? "bg-white text-[#1d1d1f] shadow-xs" : "text-[#86868b] hover:text-[#1d1d1f]"
                  }`}
                  title="4-Column View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {viewMode === "mixer" ? (
        <div className="animate-in fade-in duration-300">
          <CapsuleMixer />
        </div>
      ) : (
        <>
          {/* Filter Control Bar */}
          <div className="mb-10 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Gender Pills */}
              <div className="flex p-1 bg-[#f5f5f7] rounded-full border border-[#e5e5ea]">
                {genders.map((g) => (
                  <button
                    key={g.value}
                    onClick={() => setGenderFilter(g.value)}
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                      genderFilter === g.value
                        ? "bg-white text-[#1d1d1f] shadow-xs"
                        : "text-[#86868b] hover:text-[#1d1d1f]"
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>

              {/* Sort Dropdown & Reset */}
              <div className="flex items-center space-x-3 text-xs">
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="inline-flex items-center space-x-1 text-[#86868b] hover:text-[#1d1d1f] transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                )}

                <div className="flex items-center space-x-2">
                  <span className="text-[#86868b]">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(
                        e.target.value as "featured" | "price-asc" | "price-desc" | "newest"
                      )
                    }
                    className="bg-[#f5f5f7] border border-[#e5e5ea] rounded-full px-3 py-1.5 text-xs text-[#1d1d1f] focus:outline-none cursor-pointer"
                  >
                    <option value="featured">Featured (2026)</option>
                    <option value="newest">New Releases</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Category Scroll Row */}
            <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-2">
              {categories.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setCategoryFilter(c.value)}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-all border ${
                    categoryFilter === c.value
                      ? "bg-[#1d1d1f] text-white border-[#1d1d1f]"
                      : "bg-[#f5f5f7] text-[#515154] border-transparent hover:bg-[#e5e5ea]"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-[#f5f5f7] rounded-3xl border border-[#e5e5ea]">
              <h3 className="text-base font-semibold text-[#1d1d1f]">
                No garments found in this selection
              </h3>
              <p className="text-xs text-[#86868b] mt-1 mb-4">
                Try selecting different category or gender filters.
              </p>
              <button
                onClick={resetFilters}
                className="bg-[#1d1d1f] text-white text-xs font-medium px-4 py-2 rounded-full"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div
              className={`grid gap-4 sm:gap-6 ${
                gridColumns === 2
                  ? "grid-cols-1 sm:grid-cols-2"
                  : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              }`}
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-6xl mx-auto px-4 py-20 text-center text-xs text-[#86868b]">
          Loading 2026 Collection...
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
