export type ProductCategory =
  | "all"
  | "outerwear"
  | "tailoring"
  | "knitwear"
  | "bottoms"
  | "tops"
  | "dresses";

export type GenderCategory = "all" | "female" | "male" | "unisex";

export interface TactileProfile {
  drape: number; // 1 (Rigid/Sculptural) to 5 (Ultra-Fluid)
  drapeLabel: string;
  weight: number; // 1 (Airy) to 5 (Heavyweight)
  weightLabel: string;
  finish: number; // 1 (Chalk Matte) to 5 (Satin Luster)
  finishLabel: string;
  thermal: number; // 1 (Transitional/Breezy) to 5 (Sub-Zero Warmth)
  thermalLabel: string;
  textureNote: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  category: ProductCategory;
  gender: GenderCategory;
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
  tactile?: TactileProfile;
}

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

export type Currency = "USD" | "EUR" | "GBP" | "JPY";
