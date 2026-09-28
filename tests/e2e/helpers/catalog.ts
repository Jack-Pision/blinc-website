import fs from "node:fs";
import ts from "typescript";
import { PRODUCTS_DATA_PATH } from "./test-utils.ts";

export interface ParsedProduct {
  id: string;
  slug: string;
  name: string;
  price: number;
  category: string;
  gender: string;
  edition: string;
  color: string;
  colorHex: string;
  images: string[];
  description: string;
  details: string[];
  fit: string;
  sustainability: string;
  sizes: string[];
  isNew?: boolean;
  featured?: boolean;
  pairWith?: string[];
  stats?: {
    weight: string;
    origin: string;
    silhouette: string;
  };
  tactile?: {
    drape: number;
    drapeLabel: string;
    weight: number;
    weightLabel: string;
    finish: number;
    finishLabel: string;
    thermal: number;
    thermalLabel: string;
    textureNote: string;
  };
}

/**
 * Loads and extracts the PRODUCTS array from src/data/products.ts using TypeScript compiler API.
 */
export function loadCatalogProducts(filePath: string = PRODUCTS_DATA_PATH): ParsedProduct[] {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Catalog file not found at: ${filePath}`);
  }

  const fileContent = fs.readFileSync(filePath, "utf8");
  // Replace relative imports (e.g. import { Product } from "@/types";) to make it self-contained
  const cleanCode = fileContent.replace(/import\s+[\s\S]*?from\s+['"][^'"]+['"];/g, "const Product = null;");
  
  const transpiled = ts.transpileModule(cleanCode, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  });

  const moduleObj: { exports: { PRODUCTS?: ParsedProduct[] } } = { exports: {} };
  const fn = new Function("exports", "module", transpiled.outputText);
  fn(moduleObj.exports, moduleObj);

  if (!moduleObj.exports.PRODUCTS || !Array.isArray(moduleObj.exports.PRODUCTS)) {
    throw new Error("Failed to export PRODUCTS array from " + filePath);
  }

  return moduleObj.exports.PRODUCTS;
}
