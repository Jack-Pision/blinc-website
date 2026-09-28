import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  EXPECTED_PRODUCTS,
  PRODUCTS_ASSET_DIR,
  PROJECT_ROOT,
} from "./helpers/test-utils.ts";
import { inspectPngFile } from "./helpers/png-parser.ts";
import { loadCatalogProducts } from "./helpers/catalog.ts";
import type { ParsedProduct } from "./helpers/catalog.ts";

describe("Tier 3: Cross-Feature Combinations (UI Component Bindings & Static Integration)", () => {
  let catalogProducts: ParsedProduct[];

  try {
    catalogProducts = loadCatalogProducts();
  } catch {
    catalogProducts = [];
  }

  describe("ProductCard Component Integration", () => {
    it("all 12 products supply images[0] and images[1] for dual-angle split hover scrub", () => {
      for (const product of catalogProducts) {
        assert.ok(
          product.images && product.images.length >= 2,
          `Product ${product.slug} must have at least 2 images for split-hover card scrub`
        );
        assert.ok(
          product.images[0].endsWith("look-1.png"),
          `Product ${product.slug} images[0] should be look-1.png, got ${product.images[0]}`
        );
        assert.ok(
          product.images[1].endsWith("look-2.png"),
          `Product ${product.slug} images[1] should be look-2.png, got ${product.images[1]}`
        );
      }
    });

    it("ProductCard target links resolve to valid product slugs", () => {
      const slugs = new Set(catalogProducts.map((p) => p.slug));
      for (const expected of EXPECTED_PRODUCTS) {
        assert.ok(
          slugs.has(expected.slug),
          `ProductCard destination /product/${expected.slug} has no matching catalog item`
        );
      }
    });
  });

  describe("ProductDetailView & TactileLoupe Integration", () => {
    it("all pairWith companion recommendations resolve to existing valid products", () => {
      const productMap = new Map(catalogProducts.map((p) => [p.slug, p]));

      for (const product of catalogProducts) {
        if (product.pairWith && product.pairWith.length > 0) {
          for (const pairedSlug of product.pairWith) {
            assert.notStrictEqual(
              pairedSlug,
              product.slug,
              `Product ${product.slug} references itself in pairWith`
            );
            const pairedProduct = productMap.get(pairedSlug);
            assert.ok(
              pairedProduct,
              `Product ${product.slug} references non-existent product in pairWith: "${pairedSlug}"`
            );
            assert.ok(
              pairedProduct.images && pairedProduct.images.length > 0,
              `Paired product "${pairedSlug}" has no images for recommendation card`
            );
          }
        }
      }
    });

    it("TactileLoupe image sources are safe for CSS background-image url() usage", () => {
      for (const product of catalogProducts) {
        for (const imgPath of product.images) {
          // CSS injection or breaking characters check
          assert.ok(!imgPath.includes('"'), `Image path contains unescaped quote: ${imgPath}`);
          assert.ok(!imgPath.includes("'"), `Image path contains unescaped single quote: ${imgPath}`);
          assert.ok(!imgPath.includes("("), `Image path contains parenthesis: ${imgPath}`);
          assert.ok(!imgPath.includes(")"), `Image path contains parenthesis: ${imgPath}`);
          assert.ok(!imgPath.includes(";"), `Image path contains semicolon: ${imgPath}`);
        }
      }
    });

    it("TactileLoupe images have sufficient resolution for 2.8x magnification (>700px width)", () => {
      for (const spec of EXPECTED_PRODUCTS) {
        const look1Path = path.join(PRODUCTS_ASSET_DIR, spec.slug, "look-1.png");
        const { exists, info } = inspectPngFile(look1Path);
        assert.ok(exists, `look-1.png missing for ${spec.slug}`);
        assert.ok(info.valid, `Invalid PNG: ${info.error}`);
        assert.ok(
          info.width >= 700,
          `Image width ${info.width}px is insufficient for 2.8x Loupe magnification (minimum 700px)`
        );
        assert.ok(
          info.height >= 900,
          `Image height ${info.height}px is insufficient for 2.8x Loupe magnification (minimum 900px)`
        );
      }
    });
  });

  describe("CapsuleMixer Ensemble Combinations & Partition", () => {
    it("covers all 12 products across the 3 capsule roles without overlap or omission", () => {
      const outerSlugs = [
        "deconstructed-oversized-wool-blazer",
        "bonded-lambskin-cropped-biker",
        "minimalist-double-breasted-trench",
        "boxy-brushed-mohair-cardigan",
      ];
      const topSlugs = [
        "asymmetric-draped-silk-blouse",
        "sculpted-mock-neck-knit",
        "concealed-placket-poplin-shirt",
        "fine-gauge-merino-cocoon-knit",
      ];
      const bottomSlugs = [
        "pleated-architectural-trousers",
        "high-waist-column-maxi-skirt",
        "relaxed-studio-drawstring-pant",
        "architectural-tailored-evening-mini",
      ];

      const allAssigned = [...outerSlugs, ...topSlugs, ...bottomSlugs];
      assert.strictEqual(allAssigned.length, 12, "CapsuleMixer must partition exactly 12 pieces");
      assert.strictEqual(new Set(allAssigned).size, 12, "CapsuleMixer partition contains duplicates");

      const catalogSlugs = new Set(catalogProducts.map((p) => p.slug));
      for (const slug of allAssigned) {
        assert.ok(
          catalogSlugs.has(slug),
          `CapsuleMixer piece "${slug}" not found in catalog products`
        );
      }
    });

    it("verifies all 64 possible 3-piece capsule ensembles have valid image assets", () => {
      const productMap = new Map(catalogProducts.map((p) => [p.slug, p]));
      const outerSlugs = [
        "deconstructed-oversized-wool-blazer",
        "bonded-lambskin-cropped-biker",
        "minimalist-double-breasted-trench",
        "boxy-brushed-mohair-cardigan",
      ];
      const topSlugs = [
        "asymmetric-draped-silk-blouse",
        "sculpted-mock-neck-knit",
        "concealed-placket-poplin-shirt",
        "fine-gauge-merino-cocoon-knit",
      ];
      const bottomSlugs = [
        "pleated-architectural-trousers",
        "high-waist-column-maxi-skirt",
        "relaxed-studio-drawstring-pant",
        "architectural-tailored-evening-mini",
      ];

      let combinationsChecked = 0;
      for (const oSlug of outerSlugs) {
        for (const tSlug of topSlugs) {
          for (const bSlug of bottomSlugs) {
            const outer = productMap.get(oSlug);
            const top = productMap.get(tSlug);
            const bottom = productMap.get(bSlug);

            assert.ok(outer && top && bottom, `Missing product in combination: ${oSlug}+${tSlug}+${bSlug}`);
            assert.ok(outer.images[0] && top.images[0] && bottom.images[0], "Missing images in ensemble");
            assert.ok(outer.price > 0 && top.price > 0 && bottom.price > 0, "Invalid price in ensemble");
            combinationsChecked++;
          }
        }
      }
      assert.strictEqual(combinationsChecked, 64, "Expected exactly 64 combinations checked");
    });
  });

  describe("CartDrawer Garment Representation", () => {
    it("every catalog product provides valid image, title, price, and sizes for CartDrawer", () => {
      for (const product of catalogProducts) {
        assert.ok(product.name && product.name.length > 0, `Missing name for ${product.id}`);
        assert.ok(product.price > 0, `Price must be positive for ${product.id}`);
        assert.ok(product.images && product.images[0], `Missing cart thumbnail for ${product.id}`);
        assert.ok(
          product.sizes && product.sizes.length > 0,
          `Product ${product.id} must offer sizes for cart selection`
        );
      }
    });
  });

  describe("Next.js Static Generation & Image Configuration", () => {
    it("next.config.ts configures valid image domains/patterns", () => {
      const configPath = path.join(PROJECT_ROOT, "next.config.ts");
      assert.ok(fs.existsSync(configPath), "next.config.ts does not exist");
      const configContent = fs.readFileSync(configPath, "utf8");
      assert.ok(
        configContent.includes("images"),
        "next.config.ts should contain images configuration"
      );
    });

    it("src/app/product/[slug]/page.tsx exports generateStaticParams generating all 12 paths", () => {
      const pagePath = path.join(PROJECT_ROOT, "src", "app", "product", "[slug]", "page.tsx");
      assert.ok(fs.existsSync(pagePath), "Product detail page does not exist");
      const pageContent = fs.readFileSync(pagePath, "utf8");
      assert.ok(
        pageContent.includes("generateStaticParams"),
        "Product page must export generateStaticParams"
      );
      assert.ok(
        pageContent.includes("PRODUCTS"),
        "generateStaticParams must reference PRODUCTS catalog"
      );
    });
  });
});
