"use client";

import { useCart } from "@/lib/cart";

function formatPriceRub(value: number) {
  return new Intl.NumberFormat("ru-RU").format(Math.round(value)) + " Р";
}

export function CartLineItems() {
  const { items, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <p
        className="py-6 text-[14px] text-[#626262]"
        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
      >
        В корзине пока нет товаров.
      </p>
    );
  }

  return (
    <div className="max-h-[50vh] space-y-3 overflow-y-auto pr-1 md:max-h-none">
      {items.map((item) => (
        <div
          key={item.id}
          className="relative rounded-none border border-[#e4e4e4] p-3"
        >
          <button
            type="button"
            onClick={() => removeItem(item.id)}
            aria-label={`Удалить ${item.name} из корзины`}
            className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full text-[#949494] hover:bg-[#f7f7f7] hover:text-[#221f1f] focus:outline-none"
          >
            ×
          </button>
          <p
            className="pr-8 text-[14px] font-medium text-[#221f1f]"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            {item.name}
          </p>
          <p
            className="mt-1 text-[13px] text-[#626262]"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            Кол-во: {item.quantity}
            {item.color ? ` · ${item.color}` : ""}
            {item.memoryGb ? ` · ${item.memoryGb} ГБ` : ""}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span
              className="text-[18px] text-[#221f1f]"
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              {formatPriceRub(item.price)}
            </span>
            {item.priceOld && item.priceOld > item.price && (
              <span
                className="text-[15px] text-[#949494] line-through"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                {formatPriceRub(item.priceOld)}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
