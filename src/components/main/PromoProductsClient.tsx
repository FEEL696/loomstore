"use client";

import Image from "next/image";
import Link from "next/link";

import { useCart } from "@/lib/cart";
import { useToast } from "@/components/ui/toast";

function formatPriceRub(value: number) {
  return new Intl.NumberFormat("ru-RU").format(value) + " Р";
}

export type PromoProductCard = {
  slug: string;
  title: string;
  image: string;
  basePrice: number;
  promoPrice: number;
  productId: string | number;
  variantId: string | number;
  color?: string;
  memoryGb: number | null;
};

export function PromoProductsClient({ items }: { items: PromoProductCard[] }) {
  const { addItem } = useCart();
  const toast = useToast();

  if (items.length === 0) {
    return (
      <p
        className="text-[14px] text-[#626262]"
        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
      >
        Товары появятся в каталоге позже.{" "}
        <Link href="/category/iphone" className="text-[#221f1f] underline">
          Перейти в каталог
        </Link>
      </p>
    );
  }

  return (
    <ul className="flex max-md:flex-row max-md:gap-4 max-md:overflow-x-auto max-md:pb-2 max-md:[scrollbar-width:thin] md:grid md:grid-cols-2 md:gap-6 min-[1200px]:grid-cols-3 2xl:grid-cols-4">
      {items.map((product) => (
        <li
          key={product.slug}
          className="flex max-md:min-w-[min(280px,calc(100vw-62px))] max-md:max-w-[min(280px,calc(100vw-62px))] max-md:shrink-0 max-md:snap-start max-md:flex-col md:min-w-0"
        >
          <div className="flex max-w-full flex-1 flex-col overflow-hidden rounded-none border border-[#e4e4e4] bg-white shadow-sm transition-[border-color,box-shadow,background-color] duration-300 ease-out hover:border-[#221f1f] hover:bg-[#fafafa] hover:shadow-md">
            <div className="flex aspect-square w-full min-w-0 flex-col">
              <Link
                href={`/product/${product.slug}`}
                className="flex min-h-0 flex-1 cursor-pointer flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-[#221f1f] focus-visible:ring-offset-2"
              >
                <div className="relative min-h-0 flex-1 overflow-hidden bg-white">
                  <div className="absolute inset-0 flex items-center justify-center p-2">
                    <div className="relative h-[80%] w-[80%] max-h-full max-w-full">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-contain object-center"
                        sizes="(max-width: 768px) 75vw, (max-width: 1200px) 30vw, 22vw"
                        unoptimized
                      />
                    </div>
                  </div>
                  <div className="absolute left-3 top-3 z-10 bg-[#d31b1b] px-2.5 py-1.5">
                    <span
                      className="text-[13px] font-semibold uppercase leading-none text-white"
                      style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                    >
                      −7%
                    </span>
                  </div>
                </div>
                <div className="shrink-0 border-t border-[#e4e4e4] p-3 pt-2 text-center md:p-4">
                  <h2
                    className="loom-promo-product-title text-[15px] font-normal leading-tight text-[#221f1f] md:text-[20px]"
                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                  >
                    {product.title}
                  </h2>
                  <p className="mt-2 flex flex-wrap items-baseline justify-center gap-2">
                    <span
                      className="text-[18px] font-normal leading-none text-[#221f1f]"
                      style={{ fontFamily: "var(--font-etude), sans-serif" }}
                    >
                      {formatPriceRub(product.promoPrice)}
                    </span>
                    <span
                      className="text-[18px] font-normal leading-none text-[#949494] line-through"
                      style={{ fontFamily: "var(--font-etude), sans-serif" }}
                    >
                      {formatPriceRub(product.basePrice)}
                    </span>
                  </p>
                </div>
              </Link>
              <div className="shrink-0 px-3 pb-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    addItem({
                      id: `${product.productId}:${product.variantId}`,
                      name: product.title,
                      price: product.promoPrice,
                      priceOld:
                        product.basePrice > product.promoPrice
                          ? product.basePrice
                          : undefined,
                      image: product.image,
                      color: product.color,
                      memoryGb: product.memoryGb ?? undefined,
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
          </div>
        </li>
      ))}
    </ul>
  );
}
