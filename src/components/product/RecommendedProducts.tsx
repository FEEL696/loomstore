import { CategoryProductCardClient } from "@/components/product/CategoryProductCardClient";
import { getAllProductSlugs, getProductBySlug, type Product } from "@/lib/products-db";
import { getProductGalleryImages } from "@/lib/product-media";
import { getProductPageHref } from "@/lib/product-href";

function subtitleFor(p: Product) {
  if (p.category === "iphone" && p.memoryOptionsGb.length) {
    return `Память: от ${Math.min(...p.memoryOptionsGb)} ГБ`;
  }
  if (p.storageOptions.length) {
    return p.storageOptions[0] ?? "";
  }
  return p.colors[0] ?? "";
}

export async function RecommendedProducts({ excludeSlug }: { excludeSlug: string }) {
  const allSlugs = await getAllProductSlugs();
  const candidates = allSlugs.filter((s) => s !== excludeSlug).slice(0, 4);

  const resolved = await Promise.all(
    candidates.map(async (slug) => {
      const p = await getProductBySlug(slug);
      if (!p) return null;
      const color = p.colors[0] ?? null;
      const preview =
        color != null
          ? getProductGalleryImages({
              category: p.category,
              title: p.title,
              color,
            })[0] ?? null
          : null;
      return {
        product: p,
        preview,
        href: getProductPageHref(p),
        title: p.title,
        subtitle: subtitleFor(p),
      };
    })
  );

  const items = resolved.filter(
    (x): x is NonNullable<typeof x> => x != null
  );

  if (items.length === 0) return null;

  return (
    <section
      className="border-t border-[#e4e4e4] bg-white pb-10 pt-8 md:pb-12 md:pt-10"
      aria-labelledby="recommended-heading"
    >
      <div className="mx-auto max-w-[1920px] px-[15px] md:px-6 lg:px-8">
        <h2
          id="recommended-heading"
          className="loom-promo-section-title mb-6 text-center md:mb-8 md:text-left"
        >
          Рекомендуемые товары
        </h2>

        <ul className="grid grid-cols-1 gap-4 max-md:flex max-md:grid-cols-none max-md:flex-row max-md:gap-4 max-md:overflow-x-auto max-md:pb-2 max-md:[scrollbar-width:thin] md:grid md:grid-cols-2 min-[1200px]:grid-cols-3 xl:grid-cols-4">
          {items.map(({ product, preview, href, title, subtitle }) => (
            <CategoryProductCardClient
              key={product.slug}
              product={product}
              preview={preview}
              title={title}
              subtitle={subtitle}
              href={href}
              className="max-md:min-w-[min(280px,calc(100vw-62px))] max-md:max-w-[min(280px,calc(100vw-62px))] max-md:shrink-0 max-md:snap-start"
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
