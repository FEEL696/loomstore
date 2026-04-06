"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CircleHelp } from "lucide-react";

import type { CartItem } from "@/lib/cart";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const HELOKET_CHECKOUT_URL =
  process.env.NEXT_PUBLIC_HELOKET_CHECKOUT_URL ?? "https://heloket.com";

function formatPriceRub(value: number) {
  return new Intl.NumberFormat("ru-RU").format(Math.round(value)) + " Р";
}

type PaymentMethod = "prepay" | "cod" | "crypto";
type ContactMethod = "telegram" | "instagram" | "whatsapp";
type DeliveryMethod = "post" | "courier";

const COD_TOOLTIP_TEXT =
  "Общая стоимость отправки наложенным платежом выше ввиду вероятности возврата товара. Мы закладываем это в стоимость товара.";

export function CheckoutDialog({
  open,
  onOpenChange,
  items,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CartItem[];
  onSuccess?: () => void;
}) {
  const totalAmount = useMemo(
    () => items.reduce((sum, it) => sum + it.price * it.quantity, 0),
    [items]
  );

  const [thanksOpen, setThanksOpen] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [contactMethod, setContactMethod] = useState<ContactMethod | null>(
    null
  );
  const [comment, setComment] = useState("");

  const [payment, setPayment] = useState<PaymentMethod | null>(null);
  const [delivery, setDelivery] = useState<DeliveryMethod | null>(null);
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const prepayTotal = useMemo(() => totalAmount * 0.95, [totalAmount]);
  const codTotal = useMemo(() => prepayTotal * 1.05, [prepayTotal]);

  const payableForSelection = useMemo(() => {
    if (payment === "prepay") return prepayTotal;
    if (payment === "cod") return codTotal;
    if (payment === "crypto") return totalAmount;
    return null;
  }, [payment, prepayTotal, codTotal, totalAmount]);

  const resetCheckoutForm = useCallback(() => {
    setName("");
    setPhone("");
    setContactMethod(null);
    setComment("");
    setPayment(null);
    setDelivery(null);
    setCity("");
    setAddress("");
    setSubmitError(null);
    setThanksOpen(false);
  }, []);

  useEffect(() => {
    if (!open) resetCheckoutForm();
  }, [open, resetCheckoutForm]);

  useEffect(() => {
    if (payment === "cod" && delivery === "courier") {
      setDelivery(null);
      setCity("");
      setAddress("");
    }
  }, [payment, delivery]);

  const handlePlaceOrder = async () => {
    setSubmitError(null);
    if (!name.trim()) {
      setSubmitError("Укажите имя.");
      return;
    }
    if (!phone.trim()) {
      setSubmitError("Укажите номер телефона.");
      return;
    }
    if (!contactMethod) {
      setSubmitError("Выберите способ связи.");
      return;
    }
    if (!payment) {
      setSubmitError("Выберите способ оплаты.");
      return;
    }
    if (!delivery) {
      setSubmitError("Выберите способ доставки.");
      return;
    }
    if (!city.trim() || !address.trim()) {
      setSubmitError("Укажите город и адрес для доставки.");
      return;
    }
    if (items.length === 0) {
      setSubmitError("Корзина пуста.");
      return;
    }

    const payableAmount =
      payment === "prepay"
        ? prepayTotal
        : payment === "cod"
          ? codTotal
          : totalAmount;

    const payload = {
      name: name.trim(),
      phone: phone.trim(),
      contactMethod,
      comment: comment.trim() || undefined,
      payment,
      delivery,
      city: city.trim(),
      address: address.trim(),
      items: items.map((it) => ({
        id: it.id,
        name: it.name,
        quantity: it.quantity,
        price: it.price,
        color: it.color,
        memoryGb: it.memoryGb,
      })),
      cartTotal: totalAmount,
      payableAmount,
    };

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/order/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        setSubmitError(
          data?.error ?? "Не удалось отправить заказ. Попробуйте ещё раз."
        );
        return;
      }

      if (payment === "crypto") {
        window.location.assign(HELOKET_CHECKOUT_URL);
        return;
      }

      onSuccess?.();
      setThanksOpen(true);
    } catch {
      setSubmitError("Ошибка сети. Проверьте подключение и попробуйте снова.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectClass = (active: boolean) =>
    `rounded-none border px-3 py-2.5 text-left text-[13px] leading-snug transition-colors focus:outline-none ${
      active
        ? "border-[#221f1f] bg-[#221f1f] text-white"
        : "border-[#c9c9c9] bg-white text-[#221f1f] hover:bg-[#f7f7f7]"
    }`;

  return (
    <TooltipProvider delayDuration={200}>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="flex max-h-[min(90dvh,720px)] flex-col gap-0 overflow-hidden p-0 sm:max-w-[520px] max-md:!top-4 max-md:!max-h-[min(calc(100dvh-1rem),720px)] max-md:!translate-y-0"
          showCloseButton
        >
          {thanksOpen ? (
            <>
              <DialogHeader className="shrink-0 px-4 pt-4 pr-12">
                <DialogTitle
                  className="text-[17px] font-semibold text-[#221f1f]"
                  style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                  Спасибо за заказ
                </DialogTitle>
              </DialogHeader>
              <p
                className="shrink-0 px-4 text-[14px] leading-relaxed text-[#626262]"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                С вами свяжется наш менеджер в ближайшее время по указанным
                контактам.
              </p>
              <DialogFooter className="mx-0 mb-0 shrink-0 px-4 pb-4 pt-3">
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="inline-flex h-[42px] items-center justify-center rounded-full bg-[#221f1f] px-5 text-[14px] uppercase leading-none text-white hover:bg-[#221f1f]/90 focus:outline-none"
                  style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                  Закрыть
                </button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader className="shrink-0 border-b border-[#e4e4e4] px-4 pb-3 pt-4 pr-12">
                <DialogTitle
                  className="text-[17px] font-semibold text-[#221f1f]"
                  style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                  Оформление заказа
                </DialogTitle>
              </DialogHeader>

              <div
                className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain px-4 py-4"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                <div className="space-y-2">
                  <Label htmlFor="checkout-name">Ваше имя</Label>
                  <Input
                    id="checkout-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Имя"
                    className="border-[#e4e4e4]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="checkout-phone">Ваш номер телефона</Label>
                  <Input
                    id="checkout-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+7 …"
                    className="border-[#e4e4e4]"
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-[14px] font-medium text-[#221f1f]">
                    Способ связи
                  </p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    {(
                      [
                        ["telegram", "Телеграм"],
                        ["instagram", "Инстаграм"],
                        ["whatsapp", "Вотсап"],
                      ] as const
                    ).map(([key, label]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setContactMethod(key)}
                        className={selectClass(contactMethod === key)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="checkout-comment">
                    Комментарий (необязательно)
                  </Label>
                  <Textarea
                    id="checkout-comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Пожелания к заказу"
                    className="min-h-[72px] border-[#e4e4e4] resize-y"
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-[14px] font-medium text-[#221f1f]">
                    Способ оплаты
                  </p>
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => setPayment("prepay")}
                      className={selectClass(payment === "prepay")}
                    >
                      <span className="block font-medium">
                        Предоплата на банковские реквизиты
                      </span>
                      <span className="mt-1 block text-[12px] opacity-90">
                        Сумма по каталогу: {formatPriceRub(totalAmount)}. При
                        предоплате: {formatPriceRub(prepayTotal)} (−5%)
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPayment("cod")}
                      className={selectClass(payment === "cod")}
                    >
                      <span className="flex items-start justify-between gap-2">
                        <span className="block font-medium text-left">
                          Наложенный платёж
                        </span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span
                              className="inline-flex shrink-0 rounded-full p-0.5 hover:bg-white/10 focus:outline-none"
                              onClick={(e) => e.stopPropagation()}
                              onPointerDown={(e) => e.stopPropagation()}
                            >
                              <CircleHelp
                                className="size-4 opacity-90"
                                aria-label="Пояснение"
                              />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent
                            side="top"
                            className="max-w-[280px] text-left"
                          >
                            {COD_TOOLTIP_TEXT}
                          </TooltipContent>
                        </Tooltip>
                      </span>
                      <span className="mt-1 block text-[12px] opacity-90">
                        К оплате при получении: {formatPriceRub(codTotal)} (+5%
                        к сумме при предоплате)
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPayment("crypto")}
                      className={selectClass(payment === "crypto")}
                    >
                      <span className="block font-medium">
                        Криптовалюта USDT TRC-20
                      </span>
                      <span className="mt-1 block text-[12px] opacity-90">
                        Переход на платёжный шлюз Хелекет
                      </span>
                    </button>
                  </div>
                </div>

                {payableForSelection != null && (
                  <p className="bg-[#f7f7f7] px-3 py-2 text-[14px] text-[#221f1f]">
                    К оплате по выбранному способу:{" "}
                    <strong>{formatPriceRub(payableForSelection)}</strong>
                  </p>
                )}

                <div className="space-y-2">
                  <p className="text-[14px] font-medium text-[#221f1f]">
                    Способ доставки
                  </p>
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => setDelivery("post")}
                      className={selectClass(delivery === "post")}
                    >
                      Доставка Почтой до отделения
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (payment === "cod") return;
                        setDelivery("courier");
                      }}
                      disabled={payment === "cod"}
                      className={`rounded-none border px-3 py-2.5 text-left text-[13px] leading-snug transition-colors focus:outline-none ${
                        payment === "cod"
                          ? "cursor-not-allowed border-[#e4e4e4] bg-[#f3f3f3] text-[#949494]"
                          : delivery === "courier"
                            ? "border-[#221f1f] bg-[#221f1f] text-white"
                            : "border-[#c9c9c9] bg-white text-[#221f1f] hover:bg-[#f7f7f7]"
                      }`}
                    >
                      Доставка курьером до двери
                      {payment === "cod" && (
                        <span className="mt-1 block text-[11px] font-normal">
                          Недоступно при наложенном платеже
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                {(delivery === "post" || delivery === "courier") && (
                  <div className="space-y-3 border border-[#e4e4e4] p-3">
                    <div className="space-y-2">
                      <Label htmlFor="checkout-city">Город</Label>
                      <Input
                        id="checkout-city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Город"
                        className="border-[#e4e4e4]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="checkout-address">Адрес</Label>
                      <Input
                        id="checkout-address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Отделение / улица, дом, квартира"
                        className="border-[#e4e4e4]"
                      />
                    </div>
                  </div>
                )}

                {submitError && (
                  <p className="text-[13px] text-[#b42318]">{submitError}</p>
                )}
              </div>

              <DialogFooter className="mx-0 mb-0 mt-0 shrink-0 justify-end border-t border-[#e4e4e4] bg-white px-4 py-3 sm:justify-end">
                <button
                  type="button"
                  onClick={() => void handlePlaceOrder()}
                  disabled={isSubmitting}
                  className="inline-flex h-[42px] w-full items-center justify-center rounded-full bg-[#221f1f] px-5 text-[14px] uppercase leading-none text-white hover:bg-[#221f1f]/90 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                  {isSubmitting ? "Отправка…" : "Оформить заказ"}
                </button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}

