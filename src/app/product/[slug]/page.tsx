import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PRODUCTS } from "@/data/products";
import { ProductDetailView } from "@/components/ProductDetailView";
import { Product } from "@/types";

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const product = PRODUCTS.find((p) => p.slug === resolvedParams.slug);

  if (!product) {
    return {
      title: "Garment Not Found — BLINC 2026",
    };
  }

  return {
    title: `${product.name} — BLINC Concept 2026`,
    description: product.description,
    openGraph: {
      title: `${product.name} — BLINC Concept 2026`,
      description: product.description,
      images: [
        {
          url: product.images[0],
          width: 1200,
          height: 1600,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const product = PRODUCTS.find((p) => p.slug === resolvedParams.slug);

  if (!product) {
    notFound();
  }

  const pairedProducts = (product.pairWith || [])
    .map((slug) => PRODUCTS.find((p) => p.slug === slug))
    .filter(Boolean) as Product[];

  return <ProductDetailView product={product} pairedProducts={pairedProducts} />;
}
