"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type TouchEvent,
} from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const reviews = [
  {
    id: "1",
    text: "НАШЁЛ ЭТОТ МАГАЗИН НЕДАВНО И БЫЛ ОЧЕНЬ УДИВЛЁН ЦЕНАМИ И ПРЕИМУЩЕСТВАМИ МАГАЗИНА. ТЕПЕРЬ БУДУ ТОЛЬКО ЗДЕСЬ ЗАКУПАТЬСЯ ТЕХНИКОЙ. ОЧЕНЬ СОВЕТУЮ!",
    author: "ДЕНИС И.",
    date: "19/02/2026",
  },
  {
    id: "2",
    text: "ОТЛИЧНЫЙ МАГАЗИН! ЦЕНЫ ПРИЯТНО УДИВИЛИ, А ВЫБОР ТЕХНИКИ ПРОСТО ОГРОМНЫЙ. ТЕПЕРЬ Я ВАШ ПОСТОЯННЫЙ КЛИЕНТ! ВСЕМ РЕКОМЕНДУЮ!",
    author: "ВЛАДИСЛАВ А.",
    date: "19/02/2026",
  },
  {
    id: "3",
    text: "НЕДАВНО ОТКРЫЛ ДЛЯ СЕБЯ ЭТОТ МАГАЗИН, И БЫЛ ПРИЯТНО УДИВЛЁН АССОРТИМЕНТОМ И ОБСЛУЖИВАНИЕМ. ТЕПЕРЬ Я ВАШ ПОСТОЯННЫЙ ПОКУПАТЕЛЬ. СПАСИБО ЗА ОТЛИЧНЫЙ СЕРВИС!",
    author: "ИРИНА Е.",
    date: "19/02/2026",
  },
  {
    id: "4",
    text: "ЗАКАЗЫВАЛ MACBOOK И AIRPODS — ВСЁ ПРИШЛО БЫСТРО, УПАКОВКА ЦЕЛАЯ, ГАРАНТИЯ ОФОРМЛЕНА БЕЗ ВОПРОСОВ. РЕКОМЕНДУЮ LOOM STORE КОЛЛЕГАМ!",
    author: "АЛЕКСЕЙ М.",
    date: "22/02/2026",
  },
  {
    id: "5",
    text: "ПОКУПАЛ IPAD ДЛЯ РАБОТЫ — КОНСУЛЬТАЦИЯ ГРАМОТНАЯ, ДОСТАВКА В ДЕНЬ ЗАКАЗА. ОЧЕНЬ ДОВОЛЕН СЕРВИСОМ И ЦЕНОЙ!",
    author: "МАРИЯ К.",
    date: "25/02/2026",
  },
  {
    id: "6",
    text: "ДОЛГО ВЫБИРАЛ APPLE WATCH — ПОМОГЛИ С РАЗМЕРОМ РЕМЕШКА И НАСТРОЙКАМИ. ВСЁ ОБЪЯСНИЛИ, БЕЗ НАВЯЗЫВАНИЯ. СПАСИБО!",
    author: "СЕРГЕЙ П.",
    date: "26/02/2026",
  },
  {
    id: "7",
    text: "БРАЛ НАУШНИКИ AIRPODS PRO — ОРИГИНАЛ, ПРОВЕРИЛ ПО СЕРИЙНИКУ. МАГАЗИН ЧЕСТНЫЙ, БУДУ ЕЩЁ ЗАКАЗЫВАТЬ.",
    author: "ЕЛЕНА В.",
    date: "27/02/2026",
  },
  {
    id: "8",
    text: "ОФОРМИЛ РАССРОЧКУ НА IPHONE — БЕЗ СКРЫТЫХ КОМИССИЙ, ВСЁ ПРОЗРАЧНО. ПОДДЕРЖКА НА СВЯЗИ, ОТВЕТИЛИ БЫСТРО.",
    author: "КОНСТАНТИН Р.",
    date: "28/02/2026",
  },
];

const STARS = "★★★★★";

function useReviewPageSize(): 1 | 2 | 4 {
  const [pageSize, setPageSize] = useState<1 | 2 | 4>(1);

  const update = useCallback(() => {
    const w = window.innerWidth;
    if (w < 768) setPageSize(1);
    else if (w < 1200) setPageSize(2);
    else setPageSize(4);
  }, []);

  useLayoutEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  return pageSize;
}

export function ReviewsSection() {
  const pageSize = useReviewPageSize();
  const [offset, setOffset] = useState(0);
  const total = reviews.length;
  const maxOffset = Math.max(0, total - pageSize);
  const pctPerCard = total > 0 ? 100 / total : 0;
  const trackWidthPct = pageSize > 0 ? (total * 100) / pageSize : 100;

  useEffect(() => {
    setOffset((o) => Math.min(o, maxOffset));
  }, [maxOffset, pageSize]);

  const canPrev = offset > 0;
  const canNext = offset < maxOffset;

  const goPrev = () => {
    if (canPrev) setOffset((o) => Math.max(0, o - 1));
  };

  const goNext = () => {
    if (canNext) setOffset((o) => Math.min(maxOffset, o + 1));
  };

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const onTouchStart = (e: TouchEvent) => {
    if (e.touches.length !== 1) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e: TouchEvent) => {
    const sx = touchStartX.current;
    const sy = touchStartY.current;
    touchStartX.current = null;
    touchStartY.current = null;
    if (sx == null || sy == null || e.changedTouches.length !== 1) return;
    const dx = e.changedTouches[0].clientX - sx;
    const dy = e.changedTouches[0].clientY - sy;
    const threshold = 48;
    if (Math.abs(dx) < threshold || Math.abs(dx) <= Math.abs(dy)) return;
    if (dx > 0) goPrev();
    else goNext();
  };

  return (
    <section id="reviews" className="bg-white pb-16 pt-12">
      <div className="mx-auto max-w-[1920px] px-[15px] md:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h2
            className="max-w-[443px] text-[30px] font-normal leading-[1.2] tracking-[3px] text-[#221f1f]"
            style={{ fontFamily: "var(--font-charito), sans-serif" }}
          >
            <span className="block">ОТЗЫВЫ НАШИХ</span>
            <span className="block">ПОКУПАТЕЛЕЙ</span>
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goPrev}
              disabled={!canPrev}
              className="flex size-10 items-center justify-center rounded-full border border-[#e4e4e4] text-[#221f1f] hover:bg-[#f7f7f7] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#221f1f] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40"
              aria-label="Предыдущие отзывы"
            >
              <ChevronLeftIcon className="size-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={!canNext}
              className="flex size-10 items-center justify-center rounded-full border border-[#e4e4e4] text-[#221f1f] hover:bg-[#f7f7f7] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#221f1f] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40"
              aria-label="Следующие отзывы"
            >
              <ChevronRightIcon className="size-5" aria-hidden />
            </button>
          </div>
        </div>

        <div
          className="w-full overflow-hidden"
          aria-live="polite"
          aria-atomic="true"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <ul
            role="list"
            className="flex will-change-transform transition-transform duration-500 motion-reduce:transition-none motion-reduce:will-change-auto [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]"
            style={{
              width: `${trackWidthPct}%`,
              transform: `translateX(-${offset * pctPerCard}%)`,
            }}
          >
            {reviews.map((review) => (
              <li
                key={review.id}
                className="box-border min-w-0 shrink-0 px-3 first:pl-0 last:pr-0"
                style={{ flex: `0 0 ${pctPerCard}%` }}
              >
                <div className="flex h-full min-h-[280px] flex-col overflow-hidden rounded-none bg-[#fafafc] p-5 md:min-h-[300px] md:p-6">
                  <span className="mb-3 text-[18px] leading-none text-[#e5b318]" aria-hidden>
                    {STARS}
                  </span>
                  <span
                    className="mb-3 block text-[36px] leading-none text-[#221f1f] md:text-[40px]"
                    style={{ fontFamily: "var(--font-charito), sans-serif" }}
                    aria-hidden
                  >
                    "
                  </span>
                  <p
                    className="flex-1 text-[15px] font-normal uppercase leading-[1.45] text-[#221f1f] md:text-[16px]"
                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                  >
                    {review.text}
                  </p>
                  <div className="mt-4 flex flex-wrap items-baseline gap-2 border-t border-[#e4e4e4] pt-4">
                    <span
                      className="text-[16px] font-semibold uppercase leading-none text-[#221f1f] md:text-[17px]"
                      style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                    >
                      {review.author}
                    </span>
                    <span
                      className="text-[13px] font-normal leading-none text-[#949494]"
                      style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                    >
                      {review.date}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
