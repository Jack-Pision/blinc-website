export type ProductCategory =
  | "all"
  | "outerwear"
  | "tailoring"
  | "knitwear"
  | "bottoms"
  | "tops"
  | "dresses";

export type GenderCategory = "all" | "female" | "male" | "unisex";

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
}

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

export type Currency = "USD" | "EUR" | "GBP" | "JPY";
