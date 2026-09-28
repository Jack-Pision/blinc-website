import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  EXPECTED_PRODUCTS,
  PRODUCTS_ASSET_DIR,
  PUBLIC_DIR,
  TARGET_ASPECT_RATIO,
  ASPECT_RATIO_TOLERANCE,
} from "./helpers/test-utils.ts";
import { inspectPngFile } from "./helpers/png-parser.ts";
import { loadCatalogProducts } from "./helpers/catalog.ts";
import type { ParsedProduct } from "./helpers/catalog.ts";

describe("Tier 2: Boundary & Corner Cases (Asset Integrity & Format Verification)", () => {
  const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const FORBIDDEN_SIGNATURES = [
    { name: "HTML/DOCTYPE", bytes: Buffer.from("<!DOCTYPE", "ascii") },
    { name: "JSON Error", bytes: Buffer.from('{"error', "ascii") },
    { name: "JPEG", bytes: Buffer.from([0xff, 0xd8, 0xff]) },
    { name: "GIF", bytes: Buffer.from("GIF8", "ascii") },
  ];

  describe("Aspect Ratio Boundary Tests (Strict 3:4 Luxury Editorial Ratio)", () => {
    for (const spec of EXPECTED_PRODUCTS) {
      const productDir = path.join(PRODUCTS_ASSET_DIR, spec.slug);

      it(`look-1.png for ${spec.slug} conforms to 3:4 aspect ratio (0.75 ± ${ASPECT_RATIO_TOLERANCE})`, () => {
        const filePath = path.join(productDir, "look-1.png");
        const { exists, info } = inspectPngFile(filePath);
        assert.ok(exists, `look-1.png missing for ${spec.slug}`);
        assert.ok(info.valid, `look-1.png invalid: ${info.error}`);
        assert.ok(info.height > info.width, `Image must be vertical/portrait orientation (height > width)`);
        
        const ratioDiff = Math.abs(info.aspectRatio - TARGET_ASPECT_RATIO);
        assert.ok(
          ratioDiff <= ASPECT_RATIO_TOLERANCE,
          `Aspect ratio ${info.aspectRatio.toFixed(3)} (${info.width}x${info.height}) deviates from 3:4 (${TARGET_ASPECT_RATIO}) by ${ratioDiff.toFixed(3)}`
        );
      });

      it(`look-2.png for ${spec.slug} conforms to 3:4 aspect ratio (0.75 ± ${ASPECT_RATIO_TOLERANCE})`, () => {
        const filePath = path.join(productDir, "look-2.png");
        const { exists, info } = inspectPngFile(filePath);
        assert.ok(exists, `look-2.png missing for ${spec.slug}`);
        assert.ok(info.valid, `look-2.png invalid: ${info.error}`);
        assert.ok(info.height > info.width, `Image must be vertical/portrait orientation (height > width)`);
        
        const ratioDiff = Math.abs(info.aspectRatio - TARGET_ASPECT_RATIO);
        assert.ok(
          ratioDiff <= ASPECT_RATIO_TOLERANCE,
          `Aspect ratio ${info.aspectRatio.toFixed(3)} (${info.width}x${info.height}) deviates from 3:4 (${TARGET_ASPECT_RATIO}) by ${ratioDiff.toFixed(3)}`
        );
      });
    }
  });

  describe("Binary Magic Bytes & MIME Type Validation", () => {
    for (const spec of EXPECTED_PRODUCTS) {
      const productDir = path.join(PRODUCTS_ASSET_DIR, spec.slug);

      for (const look of ["look-1.png", "look-2.png"]) {
        const filePath = path.join(productDir, look);

        it(`${spec.slug}/${look} exhibits standard 8-byte PNG magic header`, () => {
          assert.ok(fs.existsSync(filePath), `File missing: ${filePath}`);
          const buf = fs.readFileSync(filePath);
          assert.ok(buf.length >= 8, `File too short: ${buf.length} bytes`);
          assert.deepStrictEqual(
            buf.subarray(0, 8),
            PNG_MAGIC,
            `Header did not match PNG magic signature`
          );
        });

        it(`${spec.slug}/${look} does not contain forbidden signature (HTML error, raw JSON, foreign format)`, () => {
          assert.ok(fs.existsSync(filePath), `File missing: ${filePath}`);
          const buf = fs.readFileSync(filePath);
          for (const forbidden of FORBIDDEN_SIGNATURES) {
            const prefix = buf.subarray(0, forbidden.bytes.length);
            assert.notDeepStrictEqual(
              prefix,
              forbidden.bytes,
              `File starts with forbidden signature: ${forbidden.name}`
            );
          }
        });

        it(`${spec.slug}/${look} uses standard truecolor RGB/RGBA color space`, () => {
          const { exists, info } = inspectPngFile(filePath);
          assert.ok(exists, `File missing: ${filePath}`);
          assert.ok(info.valid, `File invalid: ${info.error}`);
          // ColorType 2 = RGB, 6 = RGBA
          assert.ok(
            info.colorType === 2 || info.colorType === 6,
            `Expected RGB (2) or RGBA (6) color type, got ${info.colorType}`
          );
          assert.ok(
            info.bitDepth === 8 || info.bitDepth === 16,
            `Expected bit depth 8 or 16, got ${info.bitDepth}`
          );
        });
      }
    }
  });

  describe("File Corruption & Truncation Safeguards", () => {
    for (const spec of EXPECTED_PRODUCTS) {
      const productDir = path.join(PRODUCTS_ASSET_DIR, spec.slug);

      for (const look of ["look-1.png", "look-2.png"]) {
        const filePath = path.join(productDir, look);

        it(`${spec.slug}/${look} has valid IEND trailer chunk proving completed write`, () => {
          const { exists, info } = inspectPngFile(filePath);
          assert.ok(exists, `File missing: ${filePath}`);
          assert.ok(info.hasIend, `Missing IEND chunk in ${look} — file may be truncated or incomplete`);
        });

        it(`${spec.slug}/${look} has non-zero positive dimensions (>400px)`, () => {
          const { exists, info } = inspectPngFile(filePath);
          assert.ok(exists, `File missing: ${filePath}`);
          assert.ok(info.width >= 400, `Width too low: ${info.width}px (minimum 400px)`);
          assert.ok(info.height >= 500, `Height too low: ${info.height}px (minimum 500px)`);
        });
      }
    }
  });

  describe("Path Casing, Character Encoding & Boundary Safety", () => {
    it("all 12 product slugs conform strictly to lowercase kebab-case", () => {
      const kebabRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
      for (const spec of EXPECTED_PRODUCTS) {
        assert.match(
          spec.slug,
          kebabRegex,
          `Slug "${spec.slug}" is not strict lowercase kebab-case`
        );
      }
    });

    it("product slugs are URL-safe with no URI encoding mutations", () => {
      for (const spec of EXPECTED_PRODUCTS) {
        assert.strictEqual(
          encodeURIComponent(spec.slug),
          spec.slug,
          `Slug "${spec.slug}" contains characters requiring URI encoding`
        );
      }
    });

    it("public asset directories contain no uppercase letters, spaces, or illegal characters", () => {
      if (fs.existsSync(PRODUCTS_ASSET_DIR)) {
        const entries = fs.readdirSync(PRODUCTS_ASSET_DIR);
        for (const entry of entries) {
          assert.match(
            entry,
            /^[a-z0-9-]+$/,
            `Directory entry "${entry}" in products asset folder has invalid casing or characters`
          );
        }
      }
    });

    it("all catalog image paths prevent path traversal outside public root", () => {
      let catalog: ParsedProduct[] = [];
      try {
        catalog = loadCatalogProducts();
      } catch {
        catalog = [];
      }

      for (const product of catalog) {
        for (const imgPath of product.images) {
          assert.ok(!imgPath.includes(".."), `Image path "${imgPath}" contains traversal token ".."`);
          assert.ok(!imgPath.includes("\\"), `Image path "${imgPath}" contains backslash`);
          assert.ok(
            imgPath.startsWith("/images/products/"),
            `Image path "${imgPath}" does not start with standard "/images/products/" prefix`
          );

          // Resolve disk path
          const diskPath = path.resolve(PUBLIC_DIR, "." + imgPath);
          assert.ok(
            diskPath.startsWith(PUBLIC_DIR),
            `Resolved path "${diskPath}" escapes public root "${PUBLIC_DIR}"`
          );
        }
      }
    });
  });
});
