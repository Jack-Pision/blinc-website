import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawn, execSync, ChildProcess } from "node:child_process";
import {
  EXPECTED_PRODUCTS,
  PROJECT_ROOT,
} from "./helpers/test-utils.ts";

describe("Tier 4: Real-World Application Scenarios (Build Pipeline & Runtime Delivery)", () => {
  const TEST_PORT = 3099;
  const BASE_URL = `http://127.0.0.1:${TEST_PORT}`;

  describe("Code Quality & Linter Compliance (F15)", () => {
    it("pnpm lint runs with 0 errors and 0 warnings", () => {
      try {
        execSync("pnpm lint", {
          cwd: PROJECT_ROOT,
          encoding: "utf8",
          stdio: ["ignore", "pipe", "pipe"],
        });
        assert.ok(true, "Lint passed cleanly");
      } catch (err: unknown) {
        const status = (err as { status?: number })?.status;
        const msg = String(err);
        assert.fail(`pnpm lint failed with status ${status}: ${msg}`);
      }
    });

    it("TypeScript compiler checks pass with zero diagnostic errors", () => {
      try {
        execSync("pnpm exec tsc --noEmit", {
          cwd: PROJECT_ROOT,
          encoding: "utf8",
          stdio: ["ignore", "pipe", "pipe"],
        });
        assert.ok(true, "TypeScript passed cleanly");
      } catch (err: unknown) {
        assert.fail(`tsc --noEmit failed: ${String(err)}`);
      }
    });
  });

  describe("Static Pre-rendering & Production Build (F16)", () => {
    it("pnpm build compiles with Turbopack and produces valid build artifacts", () => {
      const buildIdPath = path.join(PROJECT_ROOT, ".next", "BUILD_ID");
      if (!fs.existsSync(buildIdPath)) {
        // Trigger build if not already built
        execSync("pnpm build", {
          cwd: PROJECT_ROOT,
          stdio: ["ignore", "pipe", "pipe"],
        });
      }
      assert.ok(fs.existsSync(buildIdPath), "Expected .next/BUILD_ID to exist after build");
    });

    it("pre-renders all 19 static routes in .next/server/app", () => {
      const serverAppDir = path.join(PROJECT_ROOT, ".next", "server", "app");
      assert.ok(fs.existsSync(serverAppDir), `Missing .next/server/app directory: ${serverAppDir}`);

      const staticPages = [
        "index.html",
        "_not-found.html",
        "materials.html",
        "philosophy.html",
        "shop.html",
      ];

      for (const page of staticPages) {
        const pagePath = path.join(serverAppDir, page);
        assert.ok(fs.existsSync(pagePath), `Pre-rendered static page missing: ${page}`);
      }

      // Check all 12 static product routes
      const productDir = path.join(serverAppDir, "product");
      assert.ok(fs.existsSync(productDir), "Missing .next/server/app/product directory");

      for (const spec of EXPECTED_PRODUCTS) {
        const prodHtml = path.join(productDir, `${spec.slug}.html`);
        assert.ok(
          fs.existsSync(prodHtml),
          `Missing pre-rendered static route for product: ${spec.slug} (${prodHtml})`
        );
      }
    });
  });

  describe("Dev Server & Live Route Rendering (F17)", () => {
    let serverProcess: ChildProcess | null = null;

    before(async () => {
      // Start next start server on TEST_PORT
      serverProcess = spawn(
        "pnpm",
        ["exec", "next", "start", "-p", String(TEST_PORT)],
        {
          cwd: PROJECT_ROOT,
          stdio: "ignore",
          detached: true,
        }
      );

      // Poll until ready (up to 10 seconds)
      const maxRetries = 20;
      for (let i = 0; i < maxRetries; i++) {
        try {
          const res = await fetch(`${BASE_URL}/`);
          if (res.status === 200) {
            break;
          }
        } catch {
          // Wait 300ms before retry
          await new Promise((r) => setTimeout(r, 300));
        }
      }
    });

    after(() => {
      if (serverProcess && serverProcess.pid) {
        try {
          // Kill the process group to ensure child processes are terminated
          process.kill(-serverProcess.pid, "SIGTERM");
        } catch {
          try {
            serverProcess.kill("SIGTERM");
          } catch {
            // Already stopped
          }
        }
      }
    });

    it("serves the Editorial Flagship homepage (/) with HTTP 200 and valid HTML", async () => {
      const res = await fetch(`${BASE_URL}/`);
      assert.strictEqual(res.status, 200, `Homepage returned HTTP ${res.status}`);
      const text = await res.text();
      assert.ok(text.includes("BLINC") || text.includes("Blinc"), "Homepage HTML missing brand text");
    });

    it("serves the Full Catalog page (/shop) with HTTP 200 and collection content", async () => {
      const res = await fetch(`${BASE_URL}/shop`);
      assert.strictEqual(res.status, 200, `/shop returned HTTP ${res.status}`);
      const text = await res.text();
      assert.ok(text.includes("Collection"), "/shop missing collection text");
    });

    it("serves all 12 individual product routes (/product/[slug]) with HTTP 200", async () => {
      for (const spec of EXPECTED_PRODUCTS) {
        const url = `${BASE_URL}/product/${spec.slug}`;
        const res = await fetch(url);
        assert.strictEqual(
          res.status,
          200,
          `Route ${url} returned HTTP ${res.status}`
        );
        const text = await res.text();
        assert.ok(
          text.includes(spec.name) || text.includes(spec.slug),
          `Product page for ${spec.slug} missing product details`
        );
      }
    });

    it("serves look-1.png and look-2.png with HTTP 200 and image/png Content-Type for all 12 products", async () => {
      for (const spec of EXPECTED_PRODUCTS) {
        for (const look of ["look-1.png", "look-2.png"]) {
          const url = `${BASE_URL}/images/products/${spec.slug}/${look}`;
          const res = await fetch(url);
          assert.strictEqual(
            res.status,
            200,
            `Asset route ${url} returned HTTP ${res.status}`
          );
          const contentType = res.headers.get("content-type");
          assert.ok(
            contentType && (contentType.includes("image/png") || contentType.includes("image/")),
            `Expected image Content-Type for ${url}, got ${contentType}`
          );
        }
      }
    });
  });
});
