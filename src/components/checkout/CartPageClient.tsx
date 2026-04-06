"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { CartLineItems } from "@/components/checkout/CartLineItems";
import { CheckoutSection } from "@/components/checkout/CheckoutSection";

function formatPriceRub(value: number) {
  return new Intl.NumberFormat("ru-RU").format(Math.round(value)) + " Р";
}

export function CartPageClient() {
  const { items, totalAmount } = useCart();

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-[620px] px-[15px] py-8 md:px-6 lg:px-8">
        <nav
          className="mb-6 text-[14px] text-[#878787]"
          style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          aria-label="Хлебные крошки"
        >
          <Link href="/" className="hover:text-[#221f1f]">
            Главная
          </Link>
          <span className="mx-1">/</span>
          <span className="font-medium text-[#221f1f]">Корзина</span>
        </nav>

        <h1
          className="mb-6 text-[24px] font-semibold text-[#221f1f] md:text-[28px]"
          style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
        >
          Корзина
        </h1>

        <CartLineItems />

        {items.length > 0 && (
          <p
            className="mt-6 text-[15px] font-medium text-[#221f1f]"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            Итого:{" "}
            <span style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
              {formatPriceRub(totalAmount)}
            </span>
          </p>
        )}

        <CheckoutSection />

        <p className="mt-8 text-center text-[14px] text-[#949494]">
          <Link
            href="/"
            className="text-[#221f1f] underline hover:no-underline"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            Продолжить покупки
          </Link>
        </p>
      </div>
    </div>
  );
}
