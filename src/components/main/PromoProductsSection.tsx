import { images } from "@/lib/assets";
import {
  applyDailyPromoPrice,
  pickDailyPromoSlugs,
  getPromoCalendarDateKey,
} from "@/lib/daily-promo";
import { getProductBySlug, getAllProductSlugs } from "@/lib/products-db";
import { getProductGalleryImages } from "@/lib/product-media";

import { PromoSectionHeader } from "@/components/main/PromoSectionHeader";
import { PromoProductsClient } from "@/components/main/PromoProductsClient";

export async function PromoProductsSection() {
  const allSlugs = await getAllProductSlugs();
  const promoSlugs = pickDailyPromoSlugs(allSlugs, getPromoCalendarDateKey());

  const items = [];
  for (const slug of promoSlugs) {
    const p = await getProductBySlug(slug);
    if (!p) continue;
    const color = p.colors[0] ?? "";
    const gallery = color
      ? getProductGalleryImages({
          category: p.category,
          title: p.title,
          color,
        })
      : [];
    const image = gallery[0] ?? images.product1;
    const v = p.variants[0];
    if (!v) continue;
    const basePrice = v.price;
    const promoPrice = applyDailyPromoPrice(basePrice);
    items.push({
      slug: p.slug,
      title: p.title,
      image,
      basePrice,
      promoPrice,
      productId: p.productId,
      variantId: v.variantId,
      color: v.color,
      memoryGb: v.memoryGb ?? null,
    });
  }

  return (
    <section id="promo-products" className="overflow-visible bg-white pb-16 pt-12">
      <div className="relative mx-auto max-w-[1920px] overflow-visible px-[15px] md:px-6 lg:px-8">
        <PromoSectionHeader />
        <PromoProductsClient items={items} />
      </div>
    </section>
  );
}
