import fs from "node:fs";
import path from "node:path";
import { loadCatalogProducts } from "../e2e/helpers/catalog.ts";

const PROJECT_ROOT = path.resolve(import.meta.dirname, "../../");
const APP_SERVER_DIR = path.join(PROJECT_ROOT, ".next", "server", "app");
const STATIC_CHUNKS_DIR = path.join(PROJECT_ROOT, ".next", "static", "chunks");

interface HtmlValidationResult {
  file: string;
  size: number;
  hasDoctype: boolean;
  hasTitle: boolean;
  titleText: string;
  hasErrorStrings: boolean;
  foundErrors: string[];
  hasExpectedImages: boolean;
  foundImages: string[];
  hasExpectedProductTitle: boolean;
}

const ERROR_PATTERNS = [
  "Minified React error",
  "hydration-error",
  "Hydration failed",
  "Text content does not match server-rendered HTML",
  "There was an error while hydrating",
  "An error occurred in the Server Components render",
  "Unhandled Runtime Error",
  "ReferenceError",
  "TypeError",
  "SyntaxError",
];

async function run() {
  console.log("=== CHALLENGER TASK 1: SSR / SSG PRE-RENDERED HTML VERIFICATION ===");
  console.log(`Checking directory: ${APP_SERVER_DIR}\n`);

  if (!fs.existsSync(APP_SERVER_DIR)) {
    console.error(`ERROR: .next/server/app does not exist! Run pnpm build first.`);
    process.exit(1);
  }

  const catalog = loadCatalogProducts();
  console.log(`Loaded ${catalog.length} products from catalog.`);

  const expectedHtmlFiles = [
    "_global-error.html",
    "_not-found.html",
    "index.html",
    "materials.html",
    "philosophy.html",
    "shop.html",
    ...catalog.map((p) => path.join("product", `${p.slug}.html`)),
  ];

  console.log(`Total HTML files to inspect in .next/server/app: ${expectedHtmlFiles.length}`);

  const results: HtmlValidationResult[] = [];
  let failures = 0;

  for (const relPath of expectedHtmlFiles) {
    const fullPath = path.join(APP_SERVER_DIR, relPath);
    if (!fs.existsSync(fullPath)) {
      console.error(`❌ MISSING HTML FILE: ${relPath}`);
      failures++;
      continue;
    }

    const content = fs.readFileSync(fullPath, "utf8");
    const stat = fs.statSync(fullPath);

    const hasDoctype = content.includes("<!DOCTYPE html>") || content.includes("<!doctype html>");
    const titleMatch = content.match(/<title[^>]*>([^<]*)<\/title>/i);
    const hasTitle = Boolean(titleMatch);
    const titleText = titleMatch ? titleMatch[1] : "";

    const foundErrors = ERROR_PATTERNS.filter((err) => content.includes(err));
    const hasErrorStrings = foundErrors.length > 0;

    // Check images in HTML or client bundle script
    const imgMatches = content.match(/\/images\/(products\/[a-z0-9-]+\/look-[12]|hero\/hero-[a-z]+|materials\/[a-z0-9-]+|philosophy\/[a-z0-9-]+)\.png/g) || [];
    const encodedImgMatches = content.match(/images%2F(products%2F[a-z0-9-]+%2Flook-[12]|hero%2Fhero-[a-z]+|materials%2F[a-z0-9-]+|philosophy%2F[a-z0-9-]+)\.png/g) || [];
    let allFoundImages = Array.from(new Set([...imgMatches, ...encodedImgMatches]));

    let hasExpectedProductTitle = true;
    let hasExpectedImages = true;

    if (relPath.startsWith("product/")) {
      const slug = path.basename(relPath, ".html");
      const prod = catalog.find((p) => p.slug === slug);
      if (prod) {
        hasExpectedProductTitle = content.includes(prod.name) || titleText.includes(prod.name);
        const expectedLook1 = `${slug}/look-1.png`;
        const expectedLook2 = `${slug}/look-2.png`;
        const look1Present = content.includes(expectedLook1) || content.includes(encodeURIComponent(expectedLook1));
        const look2Present = content.includes(expectedLook2) || content.includes(encodeURIComponent(expectedLook2));
        hasExpectedImages = look1Present && look2Present;
      }
    } else if (relPath === "index.html") {
      hasExpectedImages =
        allFoundImages.length > 0 &&
        (content.includes("hero-tailored.png") || content.includes(encodeURIComponent("hero-tailored.png"))) &&
        (content.includes("hero-knitwear.png") || content.includes(encodeURIComponent("hero-knitwear.png")));
    } else if (relPath === "materials.html") {
      hasExpectedImages =
        content.includes("italian-virgin-wool.png") &&
        content.includes("sandwashed-mulberry-silk.png") &&
        content.includes("brushed-baby-mohair.png") &&
        content.includes("french-full-grain-nappa.png");
    } else if (relPath === "philosophy.html") {
      hasExpectedImages = content.includes("design-studio.png");
    } else if (relPath === "shop.html") {
      // In shop.html, useSearchParams causes client component bailout to suspense fallback.
      // We check both the fallback shell AND the referenced client JS script chunks.
      const scriptMatches = content.match(/\/static\/chunks\/[a-z0-9_-]+\.js/g) || [];
      for (const sm of scriptMatches) {
        const chunkFileName = path.basename(sm);
        const chunkPath = path.join(STATIC_CHUNKS_DIR, chunkFileName);
        if (fs.existsSync(chunkPath)) {
          const chunkCode = fs.readFileSync(chunkPath, "utf8");
          const matches = chunkCode.match(/\/images\/products\/[a-z0-9-]+\/look-[12]\.png/g) || [];
          if (matches.length > 0) {
            allFoundImages = Array.from(new Set([...allFoundImages, ...matches]));
          }
        }
      }
      hasExpectedImages = allFoundImages.length >= 24; // all 24 product images are bundled
    }

    const isOk =
      stat.size > 0 &&
      (relPath === "_global-error.html" || hasTitle) &&
      !hasErrorStrings &&
      hasExpectedImages &&
      hasExpectedProductTitle;

    if (!isOk) {
      failures++;
      console.error(`❌ FAIL: ${relPath}`);
      if (stat.size === 0) console.error(`  - Empty file`);
      if (!hasTitle) console.error(`  - Missing <title> tag`);
      if (hasErrorStrings) console.error(`  - Found error strings: ${foundErrors.join(", ")}`);
      if (!hasExpectedImages) console.error(`  - Missing expected local images (found: ${allFoundImages.length})`);
      if (!hasExpectedProductTitle) console.error(`  - Missing product title`);
    } else {
      console.log(
        `✓ OK: ${relPath.padEnd(46)} | Size: ${stat.size.toString().padStart(6)}B | Title: "${titleText.slice(0, 30)}..." | Images: ${allFoundImages.length}`
      );
    }

    results.push({
      file: relPath,
      size: stat.size,
      hasDoctype,
      hasTitle,
      titleText,
      hasErrorStrings,
      foundErrors,
      hasExpectedImages,
      foundImages: allFoundImages,
      hasExpectedProductTitle,
    });
  }

  // Favicon check
  const faviconBodyPath = path.join(APP_SERVER_DIR, "favicon.ico.body");
  const hasFaviconBody = fs.existsSync(faviconBodyPath);
  console.log(`\nFavicon static artifact check (.next/server/app/favicon.ico.body):`);
  if (hasFaviconBody) {
    const faviconStat = fs.statSync(faviconBodyPath);
    console.log(`✓ OK: favicon.ico.body exists | Size: ${faviconStat.size}B`);
  } else {
    console.warn(`⚠️ Note: favicon.ico.body not found`);
    failures++;
  }

  console.log("\n------------------------------------------------------");
  console.log(`Summary: ${results.length} files checked, ${results.length - failures} passed, ${failures} failed.`);
  console.log("------------------------------------------------------\n");

  if (failures > 0) {
    process.exit(1);
  }
}

run().catch((err) => {
  console.error("Task 1 error:", err);
  process.exit(1);
});
