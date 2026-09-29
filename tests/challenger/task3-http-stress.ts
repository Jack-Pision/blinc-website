import http from "node:http";
import { loadCatalogProducts } from "../e2e/helpers/catalog.ts";

const BASE_URL = "http://localhost:3000";

interface RequestResult {
  url: string;
  method: string;
  statusCode: number;
  durationMs: number;
  contentType: string | null;
  contentLength: number | null;
  error?: string;
}

function doRequest(
  urlStr: string,
  method: string = "GET",
  timeoutMs: number = 8000
): Promise<RequestResult> {
  const start = performance.now();
  const url = new URL(urlStr);

  return new Promise((resolve) => {
    const req = http.request(
      {
        hostname: url.hostname,
        port: url.port || 3000,
        path: url.pathname + url.search,
        method: method,
        timeout: timeoutMs,
        headers: {
          "User-Agent": "Blinc-Challenger-Stress-Runner/1.0",
          Accept: "*/*",
        },
      },
      (res) => {
        let bytes = 0;
        res.on("data", (chunk) => {
          bytes += chunk.length;
        });
        res.on("end", () => {
          const durationMs = Math.round(performance.now() - start);
          resolve({
            url: urlStr,
            method,
            statusCode: res.statusCode || 0,
            durationMs,
            contentType: res.headers["content-type"] || null,
            contentLength: res.headers["content-length"]
              ? parseInt(res.headers["content-length"], 10)
              : bytes,
          });
        });
      }
    );

    req.on("error", (err) => {
      const durationMs = Math.round(performance.now() - start);
      resolve({
        url: urlStr,
        method,
        statusCode: 0,
        durationMs,
        contentType: null,
        contentLength: 0,
        error: err.message,
      });
    });

    req.on("timeout", () => {
      req.destroy(new Error("Request timed out"));
    });

    req.end();
  });
}

async function run() {
  console.log("=== CHALLENGER TASK 3: CONCURRENT HTTP STRESS & ADVERSARIAL HARNESS ===");
  console.log(`Target: ${BASE_URL}\n`);

  const catalog = loadCatalogProducts();

  // Build full list of 40 standard endpoints
  const validEndpoints: string[] = [
    "/",
    "/shop",
    "/materials",
    "/philosophy",
    "/images/hero/hero-tailored.png",
    "/images/hero/hero-knitwear.png",
    "/images/materials/italian-virgin-wool.png",
    "/images/materials/sandwashed-mulberry-silk.png",
    "/images/materials/brushed-baby-mohair.png",
    "/images/materials/french-full-grain-nappa.png",
    "/images/philosophy/design-studio.png",
    ...catalog.map((p) => `/product/${p.slug}`),
    ...catalog.flatMap((p) => [
      `/images/products/${p.slug}/look-1.png`,
      `/images/products/${p.slug}/look-2.png`,
    ]),
  ];

  console.log(`Identified ${validEndpoints.length} valid target endpoints.`);

  // ----------------------------------------------------
  // Phase 1: High Concurrency Baseline Check
  // ----------------------------------------------------
  console.log("\n--- Phase 1: High Concurrency Verification (120 parallel requests) ---");
  const phase1Promises: Promise<RequestResult>[] = [];
  // 3 rounds of all 40 endpoints fired at once = 120 concurrent requests
  for (let round = 0; round < 3; round++) {
    for (const ep of validEndpoints) {
      phase1Promises.push(doRequest(`${BASE_URL}${ep}`));
    }
  }

  const phase1Results = await Promise.all(phase1Promises);
  let p1Failures = 0;

  for (const r of phase1Results) {
    if (r.statusCode !== 200) {
      console.error(`❌ Non-200 status: ${r.method} ${r.url} -> ${r.statusCode} (${r.error || "no error msg"})`);
      p1Failures++;
      continue;
    }

    const isImage = r.url.endsWith(".png");
    if (isImage) {
      if (!r.contentType || !r.contentType.includes("image/png")) {
        console.error(`❌ Invalid image content-type: ${r.url} -> ${r.contentType}`);
        p1Failures++;
      }
      if (!r.contentLength || r.contentLength < 50000) {
        console.error(`❌ Image content-length too small: ${r.url} -> ${r.contentLength}`);
        p1Failures++;
      }
    } else {
      if (!r.contentType || !r.contentType.includes("text/html")) {
        console.error(`❌ Invalid HTML content-type: ${r.url} -> ${r.contentType}`);
        p1Failures++;
      }
    }
  }

  console.log(
    `Phase 1 Results: ${phase1Results.length} requests completed. Success: ${
      phase1Results.length - p1Failures
    }/${phase1Results.length} (Failures: ${p1Failures})`
  );

  // ----------------------------------------------------
  // Phase 2: Sustained Concurrent Burst (500 requests)
  // ----------------------------------------------------
  console.log("\n--- Phase 2: Sustained High-Load Burst (500 requests, concurrency 50) ---");
  const totalStressRequests = 500;
  const concurrencyLimit = 50;
  const phase2Results: RequestResult[] = [];
  let requestIndex = 0;

  async function worker() {
    while (requestIndex < totalStressRequests) {
      const idx = requestIndex++;
      const ep = validEndpoints[idx % validEndpoints.length];
      const res = await doRequest(`${BASE_URL}${ep}`);
      phase2Results.push(res);
    }
  }

  const workers = Array.from({ length: concurrencyLimit }, () => worker());
  await Promise.all(workers);

  const durations = phase2Results.map((r) => r.durationMs).sort((a, b) => a - b);
  const minLatency = durations[0];
  const maxLatency = durations[durations.length - 1];
  const avgLatency = Math.round(durations.reduce((a, b) => a + b, 0) / durations.length);
  const p50 = durations[Math.floor(durations.length * 0.5)];
  const p95 = durations[Math.floor(durations.length * 0.95)];
  const p99 = durations[Math.floor(durations.length * 0.99)];

  const serverErrors = phase2Results.filter((r) => r.statusCode >= 500 || r.statusCode === 0);
  const non200s = phase2Results.filter((r) => r.statusCode !== 200);

  console.log(`Burst Completed: ${phase2Results.length} requests processed.`);
  console.log(`Latency Stats: Min: ${minLatency}ms | Avg: ${avgLatency}ms | p50: ${p50}ms | p95: ${p95}ms | p99: ${p99}ms | Max: ${maxLatency}ms`);
  console.log(`Server Errors (5xx / Hangs): ${serverErrors.length}`);
  console.log(`Non-200 Responses: ${non200s.length}`);

  // ----------------------------------------------------
  // Phase 3: Adversarial Probing & Failure Mode Stress
  // ----------------------------------------------------
  console.log("\n--- Phase 3: Adversarial & Edge Case Probing ---");
  const adversarialCases = [
    { name: "Non-existent product slug", url: `${BASE_URL}/product/unknown-jacket-999`, expectedStatus: 404, method: "GET" },
    { name: "Non-existent route", url: `${BASE_URL}/random-nowhere-path`, expectedStatus: 404, method: "GET" },
    { name: "Directory traversal in product path", url: `${BASE_URL}/product/..%2f..%2fpackage.json`, expectedStatus: [400, 404], method: "GET" },
    { name: "Path traversal in image path", url: `${BASE_URL}/images/products/..%2f..%2fpackage.json`, expectedStatus: [400, 404], method: "GET" },
    { name: "Null byte injection in route", url: `${BASE_URL}/product/%00something`, expectedStatus: [400, 404], method: "GET" },
    { name: "Malformed URL encoding", url: `${BASE_URL}/product/%A`, expectedStatus: [400, 404], method: "GET" },
    { name: "Arbitrary query string stress", url: `${BASE_URL}/shop?q=%3Cscript%3Ealert(1)%3C%2Fscript%3E&category=invalid&sort=unknown`, expectedStatus: 200, method: "GET" },
    { name: "HEAD request on product page", url: `${BASE_URL}/product/deconstructed-oversized-wool-blazer`, expectedStatus: 200, method: "HEAD" },
    { name: "HEAD request on image asset", url: `${BASE_URL}/images/products/deconstructed-oversized-wool-blazer/look-1.png`, expectedStatus: 200, method: "HEAD" },
  ];

  let advFailures = 0;
  for (const ac of adversarialCases) {
    const res = await doRequest(ac.url, ac.method);
    const validExpected = Array.isArray(ac.expectedStatus)
      ? ac.expectedStatus.includes(res.statusCode)
      : res.statusCode === ac.expectedStatus;

    if (!validExpected) {
      console.error(`❌ Adversarial failure: [${ac.name}] expected ${ac.expectedStatus}, got ${res.statusCode} (${res.url})`);
      advFailures++;
    } else {
      console.log(`✓ OK: [${ac.name}] -> Status ${res.statusCode} in ${res.durationMs}ms`);
    }
  }

  const totalFailures = p1Failures + serverErrors.length + advFailures;
  console.log("\n------------------------------------------------------");
  console.log(`Task 3 Summary: ${phase1Results.length + phase2Results.length + adversarialCases.length} total HTTP requests.`);
  console.log(`Failures: ${totalFailures}`);
  console.log("------------------------------------------------------\n");

  if (totalFailures > 0) {
    process.exit(1);
  }
}

run().catch((err) => {
  console.error("Task 3 error:", err);
  process.exit(1);
});
