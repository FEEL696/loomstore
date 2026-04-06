"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import type { Product, ProductVariant } from "@/lib/products-db";
import { applyDailyPromoPrice } from "@/lib/daily-promo";
import { getCategoryBreadcrumb } from "@/lib/category-nav";
import { useCart } from "@/lib/cart";
import { useToast } from "@/components/ui/toast";
import { CheckoutDialog } from "@/components/checkout/CheckoutDialog";

function formatPriceRub(value: number) {
  return new Intl.NumberFormat("ru-RU").format(value) + " Р";
}

function pickFirst<T>(arr: T[]) {
  return arr.length > 0 ? arr[0] : null;
}

function matchVariant(args: {
  variants: ProductVariant[];
  color: string | null;
  memoryGb: number | null;
  storage: string | null;
}) {
  const { variants, color, memoryGb, storage } = args;
  const filtered = variants.filter((v) => {
    if (color && v.color !== color) return false;
    if (memoryGb != null && v.memoryGb != null && v.memoryGb !== memoryGb)
      return false;
    if (storage && v.storage && v.storage !== storage) return false;
    return true;
  });
  return pickFirst(filtered);
}

export function ProductCardClient({
  product,
  galleryByColor,
  initialColor,
  isDailyPromo = false,
}: {
  product: Product;
  galleryByColor: Record<string, string[]>;
  initialColor?: string;
  isDailyPromo?: boolean;
}) {
  const { addItem } = useCart();
  const toast = useToast();

  const defaultColor = useMemo(() => {
    if (initialColor && product.colors.includes(initialColor)) return initialColor;
    return pickFirst(product.colors);
  }, [initialColor, product.colors]);
  const defaultMemory = useMemo(
    () => pickFirst(product.memoryOptionsGb),
    [product.memoryOptionsGb]
  );
  const defaultStorage = useMemo(
    () => pickFirst(product.storageOptions),
    [product.storageOptions]
  );

  const [selectedColor, setSelectedColor] = useState<string | null>(defaultColor);
  const [selectedMemoryGb, setSelectedMemoryGb] = useState<number | null>(
    defaultMemory
  );
  const [selectedStorage, setSelectedStorage] = useState<string | null>(
    defaultStorage
  );
  const [mainImageIndex, setMainImageIndex] = useState(0);

  const gallery = (selectedColor ? galleryByColor[selectedColor] : null) ?? [];

  const currentVariant =
    matchVariant({
      variants: product.variants,
      color: selectedColor,
      memoryGb: selectedMemoryGb,
      storage: selectedStorage,
    }) ?? product.variants[0];

  const basePrice = currentVariant?.price ?? 0;
  const priceOld = currentVariant?.priceOld ?? 0;
  const promoPrice = isDailyPromo ? applyDailyPromoPrice(basePrice) : basePrice;
  const categoryCrumb = getCategoryBreadcrumb(product.category);

  const [oneClickOpen, setOneClickOpen] = useState(false);

  const oneClickItem = useMemo(() => {
    const v = currentVariant ?? null;
    if (!v) return null;
    const image = (gallery?.[0] ?? null) as string | null;
    const salePrice = isDailyPromo ? applyDailyPromoPrice(v.price) : v.price;
    const priceOldOut = isDailyPromo
      ? v.price > salePrice
        ? v.price
        : undefined
      : v.priceOld > v.price
        ? v.priceOld
        : undefined;
    return {
      id: `${product.productId}:${v.variantId}`,
      name: product.title,
      price: salePrice,
      priceOld: priceOldOut,
      image: image ?? undefined,
      color: selectedColor ?? undefined,
      memoryGb: selectedMemoryGb ?? undefined,
      quantity: 1,
    };
  }, [
    currentVariant,
    gallery,
    product.productId,
    product.title,
    selectedColor,
    selectedMemoryGb,
    isDailyPromo,
  ]);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-[1920px] px-[15px] py-6 md:px-6 md:py-8 min-[1200px]:pt-10 lg:px-8">
        <div className="grid grid-cols-1 gap-8 min-[1200px]:grid-cols-2 min-[1200px]:gap-12">
          <section
            className="flex flex-col gap-4 min-[1200px]:flex-row min-[1200px]:gap-4"
            aria-label="Галерея товара"
          >
            <div className="order-2 flex max-w-full flex-row gap-2 overflow-x-auto pb-1 min-[1200px]:order-1 min-[1200px]:max-h-[min(70vh,560px)] min-[1200px]:w-20 min-[1200px]:shrink-0 min-[1200px]:flex-col min-[1200px]:overflow-y-auto min-[1200px]:overflow-x-hidden">
              {gallery.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setMainImageIndex(i)}
                  className={`relative aspect-square w-14 shrink-0 overflow-hidden rounded-none border-2 bg-white focus:outline-none sm:w-16 min-[1200px]:w-20 ${
                    mainImageIndex === i
                      ? "border-[#221f1f]"
                      : "border-transparent"
                  }`}
                  aria-label={`Показать фото ${i + 1}`}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    className="object-contain p-1"
                    sizes="80px"
                    unoptimized
                  />
                </button>
              ))}
            </div>

            <div className="relative order-1 aspect-square w-full min-w-0 overflow-hidden rounded-none bg-white min-[1200px]:order-2 min-[1200px]:flex-1">
              {gallery.length > 0 && (
                <Image
                  src={gallery[mainImageIndex] ?? gallery[0]}
                  alt={product.title}
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 50vw"
                  priority
                  unoptimized
                />
              )}
            </div>
          </section>

          <section className="flex flex-col" aria-label="Информация о товаре">
            <nav aria-label="Хлебные крошки" className="mb-6">
              <ol
                className="flex flex-wrap items-center gap-1 text-[14px] text-[#949494]"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                <li className="flex items-center gap-1">
                  <Link href="/" className="hover:text-[#221f1f] focus:outline-none">
                    Главная
                  </Link>
                </li>
                <li className="flex items-center gap-1">
                  <span className="text-[#c9c9c9]">/</span>
                  <Link
                    href={categoryCrumb.href}
                    className="hover:text-[#221f1f] focus:outline-none"
                  >
                    {categoryCrumb.label}
                  </Link>
                </li>
                <li className="flex items-center gap-1">
                  <span className="text-[#c9c9c9]">/</span>
                  <span className="text-[#221f1f]">{product.title}</span>
                </li>
              </ol>
            </nav>
            <h1
              className="text-[28px] font-semibold leading-tight text-[#221f1f] md:text-[32px]"
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              {product.title}
            </h1>

            <div className="mt-6 flex flex-wrap items-baseline gap-2">
              <span className="loom-promo-price text-[24px] text-[#221f1f] md:text-[28px]">
                {formatPriceRub(promoPrice)}
              </span>
              {isDailyPromo ? (
                <span className="loom-promo-price text-[20px] line-through">
                  {formatPriceRub(basePrice)}
                </span>
              ) : (
                priceOld > basePrice && (
                  <span className="loom-promo-price text-[20px] line-through">
                    {formatPriceRub(priceOld)}
                  </span>
                )
              )}
            </div>

            {product.colors.length > 0 && (
              <div className="mt-8">
                <p
                  className="mb-2 text-[14px] font-medium text-[#221f1f]"
                  style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                  Цвет:
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        setSelectedColor(c);
                        setMainImageIndex(0);
                      }}
                      className={`rounded-full border px-4 py-2.5 text-[14px] focus:outline-none ${
                        selectedColor === c
                          ? "border-[#221f1f] bg-[#221f1f] text-white"
                          : "border-[#c9c9c9] bg-white text-[#221f1f] hover:bg-[#f7f7f7]"
                      }`}
                      style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                      aria-pressed={selectedColor === c}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.memoryOptionsGb.length > 0 && (
              <div className="mt-6">
                <p
                  className="mb-2 text-[14px] font-medium text-[#221f1f]"
                  style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                  Память:
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.memoryOptionsGb.map((gb) => (
                    <button
                      key={gb}
                      type="button"
                      onClick={() => setSelectedMemoryGb(gb)}
                      className={`rounded-full border px-4 py-2.5 text-[14px] focus:outline-none ${
                        selectedMemoryGb === gb
                          ? "border-[#221f1f] bg-[#221f1f] text-white"
                          : "border-[#c9c9c9] bg-white text-[#221f1f] hover:bg-[#f7f7f7]"
                      }`}
                      style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                      aria-pressed={selectedMemoryGb === gb}
                    >
                      {gb} ГБ
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.storageOptions.length > 0 && (
              <div className="mt-6">
                <p
                  className="mb-2 text-[14px] font-medium text-[#221f1f]"
                  style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                  Конфигурация:
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.storageOptions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedStorage(s)}
                      className={`rounded-full border px-4 py-2.5 text-[14px] focus:outline-none ${
                        selectedStorage === s
                          ? "border-[#221f1f] bg-[#221f1f] text-white"
                          : "border-[#c9c9c9] bg-white text-[#221f1f] hover:bg-[#f7f7f7]"
                      }`}
                      style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                      aria-pressed={selectedStorage === s}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-10 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  if (!currentVariant) return;
                  const salePrice = isDailyPromo
                    ? applyDailyPromoPrice(currentVariant.price)
                    : currentVariant.price;
                  addItem({
                    id: `${product.productId}:${currentVariant.variantId}`,
                    name: product.title,
                    price: salePrice,
                    priceOld:
                      isDailyPromo
                        ? currentVariant.price
                        : currentVariant.priceOld,
                    image: gallery?.[0] ?? undefined,
                    color: selectedColor ?? undefined,
                    memoryGb: selectedMemoryGb ?? undefined,
                  });
                  toast.show("Товар добавлен в корзину");
                }}
                className="flex h-[48px] items-center justify-center rounded-full bg-[#221f1f] px-6 py-3 text-[14px] font-normal uppercase leading-none text-white hover:bg-[#221f1f]/90 focus:outline-none"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                В КОРЗИНУ
              </button>
              <button
                type="button"
                onClick={() => setOneClickOpen(true)}
                className="flex h-[48px] items-center justify-center rounded-full border border-[#c9c9c9] bg-white px-6 py-3 text-[14px] font-normal leading-none text-[#221f1f] hover:bg-[#f7f7f7] focus:outline-none"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                disabled={!oneClickItem}
              >
                Купить в 1 клик
              </button>
            </div>
          </section>
        </div>
      </div>

      <CheckoutDialog
        open={oneClickOpen}
        onOpenChange={setOneClickOpen}
        items={oneClickItem ? [oneClickItem] : []}
      />
    </div>
  );
}

