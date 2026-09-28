import path from "node:path";

export const PROJECT_ROOT = path.resolve(import.meta.dirname, "../../../");
export const PUBLIC_DIR = path.join(PROJECT_ROOT, "public");
export const PRODUCTS_ASSET_DIR = path.join(PUBLIC_DIR, "images", "products");
export const PRODUCTS_DATA_PATH = path.join(PROJECT_ROOT, "src", "data", "products.ts");

export interface ExpectedProductSpec {
  id: string;
  slug: string;
  name: string;
  category: "tailoring" | "outerwear" | "knitwear" | "bottoms" | "tops" | "dresses";
  gender: "male" | "female" | "unisex";
  milestone: "M1" | "M2" | "M3";
}

export const EXPECTED_PRODUCTS: ExpectedProductSpec[] = [
  {
    id: "blinc-01",
    slug: "deconstructed-oversized-wool-blazer",
    name: "Deconstructed Wool Blazer",
    category: "tailoring",
    gender: "male",
    milestone: "M1",
  },
  {
    id: "blinc-02",
    slug: "asymmetric-draped-silk-blouse",
    name: "Asymmetric Draped Silk Blouse",
    category: "tops",
    gender: "female",
    milestone: "M2",
  },
  {
    id: "blinc-03",
    slug: "pleated-architectural-trousers",
    name: "Pleated Architectural Trousers",
    category: "bottoms",
    gender: "male",
    milestone: "M3",
  },
  {
    id: "blinc-04",
    slug: "sculpted-mock-neck-knit",
    name: "Sculpted Mock-Neck Top",
    category: "knitwear",
    gender: "unisex",
    milestone: "M2",
  },
  {
    id: "blinc-05",
    slug: "boxy-brushed-mohair-cardigan",
    name: "Boxy Brushed Mohair Cardigan",
    category: "knitwear",
    gender: "unisex",
    milestone: "M2",
  },
  {
    id: "blinc-06",
    slug: "bonded-lambskin-cropped-biker",
    name: "Bonded Lambskin Cropped Biker",
    category: "outerwear",
    gender: "female",
    milestone: "M1",
  },
  {
    id: "blinc-07",
    slug: "concealed-placket-poplin-shirt",
    name: "Concealed Poplin Shirt",
    category: "tops",
    gender: "male",
    milestone: "M2",
  },
  {
    id: "blinc-08",
    slug: "high-waist-column-maxi-skirt",
    name: "High-Waist Column Maxi Skirt",
    category: "bottoms",
    gender: "female",
    milestone: "M3",
  },
  {
    id: "blinc-09",
    slug: "relaxed-studio-drawstring-pant",
    name: "Relaxed Studio Pant",
    category: "bottoms",
    gender: "unisex",
    milestone: "M3",
  },
  {
    id: "blinc-10",
    slug: "minimalist-double-breasted-trench",
    name: "Minimalist Walking Trench",
    category: "outerwear",
    gender: "female",
    milestone: "M1",
  },
  {
    id: "blinc-11",
    slug: "fine-gauge-merino-cocoon-knit",
    name: "Cocoon Ribbed Turtleneck",
    category: "knitwear",
    gender: "unisex",
    milestone: "M2",
  },
  {
    id: "blinc-12",
    slug: "architectural-tailored-evening-mini",
    name: "Architectural Mini Suit Dress",
    category: "dresses",
    gender: "female",
    milestone: "M1",
  },
];

export const MIN_IMAGE_SIZE_BYTES = 50 * 1024; // 50 KB = 51,200 bytes (or 50,000 bytes)
export const TARGET_ASPECT_RATIO = 3 / 4; // 0.75
export const ASPECT_RATIO_TOLERANCE = 0.05; // 0.70 to 0.80 acceptable editorial 3:4 tolerance
