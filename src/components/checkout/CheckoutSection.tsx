"use client";

import { useMemo, useState } from "react";

import { useCart } from "@/lib/cart";
import { CheckoutDialog } from "@/components/checkout/CheckoutDialog";

export function CheckoutSection() {
  const { items, totalAmount, clearCart } = useCart();
  const [open, setOpen] = useState(false);

  const disabled = items.length === 0;
  const buttonLabel = "Перейти к оплате";

  const checkoutItems = useMemo(() => items, [items]);

  return (
    <>
      <div className="mt-6 flex flex-col gap-4">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex h-[42px] w-full items-center justify-center rounded-full bg-[#221f1f] px-5 text-[14px] uppercase leading-none text-white hover:bg-[#221f1f]/90 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          disabled={disabled}
        >
          {buttonLabel}
        </button>
      </div>

      <CheckoutDialog
        open={open}
        onOpenChange={setOpen}
        items={checkoutItems}
        onSuccess={() => {
          if (totalAmount > 0) clearCart();
        }}
      />
    </>
  );
}
