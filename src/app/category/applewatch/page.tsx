import { getProductsByCategory } from "@/lib/products-db";
import { getProductGalleryImages } from "@/lib/product-media";
import { CategoryProductCardClient } from "@/components/product/CategoryProductCardClient";
import { formatMinPriceSubtitle } from "@/lib/catalog-ui";
import Link from "next/link";

export default async function AppleWatchCategoryPage() {
  const products = await getProductsByCategory("applewatch");

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-[1920px] px-[15px] py-6 md:px-6 md:py-8">
        <nav
          className="mb-4 text-[14px] text-[#878787]"
          style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          aria-label="Хлебные крошки"
        >
          <Link href="/" className="hover:text-[#221f1f]">
            Главная
          </Link>
          <span className="mx-1">/</span>
          <span className="font-medium text-[#221f1f]">Apple Watch</span>
        </nav>

        <h1 className="loom-promo-section-title mb-8">Apple Watch</h1>

        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 min-[1200px]:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => {
            const firstColor = p.colors[0] ?? null;
            const preview =
              firstColor != null
                ? getProductGalleryImages({
                    category: p.category,
                    title: p.title,
                    color: firstColor,
                  })[0] ?? null
                : null;
            return (
              <CategoryProductCardClient
                key={p.productId}
                product={p}
                preview={preview}
                title={p.title}
                subtitle={formatMinPriceSubtitle(p)}
                subtitleIsPrice
                href={`/product/${p.slug}`}
                preferredColor={firstColor}
              />
            );
          })}
        </ul>
      </div>
    </div>
  );
}
