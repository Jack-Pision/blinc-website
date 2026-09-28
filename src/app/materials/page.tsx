import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Materials & Craft — Blinc",
  description: "Explore the certified, premium textiles engineered for the Blinc 2026 concept wardrobe.",
};

const FABRICS = [
  {
    name: "Italian Virgin Wool",
    spec: "380 GSM · Worsted Weave",
    origin: "Biella, Piedmont, Italy",
    certification: "Responsible Wool Standard (RWS)",
    description:
      "Spun from ultra-fine Merino fleeces in northern Italy, this 380 GSM wool features an engineered dense weave that resists creasing while draping with architectural structure. Naturally breathable with thermoregulating comfort across four seasons.",
    image:
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1200&q=85",
    garments: [
      "Deconstructed Oversized Wool Blazer",
      "Pleated Architectural Trousers",
      "Double-Faced Wool Cocoon Coat",
    ],
  },
  {
    name: "Sandwashed Mulberry Silk",
    spec: "22 Momme · Heavyweight Satin",
    origin: "Como, Lombardy, Italy",
    certification: "OEKO-TEX® Standard 100",
    description:
      "Woven from Grade 6A pure mulberry silk and treated with a gentle water-and-sand wash process. This technique removes the shiny glare of traditional satin, leaving a soft powdered suede handfeel and fluid, cascading movement.",
    image:
      "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=1200&q=85",
    garments: [
      "Asymmetric Draped Silk Blouse",
      "Sculptural Bias-Cut Silk Dress",
    ],
  },
  {
    name: "Brushed Baby Mohair & Alpaca",
    spec: "7-Gauge Ribbed Knit",
    origin: "Arequipa, Peru & Prato, Italy",
    certification: "Sustainable Mohair Industry Standard",
    description:
      "Blended from the softest first shearings of South African angora goats and Peruvian baby alpaca, gently brushed with natural teasels for a cloud-like halo that traps body warmth with zero bulk.",
    image:
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1200&q=85",
    garments: [
      "Ribbed Mohair Wrap Cardigan",
      "Gradient Brushed Mohair Jumper",
    ],
  },
  {
    name: "French Full-Grain Nappa",
    spec: "0.8mm Gauge · Semi-Aniline Finish",
    origin: "Millau, Occitanie, France",
    certification: "Leather Working Group (LWG) Gold Rated",
    description:
      "Sourced exclusively from European agricultural byproducts and tanned with mimosa and chestnut extracts. Exceptionally buttery and supple from day one, developing a personalized patina that enriches over decades of wear.",
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=85",
    garments: [
      "Modular Leather Biker Jacket",
      "Technical Bonded Trench Coat",
    ],
  },
];

export default function MaterialsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-[#1d1d1f]">
      {/* Page Header */}
      <div className="max-w-2xl space-y-3 mb-16">
        <span className="text-xs font-medium text-[#86868b] bg-[#f5f5f7] px-3 py-1 rounded-full border border-[#e5e5ea] inline-block">
          Textile Standards
        </span>
        <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-[#1d1d1f]">
          Materials & Craft
        </h1>
        <p className="text-base text-[#86868b] leading-relaxed">
          Every piece in the 2026 concept wardrobe starts with fiber integrity. We partner with legacy European mills dedicated to low-impact dyeing, natural longevity, and tactile refinement.
        </p>
      </div>

      {/* Fabric Cards Grid */}
      <div className="space-y-12 sm:space-y-16">
        {FABRICS.map((fabric, idx) => (
          <div
            key={idx}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#f5f5f7] rounded-3xl p-6 sm:p-10 border border-[#e5e5ea]/60"
          >
            {/* Visual */}
            <div className="lg:col-span-5 relative aspect-[4/3] rounded-2xl overflow-hidden bg-white shadow-xs">
              <Image
                src={fabric.image}
                alt={fabric.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Details */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#86868b]">
                <span className="font-medium text-[#1d1d1f] bg-white px-2.5 py-0.5 rounded-full border border-[#e5e5ea]">
                  {fabric.spec}
                </span>
                <span>·</span>
                <span>{fabric.origin}</span>
              </div>

              <h2 className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">
                {fabric.name}
              </h2>

              <p className="text-sm text-[#515154] leading-relaxed">
                {fabric.description}
              </p>

              <div className="pt-2 border-t border-[#e5e5ea] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-[#86868b] block text-[11px]">Certification</span>
                  <span className="font-medium text-[#1d1d1f]">{fabric.certification}</span>
                </div>

                <div>
                  <span className="text-[#86868b] block text-[11px]">Found in</span>
                  <span className="text-[#515154]">{fabric.garments.join(", ")}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sustainable Standards Banner — Clean Typographic Indexing */}
      <div className="mt-16 sm:mt-24 p-8 sm:p-12 bg-white rounded-3xl border border-[#e5e5ea] grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-2">
          <span className="text-xs font-semibold text-[#86868b] block">
            01 / Standard
          </span>
          <h3 className="text-sm font-semibold text-[#1d1d1f]">Zero Synthetic Blends</h3>
          <p className="text-xs text-[#86868b] leading-relaxed">
            All woven outer garments are composed of 100% natural, biodegradable fibers designed for end-of-life circularity.
          </p>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-semibold text-[#86868b] block">
            02 / Standard
          </span>
          <h3 className="text-sm font-semibold text-[#1d1d1f]">Traceable Provenance</h3>
          <p className="text-xs text-[#86868b] leading-relaxed">
            Every textile batch carries verified chain-of-custody documentation tracing back to individual farms and mills.
          </p>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-semibold text-[#86868b] block">
            03 / Standard
          </span>
          <h3 className="text-sm font-semibold text-[#1d1d1f]">Lifetime Repair Focus</h3>
          <p className="text-xs text-[#86868b] leading-relaxed">
            Generous inner seam allowances and reinforced stitching allow garments to be tailored and repaired indefinitely.
          </p>
        </div>
      </div>

      {/* Bottom Link to Shop */}
      <div className="mt-16 text-center">
        <Link
          href="/shop"
          className="inline-flex items-center bg-[#1d1d1f] hover:bg-black text-white text-xs font-medium px-6 py-3 rounded-full transition-colors"
        >
          Explore garments made with these textiles
        </Link>
      </div>
    </div>
  );
}
