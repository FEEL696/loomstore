"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRightIcon, ArrowDownIcon } from "@heroicons/react/24/outline";

const SLIDES = [
  { image: "/Main/AppleWatch_main.png", text: "Скидка за оплату безналом" },
  { image: "/Main/AitPods_main.png", text: "Гарантия 3 года" },
  { image: "/Main/iPhone_main.png", text: "Только оригинальный товар" },
  { image: "/Main/MacBook_main.png", text: "15000 товаров доставлено" },
  { image: "/Main/iPad_main.png", text: "Бери сейчас - плати потом" },
  { image: "/Main/Naushniki_main.png", text: "Рассрочка без процентов" },
] as const;

/** Порядок слайдов: 0 Apple Watch, 1 AirPods, 2 iPhone, 3 MacBook, 4 iPad, 5 Naushniki (AirPods Max) */
const ROW1 = [
  { label: "iPhone", slideIndex: 2 },
  { label: "iPad", slideIndex: 4 },
  { label: "Mac", slideIndex: 3 },
  { label: "AirPods", slideIndex: 1 },
] as const;
const ROW2 = [
  { label: "Apple Watch", slideIndex: 0 },
  { label: "AirPods Max", slideIndex: 5 },
] as const;

const SLIDE_DURATION_MS = 4000;

const heroTitleClass =
  "loom-hero-store-title whitespace-nowrap font-normal leading-none text-[#221f1f]";

const founderCardClassName =
  "loom-founder-card inline-flex max-w-[min(100%,calc(100vw-30px))] items-center gap-2 border border-[#c9c9c9] bg-white px-2 py-1.5 transition-[border-color,background-color,box-shadow] duration-200 hover:border-[#221f1f] focus:outline-none focus:ring-2 focus:ring-[#221f1f] focus:ring-offset-2 min-[1200px]:gap-3 min-[1200px]:px-3 min-[1200px]:py-2.5";

function FounderCard() {
  return (
    <a
      href="#founder"
      className={founderCardClassName}
    >
      <Image
        src="/Main/ava_founder.png"
        alt="Дмитрий Пуртов"
        width={32}
        height={32}
        className="size-8 shrink-0 rounded-full object-cover min-[1200px]:size-10"
      />
      <div className="flex min-w-0 flex-col gap-0.5">
        <span
          className="text-[10px] font-normal leading-none text-[#535353] min-[1200px]:text-[12px]"
          style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
        >
          Основатель магазина
        </span>
        <span
          className="text-[13px] font-medium leading-none text-[#221f1f] min-[1200px]:text-[16px]"
          style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
        >
          Дмитрий Пуртов
        </span>
      </div>
      <ArrowUpRightIcon className="size-4 shrink-0 text-[#221f1f] min-[1200px]:size-5" aria-hidden />
    </a>
  );
}

export function MainSection() {
  const [index, setIndex] = useState(0);
  const [autoplayEpoch, setAutoplayEpoch] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, SLIDE_DURATION_MS);
    return () => clearInterval(id);
  }, [autoplayEpoch]);

  const goToSlide = (slideIndex: number) => {
    setIndex(slideIndex);
    setAutoplayEpoch((n) => n + 1);
  };

  const slide = SLIDES[index];

  return (
    <section className="relative min-h-[85vh] w-full overflow-x-hidden overflow-y-visible bg-white max-[1199px]:min-h-[100svh]">
      {/* Планшет md–1199: вертикально центрированная колонка; основатель над LOOM STORE */}
      <div className="relative z-20 hidden min-h-[100svh] w-full flex-col md:max-[1199px]:flex">
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 pb-4 pt-14 [@media(max-height:720px)]:pt-10">
          <div className="mx-auto flex w-full max-w-[min(100%,560px)] flex-col items-start">
            <FounderCard />
            <div className="relative mt-5 h-[min(52vw,340px)] w-full min-h-[200px] [@media(max-height:720px)]:mt-4 [@media(max-height:720px)]:h-[min(46vw,300px)]">
              <div
                className="pointer-events-none absolute left-1/2 top-[46%] z-0 flex -translate-x-1/2 -translate-y-1/2 justify-center"
                aria-hidden
              >
                <span
                  className={heroTitleClass}
                  style={{ fontFamily: "var(--font-charito), sans-serif" }}
                >
                  LOOM STORE
                </span>
              </div>
              <div
                className="absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
                aria-hidden
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.96, x: 16 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.98, x: -16 }}
                    transition={{ duration: 0.35 }}
                    className="relative h-[min(44vw,300px)] w-[min(44vw,300px)] md:h-[min(38vw,280px)] md:w-[min(38vw,280px)]"
                    style={{ transform: "rotate(-5deg)" }}
                  >
                    <Image
                      src={slide.image}
                      alt=""
                      fill
                      className="object-contain"
                      sizes="(max-width: 1199px) 300px, 500px"
                      priority
                      unoptimized
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
            <div className="relative z-20 mt-3 flex min-h-[3.25rem] w-full max-w-lg items-center justify-center self-center text-center md:min-h-[3.5rem]">
              <AnimatePresence mode="wait">
                <motion.p
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="loom-promo-text"
                >
                  {slide.text}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </div>
        <div className="shrink-0 px-[15px] pb-8 pt-2">
          <p className="loom-hero-lead max-w-[640px]">
            iPhone, MacBook, iPad и аксессуары Apple с гарантией, быстрой доставкой и профессиональной поддержкой
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <div className="flex flex-wrap gap-2">
              {ROW1.map((cat) => {
                const active = index === cat.slideIndex;
                return (
                  <button
                    key={cat.label}
                    type="button"
                    onClick={() => goToSlide(cat.slideIndex)}
                    className={
                      active
                        ? "rounded-full border border-[#c9c9c9] bg-[#221f1f] px-2.5 py-2 text-[13px] leading-none text-white sm:px-3 sm:text-[14px]"
                        : "rounded-full border border-[#c9c9c9] bg-white px-2.5 py-2 text-[13px] leading-none text-[#221f1f] hover:bg-[#f7f7f7] sm:px-3 sm:text-[14px]"
                    }
                    style={{ fontFamily: "var(--font-etude), sans-serif" }}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
            <div className="flex flex-wrap gap-2">
              {ROW2.map((cat) => {
                const active = index === cat.slideIndex;
                return (
                  <button
                    key={cat.label}
                    type="button"
                    onClick={() => goToSlide(cat.slideIndex)}
                    className={
                      active
                        ? "rounded-full border border-[#c9c9c9] bg-[#221f1f] px-2.5 py-2 text-[13px] leading-none text-white sm:px-3 sm:text-[14px]"
                        : "rounded-full border border-[#c9c9c9] bg-white px-2.5 py-2 text-[13px] leading-none text-[#221f1f] hover:bg-[#f7f7f7] sm:px-3 sm:text-[14px]"
                    }
                    style={{ fontFamily: "var(--font-etude), sans-serif" }}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex justify-center pt-4">
            <a
              href="#catalog"
              className="flex size-12 items-center justify-center rounded-full border border-[#e4e4e4] bg-[#f7f7f7] text-[#221f1f] hover:bg-[#eee] focus:outline-none focus:ring-2 focus:ring-[#221f1f] focus:ring-offset-2"
              aria-label="Перейти к каталогу"
            >
              <ArrowDownIcon className="size-5 shrink-0" aria-hidden />
            </a>
          </div>
        </div>
      </div>

      {/* Основатель: мобила и десктоп ≥1200; с 1920 — .loom-hero-inset-left как у шапки */}
      <div className="loom-hero-inset-left absolute left-[15px] top-14 z-20 md:max-[1199px]:hidden md:left-8 md:top-[calc(45%-108px)] min-[1200px]:top-[calc(50%-130px)] lg:left-12">
        <FounderCard />
      </div>

      {/* Десктоп: сменяющийся текст справа — нижний край чуть выше верхнего края LOOM STORE (масштаб с --loom-store-word-size) */}
      <div
        className="loom-hero-inset-right absolute right-[15px] z-20 hidden max-w-[min(100%,calc(100vw-30px))] -translate-y-full text-right min-[1200px]:block md:right-8 lg:right-12"
        style={{
          top: "calc(50% - 0.5 * var(--loom-store-word-size, 10rem) - 0.75rem)",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="loom-promo-text"
          >
            {slide.text}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Центр: LOOM STORE — слой под картинкой (z-0); с 1920 — max-w + px-8 как у шапки; ширина текста — .loom-hero-store-title */}
      <div
        className="pointer-events-none absolute left-1/2 top-[36%] z-0 flex w-full max-w-[100vw] -translate-x-1/2 items-center justify-center px-[15px] max-md:translate-y-[calc(-50%-40px)] md:max-[1199px]:hidden min-[1200px]:top-1/2 min-[1200px]:-translate-y-1/2 min-[1920px]:max-w-[1920px] min-[1920px]:min-w-0 min-[1920px]:overflow-x-clip min-[1920px]:px-8"
        aria-hidden
      >
        <span
          className={heroTitleClass}
          style={{ fontFamily: "var(--font-charito), sans-serif" }}
        >
          LOOM STORE
        </span>
      </div>

      {/* Картинка — мобила и десктоп ≥1200 */}
      <div
        className="absolute left-1/2 top-[40%] z-10 flex -translate-x-1/2 translate-y-[calc(-50%-120px)] items-center justify-center max-md:translate-y-[calc(-50%-80px)] md:max-[1199px]:hidden min-[1200px]:top-1/2 min-[1200px]:-translate-y-1/2"
        aria-hidden
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.96, x: 16 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.98, x: -16 }}
            transition={{ duration: 0.35 }}
            className="relative h-[min(43.2vw,192px)] w-[min(43.2vw,192px)] sm:h-[380px] sm:w-[380px] md:h-[min(46vw,500px)] md:w-[min(46vw,500px)] lg:h-[500px] lg:w-[500px]"
            style={{ transform: "rotate(-5deg)" }}
          >
            <Image
              src={slide.image}
              alt=""
              fill
              className="object-contain"
              sizes="(max-width: 639px) 192px, (max-width: 768px) 380px, 500px"
              priority
              unoptimized
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Мобильный: сменяющийся текст под изображением */}
      <div
        className="absolute left-1/2 top-[calc(40%+min(21.6vw,96px)+0.75rem)] z-20 hidden w-[min(100%,calc(100vw-30px))] -translate-x-1/2 px-4 text-center max-md:block max-md:-translate-y-[88px] md:max-[1199px]:hidden min-[1200px]:hidden"
      >
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="loom-promo-text"
          >
            {slide.text}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Мобила: описание, кнопки слайдов и стрелка */}
      <div className="absolute inset-x-0 bottom-0 z-20 hidden max-md:flex max-md:-translate-y-[80px] flex-col gap-4 px-[15px] pb-6 md:max-[1199px]:hidden">
        <p className="loom-hero-lead max-w-[640px]">
          iPhone, MacBook, iPad и аксессуары Apple с гарантией, быстрой доставкой и профессиональной поддержкой
        </p>
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            {ROW1.map((cat) => {
              const active = index === cat.slideIndex;
              return (
                <button
                  key={cat.label}
                  type="button"
                  onClick={() => goToSlide(cat.slideIndex)}
                  className={
                    active
                      ? "rounded-full border border-[#c9c9c9] bg-[#221f1f] px-2.5 py-2 text-[13px] leading-none text-white sm:px-3 sm:text-[14px]"
                      : "rounded-full border border-[#c9c9c9] bg-white px-2.5 py-2 text-[13px] leading-none text-[#221f1f] hover:bg-[#f7f7f7] sm:px-3 sm:text-[14px]"
                  }
                  style={{ fontFamily: "var(--font-etude), sans-serif" }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-2">
            {ROW2.map((cat) => {
              const active = index === cat.slideIndex;
              return (
                <button
                  key={cat.label}
                  type="button"
                  onClick={() => goToSlide(cat.slideIndex)}
                  className={
                    active
                      ? "rounded-full border border-[#c9c9c9] bg-[#221f1f] px-2.5 py-2 text-[13px] leading-none text-white sm:px-3 sm:text-[14px]"
                      : "rounded-full border border-[#c9c9c9] bg-white px-2.5 py-2 text-[13px] leading-none text-[#221f1f] hover:bg-[#f7f7f7] sm:px-3 sm:text-[14px]"
                  }
                  style={{ fontFamily: "var(--font-etude), sans-serif" }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex justify-center pt-1">
          <a
            href="#catalog"
            className="flex size-12 items-center justify-center rounded-full border border-[#e4e4e4] bg-[#f7f7f7] text-[#221f1f] hover:bg-[#eee] focus:outline-none focus:ring-2 focus:ring-[#221f1f] focus:ring-offset-2"
            aria-label="Перейти к каталогу"
          >
            <ArrowDownIcon className="size-5 shrink-0" aria-hidden />
          </a>
        </div>
      </div>

      {/* ≥1200: описание слева снизу */}
      <div className="loom-hero-inset-left absolute bottom-6 left-[15px] z-20 hidden max-w-[min(455px,calc(100vw-30px))] min-[1200px]:block md:left-8 lg:left-12">
        <p className="loom-hero-lead">
          iPhone, MacBook, iPad и аксессуары Apple с гарантией, быстрой доставкой и профессиональной поддержкой
        </p>
      </div>

      {/* ≥1200: плашки справа снизу */}
      <div className="loom-hero-inset-right absolute bottom-6 right-[15px] z-20 hidden max-w-[calc(100vw-30px)] min-[1200px]:flex min-[1200px]:flex-col min-[1200px]:items-end min-[1200px]:gap-3 md:right-8 md:gap-4 lg:right-12">
        <div className="flex flex-wrap justify-end gap-3 md:gap-4">
          {ROW1.map((cat) => {
            const active = index === cat.slideIndex;
            return (
              <button
                key={cat.label}
                type="button"
                onClick={() => goToSlide(cat.slideIndex)}
                className={
                  active
                    ? "rounded-full border border-[#c9c9c9] bg-[#221f1f] px-5 py-3 text-[16px] leading-none text-white"
                    : "rounded-full border border-[#c9c9c9] bg-white px-5 py-3 text-[16px] leading-none text-[#221f1f] hover:bg-[#f7f7f7]"
                }
                style={{ fontFamily: "var(--font-etude), sans-serif" }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
        <div className="flex w-full flex-wrap justify-end gap-3 self-stretch md:gap-4">
          {ROW2.map((cat) => {
            const active = index === cat.slideIndex;
            return (
              <button
                key={cat.label}
                type="button"
                onClick={() => goToSlide(cat.slideIndex)}
                className={
                  active
                    ? "rounded-full border border-[#c9c9c9] bg-[#221f1f] px-5 py-3 text-[16px] leading-none text-white"
                    : "rounded-full border border-[#c9c9c9] bg-white px-5 py-3 text-[16px] leading-none text-[#221f1f] hover:bg-[#f7f7f7]"
                }
                style={{ fontFamily: "var(--font-etude), sans-serif" }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      <a
        href="#catalog"
        className="absolute bottom-6 left-1/2 z-30 hidden size-12 -translate-x-1/2 items-center justify-center rounded-full border border-[#e4e4e4] bg-[#f7f7f7] text-[#221f1f] hover:bg-[#eee] focus:outline-none focus:ring-2 focus:ring-[#221f1f] focus:ring-offset-2 min-[1200px]:flex"
        aria-label="Перейти к каталогу"
      >
        <ArrowDownIcon className="size-5 shrink-0" aria-hidden />
      </a>
    </section>
  );
}
