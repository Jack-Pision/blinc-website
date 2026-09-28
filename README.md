# BLINC — 2026 Concept Wardrobe

An avant-garde online luxury fashion concept built with **Next.js 16 (App Router)**, **React 19**, and **Tailwind CSS v4**.

Designed through the lens of **Tactile Brutalism × Quiet Luxury**, faithfully translating the aesthetic principles of high-fashion editorial print lookbooks to the web.

---

## Key Features

- **3 Full Pages**:
  - **Editorial Flagship (`/`)**: Asymmetric trapezoid collage hero ("OUR LATEST OFFERINGS"), "OUR PRODUCT" interactive catalog, "PERFECT MATCH" lifestyle section with live metrics counter, "BLINC ACCENTS" capsule spotlight, "RECOMMENDATION" row, and the monumental "BEYOND BOUNDARIES" statement marquee.
  - **Full Catalog (`/shop`)**: Complete 12-product wardrobe with gender filtering (Women, Men, Unisex), category filtering, price sorting, and a 2-column vs. 4-column density switcher.
  - **Editorial Product Detail (`/product/[slug]`)**: Multi-angle studio gallery, sticky architectural spec rail, proportion selector, GSM/provenance specs, interactive accordion tabs, and "STYLE WITH" curated companion recommendations. All 12 product pages are statically generated with Next.js SSG (`generateStaticParams`).
- **Interactive Global Systems**:
  - Slide-over Shopping Bag drawer with real-time quantity adjustments, free shipping progress bar, and simulated secure checkout.
  - Quick-View modal for rapid inspection from any grid card.
  - Live currency switcher (`USD $`, `EUR €`, `GBP £`, `JPY ¥`) with real-time price conversion.
  - Bespoke `<BrutalistAsterisk />` 8-point geometric starburst motif.

---

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint
```

For full architectural breakdown, design research, and 2026 fashion trend analysis, see [`docs/RESEARCH_AND_IMPLEMENTATION_GUIDE.md`](./docs/RESEARCH_AND_IMPLEMENTATION_GUIDE.md).
