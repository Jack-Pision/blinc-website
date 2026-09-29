import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Philosophy — Blinc",
  description: "The core design ethos behind Blinc: a study in intentional reduction and modern silhouettes for 2026.",
};

export default function PhilosophyPage() {
  const pillars = [
    {
      number: "01",
      title: "The Twelve-Piece Thesis",
      description:
        "Modern fashion is overwhelmed by micro-seasons and disposable trends. Blinc was founded as a design exercise in restraint: can a complete, versatile wardrobe exist in exactly twelve pieces? By limiting our focus, each silhouette is tested against dozens of combinations to ensure modularity.",
    },
    {
      number: "02",
      title: "Ergonomics & Movement",
      description:
        "Structure does not have to mean stiffness. In 2026, tailoring must adapt to hybrid lifestyles, fluid workspaces, and active transit. We incorporate deconstructed shoulders, gusseted armholes, and subtle elastane blends into traditional wools so garments move effortlessly with the body.",
    },
    {
      number: "03",
      title: "Tactile Permanence",
      description:
        "The fastest way to eliminate clothing waste is to produce garments people love wearing for decades. We select heavyweight Italian wools, double-faced cashmeres, and vegetable-tanned leathers that actually improve with age, gaining a rich patina rather than breaking down.",
    },
    {
      number: "04",
      title: "A Neutral Color Spectrum",
      description:
        "A capsule only works when colors harmonize effortlessly. Our palette is drawn from natural architectural materials: Chalk, Slate, Raw Wool, Deep Espresso, and Charcoal. Any two pieces from the collection can be worn together without visual conflict.",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-[#1d1d1f]">
      {/* Hero Header */}
      <div className="max-w-3xl space-y-4 mb-16">
        <span className="text-xs font-medium text-[#86868b] bg-[#f5f5f7] px-3 py-1 rounded-full border border-[#e5e5ea] inline-block">
          Design Ethos
        </span>
        <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-[#1d1d1f] leading-[1.12]">
          Reduction as a creative standard.
        </h1>
        <p className="text-base sm:text-lg text-[#86868b] leading-relaxed pt-1">
          Blinc is a design concept exploring what happens when you strip fashion of noise, seasonal cycles, and excess. A calm study in proportion, modern craft, and purposeful dress.
        </p>
      </div>

      {/* Editorial Photo Break */}
      <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full rounded-3xl overflow-hidden bg-[#f5f5f7] mb-16 sm:mb-24 shadow-xs">
        <Image
          src="/images/philosophy/design-studio.png"
          alt="Blinc Design Studio 2026 — Brutalist travertine atelier and textile development space"
          fill
          priority
          sizes="(max-width: 1200px) 100vw, 1200px"
          className="object-cover object-center"
        />
      </div>

      {/* Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 mb-20">
        {pillars.map((pillar) => (
          <div
            key={pillar.number}
            className="p-8 sm:p-10 bg-[#f5f5f7] rounded-3xl border border-[#e5e5ea]/60 space-y-4 flex flex-col justify-between"
          >
            <div>
              <span className="text-xs font-semibold text-[#86868b] block mb-2">
                {pillar.number}
              </span>
              <h2 className="text-xl font-semibold tracking-tight text-[#1d1d1f]">
                {pillar.title}
              </h2>
            </div>
            <p className="text-sm text-[#515154] leading-relaxed">
              {pillar.description}
            </p>
          </div>
        ))}
      </div>

      {/* Manifesto Quote Box */}
      <div className="p-8 sm:p-14 bg-white rounded-3xl border border-[#e5e5ea] text-center max-w-3xl mx-auto space-y-4">
        <p className="text-lg sm:text-xl font-medium text-[#1d1d1f] leading-snug">
          “The ultimate sophistication in modern dress is not adding one more layer, but having nothing left to take away.”
        </p>
        <span className="text-xs text-[#86868b] block">
          Blinc Design Notes · Capsule 2026
        </span>
      </div>

      {/* Call to Action */}
      <div className="mt-16 text-center">
        <Link
          href="/shop"
          className="inline-flex items-center bg-[#1d1d1f] hover:bg-black text-white text-xs font-medium px-6 py-3 rounded-full transition-colors"
        >
          View the 12 silhouettes
        </Link>
      </div>
    </div>
  );
}
