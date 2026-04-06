import { notFound } from "next/navigation";
import { ProductCardClient } from "@/components/product/ProductCardClient";
import { RecommendedProducts } from "@/components/product/RecommendedProducts";
import {
  getPromoCalendarDateKey,
  pickDailyPromoSlugs,
} from "@/lib/daily-promo";
import { getAllProductSlugs, getProductBySlug } from "@/lib/products-db";
import { getProductGalleryImages } from "@/lib/product-media";

export async function ProductCardPage({
  slug,
  initialColor,
}: {
  slug: string;
  initialColor?: string;
}) {
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const galleryByColor: Record<string, string[]> = {};
  for (const color of product.colors) {
    galleryByColor[color] = getProductGalleryImages({
      category: product.category,
      title: product.title,
      color,
    });
  }

  const allSlugs = await getAllProductSlugs();
  const dailyPromoSlugs = pickDailyPromoSlugs(
    allSlugs,
    getPromoCalendarDateKey()
  );
  const isDailyPromo = dailyPromoSlugs.includes(slug);

  return (
    <>
      <ProductCardClient
        product={product}
        galleryByColor={galleryByColor}
        initialColor={initialColor}
        isDailyPromo={isDailyPromo}
      />
      <RecommendedProducts excludeSlug={slug} />
    </>
  );
}
