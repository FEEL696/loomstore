import Link from "next/link";
import {
  MODELS,
  getColorsForModel,
  getPreviewImageForIphoneModel,
  getImagesForModelColor,
  getPlaceholderImageBasePath,
} from "@/lib/iphone-models";
import { getProductBySlug } from "@/lib/products-db";
import { CategoryProductCardClient } from "@/components/product/CategoryProductCardClient";

function pluralize(n: number) {
  if (n === 1) return "товар";
  if (n >= 2 && n <= 4) return "товара";
  return "товаров";
}

const NEW_MODELS = new Set([
  "iphone-17-pro-max",
  "iphone-17-pro",
  "iphone-17",
  "iphone-air",
]);
const HIT_MODELS = new Set(["iphone-16-pro-max", "iphone-16-pro"]);

export default async function IphoneCategoryPage() {
  const models = await Promise.all(
    Object.entries(MODELS).map(async ([slug, { title }]) => {
      const colors = getColorsForModel(slug);
      const product = await getProductBySlug(slug);
      /** Сколько карточек товара на странице модели: пары цвет × память (из БД после dedupe), иначе папки × число объёмов. */
      const count =
        product && product.variants.length > 0
          ? product.variants.length
          : (() => {
              const memN = product?.memoryOptionsGb?.length ?? 3;
              return colors.length * memN;
            })();
      const preview = getPreviewImageForIphoneModel(slug);
      const firstImage =
        preview ??
        (colors.length > 0
          ? getImagesForModelColor(slug, colors[0])[0]
          : getPlaceholderImageBasePath());
      const label = NEW_MODELS.has(slug)
        ? ("Новинка" as const)
        : HIT_MODELS.has(slug)
          ? ("Хит" as const)
          : null;
      return {
        slug,
        title,
        count,
        image: firstImage,
        label,
        product,
      };
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
          <span className="font-medium text-[#221f1f]">iPhone</span>
        </nav>

        <h1 className="loom-promo-section-title mb-8">iPhone</h1>

        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 min-[1200px]:grid-cols-3 xl:grid-cols-4">
          {models.map((model) => (
            <CategoryProductCardClient
              key={model.slug}
              product={model.product}
              preview={model.image}
              title={model.title}
              subtitle={`${model.count} ${pluralize(model.count)}`}
              href={`/category/iphone/${model.slug}`}
              badge={model.label ?? undefined}
              showCartButton={false}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
