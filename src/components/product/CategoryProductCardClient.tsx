"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { useToast } from "@/components/ui/toast";
import type { Product } from "@/lib/products-db";
import { cn } from "@/lib/utils";

function pickDefaultVariant(p: Product) {
  const color = p.colors[0];
  const match = color
    ? p.variants.find((v) => v.color === color)
    : undefined;
  return match ?? p.variants[0] ?? null;
}

function pickVariant(p: Product, preferredColor?: string | null) {
  if (preferredColor) {
    const v = p.variants.find((x) => x.color === preferredColor);
    if (v) return v;
  }
  return pickDefaultVariant(p);
}

export function CategoryProductCardClient({
  product,
  preview,
  title,
  subtitle,
  href,
  preferredColor,
  badge,
  showCartButton = true,
  subtitleIsPrice = false,
  className,
}: {
  product: Product | null;
  preview: string | null;
  title: string;
  subtitle: string;
  href: string;
  preferredColor?: string | null;
  badge?: "Новинка" | "Хит" | null;
  /** Промежуточные категории (например список моделей iPhone) — без «В корзину». */
  showCartButton?: boolean;
  /** Вторая строка — цена «от … Р» (карточки моделей Mac / и т.п.). */
  subtitleIsPrice?: boolean;
  className?: string;
}) {
  const { addItem } = useCart();
  const toast = useToast();
  const variant = product ? pickVariant(product, preferredColor) : null;

  return (
    <li
      className={cn(
        "flex max-w-full flex-col overflow-hidden rounded-none border border-[#e4e4e4] bg-white shadow-sm transition-[border-color,box-shadow,background-color] duration-300 ease-out hover:border-[#221f1f] hover:bg-[#fafafa] hover:shadow-md",
        className,
      )}
    >
      <div className="flex aspect-square w-full min-w-0 flex-col">
        <Link
          href={href}
          className="flex min-h-0 flex-1 cursor-pointer flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-[#221f1f] focus-visible:ring-offset-2"
        >
          <div className="relative min-h-0 flex-1 overflow-hidden bg-white">
            <div className="absolute inset-0 flex items-center justify-center p-2">
              {preview ? (
                <div className="relative h-[80%] w-[80%] max-h-full max-w-full">
                  <Image
                    src={preview}
                    alt={title}
                    fill
                    className="object-contain object-center"
                    sizes="(max-width: 640px) 50vw, 20vw"
                    unoptimized
                  />
                </div>
              ) : null}
            </div>
            {badge ? (
              <span
                className="absolute right-2 top-2 z-10 rounded-md bg-[#221f1f] px-2.5 py-0.5 text-[12px] font-medium uppercase leading-none text-white"
                style={{ fontFamily: "var(--font-etude), sans-serif" }}
              >
                {badge}
              </span>
            ) : null}
          </div>
          <div className="shrink-0 border-t border-[#e4e4e4] p-3 pt-2 text-center">
            <h2
              className="text-[15px] font-normal leading-tight text-[#221f1f]"
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              {title}
            </h2>
            <p
              className={
                subtitleIsPrice
                  ? "loom-promo-price mt-1 text-[18px] font-normal leading-none text-[#221f1f]"
                  : "text-[13px] font-normal text-[#949494]"
              }
              style={
                subtitleIsPrice
                  ? { fontFamily: "var(--font-etude), sans-serif" }
                  : { fontFamily: "var(--font-montserrat), sans-serif" }
              }
            >
              {subtitle}
            </p>
          </div>
        </Link>
        {showCartButton && variant ? (
          <div className="shrink-0 px-3 pb-3 pt-2">
            <button
              type="button"
              onClick={() => {
                addItem({
                  id: `${product!.productId}:${variant.variantId}`,
                  name: product!.title,
                  price: variant.price,
                  priceOld:
                    variant.priceOld > variant.price
                      ? variant.priceOld
                      : undefined,
                  image: preview ?? undefined,
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
        ) : null}
      </div>
    </li>
  );
}
