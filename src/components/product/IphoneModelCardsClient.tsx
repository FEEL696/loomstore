"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { useToast } from "@/components/ui/toast";
import type { Product, ProductVariant } from "@/lib/products-db";

function formatPriceRub(value: number) {
  return new Intl.NumberFormat("ru-RU").format(value) + " Р";
}

export function IphoneModelCardsClient({
  product,
  galleryByColor,
}: {
  product: Product;
  galleryByColor: Record<string, string[]>;
}) {
  const { addItem } = useCart();
  const toast = useToast();
  const [selectedColor, setSelectedColor] = useState(product.colors[0] ?? "");

  const variantsByColor = useMemo(() => {
    const grouped = new Map<string, ProductVariant[]>();
    for (const variant of product.variants) {
      const current = grouped.get(variant.color) ?? [];
      current.push(variant);
      grouped.set(variant.color, current);
    }

    for (const [key, variants] of grouped) {
      variants.sort((a, b) => (a.memoryGb ?? 0) - (b.memoryGb ?? 0));
      grouped.set(key, variants);
    }
    return grouped;
  }, [product.variants]);

  const visibleVariants = variantsByColor.get(selectedColor) ?? [];
  const previewImage = galleryByColor[selectedColor]?.[0] ?? null;

  return (
    <>
      <div className="mb-8">
        <p
          className="mb-3 text-[15px] font-medium text-[#221f1f]"
          style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
        >
          Цвет:
        </p>
        <div className="flex flex-wrap gap-2">
          {product.colors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setSelectedColor(color)}
              className={`rounded-full border px-4 py-2.5 text-[14px] focus:outline-none ${
                selectedColor === color
                  ? "border-[#221f1f] bg-[#221f1f] text-white"
                  : "border-[#c9c9c9] bg-white text-[#221f1f] hover:bg-[#f7f7f7]"
              }`}
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              aria-pressed={selectedColor === color}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 min-[1200px]:grid-cols-3 xl:grid-cols-4">
        {visibleVariants.map((variant) => (
          <li
            key={variant.variantId}
            className="flex max-w-full flex-col overflow-hidden rounded-none border border-[#e4e4e4] bg-white shadow-sm transition-[border-color,box-shadow,background-color] duration-300 ease-out hover:border-[#221f1f] hover:bg-[#fafafa] hover:shadow-md"
          >
            <div className="flex aspect-square w-full min-w-0 flex-col">
              <Link
                href={`/product/${product.slug}?color=${encodeURIComponent(variant.color)}`}
                className="flex min-h-0 flex-1 flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-[#221f1f] focus-visible:ring-offset-2"
              >
                <div className="relative min-h-0 flex-1 overflow-hidden bg-white">
                  <div className="absolute inset-0 flex items-center justify-center p-2">
                    {previewImage ? (
                      <div className="relative h-[80%] w-[80%] max-h-full max-w-full">
                        <Image
                          src={previewImage}
                          alt={variant.name}
                          fill
                          className="object-contain object-center"
                          sizes="(max-width: 768px) 100vw, 25vw"
                          unoptimized
                        />
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="shrink-0 border-t border-[#e4e4e4] p-4">
                  <h2
                    className="text-[15px] leading-tight text-[#221f1f]"
                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                  >
                    {variant.name}
                  </h2>

                  {variant.memoryGb != null && (
                    <p
                      className="mt-1 text-[14px] text-[#626262]"
                      style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                    >
                      Память: {variant.memoryGb} ГБ
                    </p>
                  )}

                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="loom-promo-price text-[22px]">
                      {formatPriceRub(variant.price)}
                    </span>
                    {variant.priceOld > variant.price && (
                      <span className="loom-promo-price text-[18px] line-through">
                        {formatPriceRub(variant.priceOld)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>

              <div className="shrink-0 px-4 pb-4 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    addItem({
                      id: `${product.productId}:${variant.variantId}`,
                      name: product.title,
                      price: variant.price,
                      priceOld:
                        variant.priceOld > variant.price
                          ? variant.priceOld
                          : undefined,
                      image: previewImage ?? undefined,
                      color: variant.color,
                      memoryGb: variant.memoryGb,
                    });
                    toast.show("Товар добавлен в корзину");
                  }}
                  className="inline-flex h-[44px] w-full items-center justify-center rounded-full bg-[#221f1f] px-4 text-[14px] font-normal uppercase leading-none text-white hover:bg-[#221f1f]/90 focus:outline-none"
                  style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                  В корзину
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
