import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/products-db";
import { getProductGalleryImages } from "@/lib/product-media";
import { CategoryProductCardClient } from "@/components/product/CategoryProductCardClient";
import { formatMinPriceSubtitleForColor } from "@/lib/catalog-ui";

type Props = { params: Promise<{ slug: string }> };

export default async function IpadModelPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || product.category !== "ipad") notFound();

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
          <Link href="/category/ipad" className="hover:text-[#221f1f]">
            iPad
          </Link>
          <span className="mx-1">/</span>
          <span className="font-medium text-[#221f1f]">{product.title}</span>
        </nav>

        <h1
          className="loom-promo-section-title mb-8"
          style={{ fontFamily: "var(--font-charito), sans-serif" }}
        >
          {product.title}
        </h1>

        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 min-[1200px]:grid-cols-3 xl:grid-cols-4">
          {product.colors.map((color) => {
            const preview =
              getProductGalleryImages({
                category: product.category,
                title: product.title,
                color,
              })[0] ?? null;

            return (
              <CategoryProductCardClient
                key={color}
                product={product}
                preview={preview}
                title={`${product.title} ${color}`}
                subtitle={formatMinPriceSubtitleForColor(product, color)}
                subtitleIsPrice
                href={`/product/${product.slug}?color=${encodeURIComponent(color)}`}
                preferredColor={color}
              />
            );
          })}
        </ul>
      </div>
    </div>
  );
}
