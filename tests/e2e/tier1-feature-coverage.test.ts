import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  EXPECTED_PRODUCTS,
  PRODUCTS_ASSET_DIR,
  PUBLIC_DIR,
  EXPECTED_SITE_IMAGES,
  MIN_IMAGE_SIZE_BYTES,
} from "./helpers/test-utils.ts";
import { inspectPngFile } from "./helpers/png-parser.ts";
import { loadCatalogProducts } from "./helpers/catalog.ts";
import type { ParsedProduct } from "./helpers/catalog.ts";

describe("Tier 1: Feature Coverage (Asset Generation & Catalog Mapping)", () => {
  let catalogProducts: ParsedProduct[];

  try {
    catalogProducts = loadCatalogProducts();
  } catch {
    catalogProducts = [];
  }

  describe("Global Catalog Structural Assertions", () => {
    it("should export an array of exactly 12 products in src/data/products.ts", () => {
      assert.strictEqual(
        catalogProducts.length,
        12,
        `Expected exactly 12 products in catalog, but found ${catalogProducts.length}`
      );
    });

    it("should contain all 12 expected product IDs from blinc-01 to blinc-12", () => {
      const catalogIds = new Set(catalogProducts.map((p) => p.id));
      for (const expected of EXPECTED_PRODUCTS) {
        assert.ok(
          catalogIds.has(expected.id),
          `Missing expected product ID: ${expected.id} (${expected.slug})`
        );
      }
    });

    it("should contain all 12 expected URL slugs with correct kebab-casing", () => {
      const catalogSlugs = new Set(catalogProducts.map((p) => p.slug));
      for (const expected of EXPECTED_PRODUCTS) {
        assert.ok(
          catalogSlugs.has(expected.slug),
          `Missing expected slug in catalog: ${expected.slug}`
        );
      }
    });

    it("should ensure all products have unique IDs and unique slugs", () => {
      const ids = catalogProducts.map((p) => p.id);
      const slugs = catalogProducts.map((p) => p.slug);
      assert.strictEqual(new Set(ids).size, ids.length, "Duplicate product IDs found in catalog");
      assert.strictEqual(new Set(slugs).size, slugs.length, "Duplicate product slugs found in catalog");
    });
  });

  // Exhaustive per-garment test suites (12 garments x 7+ assertions each)
  for (const spec of EXPECTED_PRODUCTS) {
    describe(`Garment [${spec.id}] ${spec.name} (${spec.slug}) [${spec.milestone}]`, () => {
      const productDir = path.join(PRODUCTS_ASSET_DIR, spec.slug);
      const look1Path = path.join(productDir, "look-1.png");
      const look2Path = path.join(productDir, "look-2.png");
      const catalogEntry = catalogProducts.find((p) => p.slug === spec.slug || p.id === spec.id);

      it(`[F01-F12] product folder exists at public/images/products/${spec.slug}`, () => {
        assert.ok(
          fs.existsSync(productDir),
          `Asset directory does not exist: ${productDir}`
        );
        const stat = fs.statSync(productDir);
        assert.ok(stat.isDirectory(), `Asset path is not a directory: ${productDir}`);
      });

      it(`look-1.png exists for ${spec.slug}`, () => {
        assert.ok(
          fs.existsSync(look1Path),
          `look-1.png missing for ${spec.slug} at ${look1Path}`
        );
      });

      it(`look-2.png exists for ${spec.slug}`, () => {
        assert.ok(
          fs.existsSync(look2Path),
          `look-2.png missing for ${spec.slug} at ${look2Path}`
        );
      });

      it(`look-1.png size exceeds 50KB for ${spec.slug}`, () => {
        assert.ok(fs.existsSync(look1Path), `look-1.png missing: ${look1Path}`);
        const stat = fs.statSync(look1Path);
        assert.ok(
          stat.size >= MIN_IMAGE_SIZE_BYTES,
          `look-1.png size (${stat.size} bytes) is below minimum threshold of ${MIN_IMAGE_SIZE_BYTES} bytes (>50KB)`
        );
      });

      it(`look-2.png size exceeds 50KB for ${spec.slug}`, () => {
        assert.ok(fs.existsSync(look2Path), `look-2.png missing: ${look2Path}`);
        const stat = fs.statSync(look2Path);
        assert.ok(
          stat.size >= MIN_IMAGE_SIZE_BYTES,
          `look-2.png size (${stat.size} bytes) is below minimum threshold of ${MIN_IMAGE_SIZE_BYTES} bytes (>50KB)`
        );
      });

      it(`look-1.png has readable binary header and valid image structure`, () => {
        const result = inspectPngFile(look1Path);
        assert.ok(result.exists, `File does not exist: ${look1Path}`);
        assert.ok(result.info.valid, `Invalid PNG structure in look-1.png: ${result.info.error}`);
        assert.ok(result.info.width > 0, `Width must be > 0, got ${result.info.width}`);
        assert.ok(result.info.height > 0, `Height must be > 0, got ${result.info.height}`);
      });

      it(`look-2.png has readable binary header and valid image structure`, () => {
        const result = inspectPngFile(look2Path);
        assert.ok(result.exists, `File does not exist: ${look2Path}`);
        assert.ok(result.info.valid, `Invalid PNG structure in look-2.png: ${result.info.error}`);
        assert.ok(result.info.width > 0, `Width must be > 0, got ${result.info.width}`);
        assert.ok(result.info.height > 0, `Height must be > 0, got ${result.info.height}`);
      });

      it(`catalog entry exists and has at least 2 images for ${spec.slug}`, () => {
        assert.ok(catalogEntry, `Product ${spec.slug} not found in catalog`);
        assert.ok(
          Array.isArray(catalogEntry.images),
          `product.images is not an array for ${spec.slug}`
        );
        assert.ok(
          catalogEntry.images.length >= 2,
          `Expected >= 2 images for ${spec.slug}, got ${catalogEntry.images.length}`
        );
      });

      it(`catalog images[0] references local /images/products/${spec.slug}/look-1.png`, () => {
        assert.ok(catalogEntry, `Product ${spec.slug} not found in catalog`);
        const expectedPath = `/images/products/${spec.slug}/look-1.png`;
        assert.strictEqual(
          catalogEntry.images[0],
          expectedPath,
          `images[0] in catalog is "${catalogEntry.images[0]}", expected "${expectedPath}"`
        );
      });

      it(`catalog images[1] references local /images/products/${spec.slug}/look-2.png`, () => {
        assert.ok(catalogEntry, `Product ${spec.slug} not found in catalog`);
        const expectedPath = `/images/products/${spec.slug}/look-2.png`;
        assert.strictEqual(
          catalogEntry.images[1],
          expectedPath,
          `images[1] in catalog is "${catalogEntry.images[1]}", expected "${expectedPath}"`
        );
      });
    });
  }

  describe("Site Editorial & Material Asset Coverage (Mockup Replacements)", () => {
    for (const siteImg of EXPECTED_SITE_IMAGES) {
      it(`site asset ${siteImg.relPath} exists, >50KB, and has valid PNG header`, () => {
        const fullPath = path.join(PUBLIC_DIR, siteImg.relPath);
        assert.ok(fs.existsSync(fullPath), `Missing site asset: ${siteImg.relPath}`);

        const stat = fs.statSync(fullPath);
        assert.ok(
          stat.size >= MIN_IMAGE_SIZE_BYTES,
          `File ${siteImg.relPath} is under 50KB (${stat.size} bytes)`
        );

        const result = inspectPngFile(fullPath);
        assert.ok(result.exists, `File does not exist: ${siteImg.relPath}`);
        assert.ok(result.info.valid, `Invalid PNG structure in ${siteImg.relPath}: ${result.info.error}`);
        assert.ok(result.info.width > 0, `Width must be > 0 in ${siteImg.relPath}`);
        assert.ok(result.info.height > 0, `Height must be > 0 in ${siteImg.relPath}`);
      });
    }

    it("homepage src/app/page.tsx references local hero-tailored.png and hero-knitwear.png", () => {
      const pagePath = path.join(PUBLIC_DIR, "../src/app/page.tsx");
      const content = fs.readFileSync(pagePath, "utf8");
      assert.ok(content.includes("/images/hero/hero-tailored.png"), "Missing hero-tailored.png reference in page.tsx");
      assert.ok(content.includes("/images/hero/hero-knitwear.png"), "Missing hero-knitwear.png reference in page.tsx");
      assert.ok(!content.includes("images.unsplash.com"), "Found residual unsplash URL in page.tsx");
    });

    it("materials page src/app/materials/page.tsx references all 4 local material images", () => {
      const pagePath = path.join(PUBLIC_DIR, "../src/app/materials/page.tsx");
      const content = fs.readFileSync(pagePath, "utf8");
      assert.ok(content.includes("/images/materials/italian-virgin-wool.png"));
      assert.ok(content.includes("/images/materials/sandwashed-mulberry-silk.png"));
      assert.ok(content.includes("/images/materials/brushed-baby-mohair.png"));
      assert.ok(content.includes("/images/materials/french-full-grain-nappa.png"));
      assert.ok(!content.includes("images.unsplash.com"), "Found residual unsplash URL in materials/page.tsx");
    });

    it("philosophy page src/app/philosophy/page.tsx references local design-studio.png", () => {
      const pagePath = path.join(PUBLIC_DIR, "../src/app/philosophy/page.tsx");
      const content = fs.readFileSync(pagePath, "utf8");
      assert.ok(content.includes("/images/philosophy/design-studio.png"));
      assert.ok(!content.includes("images.unsplash.com"), "Found residual unsplash URL in philosophy/page.tsx");
    });
  });
});

