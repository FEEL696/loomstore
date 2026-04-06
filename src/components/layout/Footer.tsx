"use client";

import Link from "next/link";
import { ArrowUpIcon } from "@heroicons/react/24/outline";

const navItems = [
  { label: "ГЛАВНАЯ", href: "/" },
  { label: "КАТАЛОГ", href: "/#catalog" },
  { label: "Акции", href: "/#promo-products" },
  { label: "СТАТЬИ", href: "/#articles" },
  { label: "ОТЗЫВЫ", href: "/#reviews" },
] as const;

const legalLinkClass =
  "uppercase hover:underline outline-none ring-0 ring-offset-0 focus:outline-none focus-visible:outline-none";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="overflow-hidden bg-white pb-0 pt-12">
      <div className="mx-auto max-w-[1920px] px-[15px] pb-10 md:px-6 lg:px-8">
        <div className="flex flex-col gap-10">
          <div className="flex justify-center">
            <button
              type="button"
              onClick={scrollToTop}
              className="flex size-12 items-center justify-center rounded-full border border-[#e4e4e4] bg-[#f7f7f7] text-[#221f1f] hover:bg-[#eee] focus:outline-none"
              aria-label="Наверх"
            >
              <ArrowUpIcon className="size-5" aria-hidden />
            </button>
          </div>

          <nav aria-label="Навигация в подвале">
            <ul className="flex flex-wrap items-center justify-center gap-3">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex h-[46px] items-center justify-center rounded-full border border-[#c9c9c9] bg-white px-5 py-3 text-center text-[14px] font-normal uppercase leading-none text-[#221f1f] hover:bg-[#f7f7f7] focus:outline-none focus:ring-2 focus:ring-[#221f1f] focus:ring-offset-2"
                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div
            className="w-full pt-6 text-[13px] font-normal text-[#878787] md:text-[14px]"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            <div className="flex min-[1200px]:hidden flex-col gap-3 items-start text-left">
              <p className="uppercase leading-snug">
                LOOMSTORE © 2026. ВСЕ ПРАВА ЗАЩИЩЕНЫ
              </p>
              <Link href="/contacts" className={`self-start ${legalLinkClass}`}>
                КОНТАКТЫ
              </Link>
              <Link href="/delivery" className={`self-start ${legalLinkClass}`}>
                ДОСТАВКА И ОПЛАТА
              </Link>
              <Link href="/privacy" className={`self-start ${legalLinkClass}`}>
                ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ
              </Link>
            </div>

            <div className="relative hidden w-full min-[1200px]:flex min-[1200px]:min-h-[2.75rem] min-[1200px]:items-center">
              <p className="min-w-0 flex-1 text-left uppercase leading-snug">
                LOOMSTORE © 2026. ВСЕ ПРАВА ЗАЩИЩЕНЫ
              </p>
              <div className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 gap-6">
                <Link href="/contacts" className={`pointer-events-auto ${legalLinkClass}`}>
                  КОНТАКТЫ
                </Link>
                <Link href="/delivery" className={`pointer-events-auto ${legalLinkClass}`}>
                  ДОСТАВКА И ОПЛАТА
                </Link>
              </div>
              <Link
                href="/privacy"
                className={`min-w-0 flex-1 text-right uppercase leading-snug ${legalLinkClass}`}
              >
                ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-loom-logo-wrap w-full overflow-hidden leading-[0.85]">
        <p
          className="footer-loom-logo-mobile m-0 w-full pb-0 pt-0 text-center md:hidden"
          aria-hidden
        >
          <span className="block">LOOM</span>
          <span className="block">STORE</span>
        </p>
        <p className="footer-loom-logo m-0 hidden w-full pb-0 pt-0 text-center md:block" aria-hidden>
          LOOM STORE
        </p>
      </div>
    </footer>
  );
}
