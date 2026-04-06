import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/products-db";
import {
  getMacbookLines,
  getModelsForLine,
  getPreviewForMacbookModel,
  getPreviewForMacbookLine,
  getLastImageForModelColor,
  getColorsForModel,
} from "@/lib/macbook-models";
import { CategoryProductCardClient } from "@/components/product/CategoryProductCardClient";
import { formatMinPriceSubtitle } from "@/lib/catalog-ui";

type Props = { params: Promise<{ slug: string }> };

export default async function MacbookLinePage({ params }: Props) {
  const { slug } = await params;
  const lines = getMacbookLines();
  const lineMeta = lines.find((l) => l.slug === slug);
  if (!lineMeta) notFound();

  const lineName = lineMeta.lineName;
  const models = getModelsForLine(lineName);

  const modelsWithProducts = await Promise.all(
    models.map(async (model) => {
      const product = await getProductBySlug(model.slug);
      const colors = getColorsForModel(model.slug);
      const preview =
        getPreviewForMacbookModel(model.slug) ??
        getPreviewForMacbookLine(model.line);
      const image =
        preview ??
        (colors.length > 0
          ? getLastImageForModelColor(model.slug, colors[0])
          : null);
      const subtitle = formatMinPriceSubtitle(product);
      return { model, product, image, subtitle };
    })
  );

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
          <Link href="/category/macbook" className="hover:text-[#221f1f]">
            MacBook и iMac
          </Link>
          <span className="mx-1">/</span>
          <span className="font-medium text-[#221f1f]">{lineName}</span>
        </nav>

        <h1
          className="loom-promo-section-title mb-8"
          style={{ fontFamily: "var(--font-charito), sans-serif" }}
        >
          {lineName}
        </h1>

        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 min-[1200px]:grid-cols-3 xl:grid-cols-4">
          {modelsWithProducts.map(({ model, product, image, subtitle }) => (
            <CategoryProductCardClient
              key={model.slug}
              product={product}
              preview={image}
              title={model.title}
              subtitle={subtitle}
              subtitleIsPrice
              href={`/product/${model.slug}`}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
