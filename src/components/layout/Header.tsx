"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Input } from "@/components/ui/input";
import { useCart } from "@/lib/cart";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "ГЛАВНАЯ", href: "/" },
  { label: "КАТАЛОГ", href: "/#catalog" },
  { label: "Акции", href: "/#promo-products" },
  { label: "СТАТЬИ", href: "/#articles" },
  { label: "ОТЗЫВЫ", href: "/#reviews" },
] as const;

type SearchHit = { slug: string; title: string; href: string };

function CartIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
      />
    </svg>
  );
}

const linkClassName =
  "flex h-[46px] items-center justify-center rounded-full border border-[#c9c9c9] bg-white px-5 py-3 text-center text-[14px] font-normal uppercase leading-none text-[#221f1f] hover:bg-[#f7f7f7] focus:outline-none";

const homeLinkClassName =
  "flex h-[46px] items-center justify-center rounded-full border border-[#221f1f] bg-[#221f1f] px-5 py-3 text-center text-[14px] font-normal uppercase leading-none text-white hover:bg-[#221f1f]/90 focus:outline-none";

function useDebouncedSearch(query: string, delayMs: number) {
  const [results, setResults] = useState<SearchHit[]>([]);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setPending(false);
      return;
    }
    setPending(true);
    const t = window.setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(q)}`,
          { cache: "no-store" }
        );
        if (!res.ok) {
          setResults([]);
          return;
        }
        const data = (await res.json()) as { results?: SearchHit[] };
        setResults(data.results ?? []);
      } catch {
        setResults([]);
      } finally {
        setPending(false);
      }
    }, delayMs);
    return () => window.clearTimeout(t);
  }, [query, delayMs]);

  return { results, pending };
}

export function Header() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const [query, setQuery] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const mobileSearchRef = useRef<HTMLDivElement | null>(null);
  const { results, pending } = useDebouncedSearch(query, 320);

  const closeMobileSearch = useCallback(() => {
    setMobileSearchOpen(false);
    setQuery("");
  }, []);

  useEffect(() => {
    if (!mobileSearchOpen) return;
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      const el = mobileSearchRef.current;
      if (el && !el.contains(e.target as Node)) {
        closeMobileSearch();
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [mobileSearchOpen, closeMobileSearch]);

  const searchDropdown = (compact: boolean) => (
    <ul
      className={cn(
        "absolute top-full z-50 mt-1 max-h-[min(60vh,320px)] w-full overflow-y-auto border border-[#e4e4e4] bg-white py-1 shadow-md",
        compact ? "left-0 right-0" : "left-0"
      )}
      role="listbox"
    >
      {pending && query.trim().length >= 2 && (
        <li className="px-3 py-2 text-[13px] text-[#949494]">Поиск…</li>
      )}
      {!pending &&
        results.length === 0 &&
        query.trim().length >= 2 && (
          <li className="px-3 py-2 text-[13px] text-[#949494]">Ничего не найдено</li>
        )}
      {results.map((r) => (
        <li key={r.slug} role="option">
          <Link
            href={r.href}
            className="block px-3 py-2.5 text-left text-[14px] text-[#221f1f] hover:bg-[#f7f7f7]"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            onClick={() => {
              setQuery("");
              closeMobileSearch();
            }}
          >
            {r.title}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-[#e4e4e4] bg-white">
      <div className="mx-auto flex max-w-[1920px] items-end gap-2 px-[15px] py-3 md:px-6 lg:px-8">
        <Link
          href="/"
          className={cn(
            "flex shrink-0 flex-col text-[20px] font-bold leading-[0.85] text-[#221f1f] transition-[opacity,width] duration-200 focus:outline-none min-[1200px]:opacity-100",
            mobileSearchOpen &&
              "max-md:pointer-events-none max-md:w-0 max-md:min-w-0 max-md:overflow-hidden max-md:opacity-0 min-[1200px]:pointer-events-auto min-[1200px]:w-auto min-[1200px]:opacity-100"
          )}
          style={{ fontFamily: "var(--font-akony), sans-serif" }}
          aria-label="Loom Store — главная"
        >
          <span>LOOM</span>
          <span>STORE</span>
        </Link>

        <nav
          className="hidden flex-1 items-center justify-center min-[1200px]:flex"
          aria-label="Основная навигация"
        >
          <ul className="flex flex-wrap items-center justify-center gap-3">
            {navItems.map((item) => {
              const isHome = item.href === "/";
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={isHome ? homeLinkClassName : linkClassName}
                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                    aria-current={
                      item.href === "/" && pathname === "/" ? "page" : undefined
                    }
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div
          ref={mobileSearchRef}
          className={cn(
            "relative min-w-0 flex-1 min-[1200px]:w-[280px] min-[1200px]:max-w-[280px] min-[1200px]:flex-none xl:w-[367px] xl:max-w-[367px]",
            mobileSearchOpen && "z-30 min-[1200px]:z-auto"
          )}
        >
          <div className="relative hidden min-[1200px]:block">
            <Input
              type="search"
              placeholder="Поиск"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-[46px] w-full rounded-full border-[#e4e4e4] bg-white px-4 text-[14px] placeholder:font-[family-name:var(--font-montserrat),sans-serif] placeholder:text-[#949494]"
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              aria-label="Поиск по сайту"
              aria-autocomplete="list"
            />
            {query.trim().length >= 2 && searchDropdown(false)}
          </div>

          <div className="flex min-w-0 flex-1 items-center justify-end gap-2 min-[1200px]:hidden">
            {!mobileSearchOpen ? (
              <button
                type="button"
                onClick={() => setMobileSearchOpen(true)}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#c9c9c9] bg-white text-[#221f1f] hover:bg-[#f7f7f7] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#221f1f] focus-visible:ring-offset-2"
                aria-label="Открыть поиск"
              >
                <Search className="size-5" aria-hidden />
              </button>
            ) : (
              <div className="relative flex min-w-0 w-full flex-1 items-center gap-2">
                <Input
                  type="search"
                  placeholder="Поиск"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                  className="h-11 min-w-0 flex-1 rounded-full border-[#e4e4e4] bg-white px-4 text-[14px] placeholder:font-[family-name:var(--font-montserrat),sans-serif] placeholder:text-[#949494]"
                  style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                  aria-label="Поиск по сайту"
                />
                <button
                  type="button"
                  onClick={closeMobileSearch}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#c9c9c9] bg-white text-[#221f1f] hover:bg-[#f7f7f7] focus:outline-none"
                  aria-label="Закрыть поиск"
                >
                  <X className="size-5" aria-hidden />
                </button>
                {query.trim().length >= 2 && (
                  <div className="absolute left-0 right-12 top-full z-50 mt-1">
                    {searchDropdown(true)}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <Link
          href="/cart"
          className="relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#c9c9c9] bg-white text-[#221f1f] hover:bg-[#f7f7f7] focus:outline-none min-[1200px]:hidden"
          aria-label={
            totalItems > 0
              ? `Корзина, товаров: ${totalItems}`
              : "Корзина"
          }
        >
          <CartIcon className="size-5 shrink-0" />
          {totalItems > 0 && (
            <span
              className="absolute -right-1.5 -top-1.5 inline-flex min-h-5 min-w-5 items-center justify-center bg-[#d31b1b] px-1 text-[11px] font-semibold leading-none text-white"
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              {totalItems}
            </span>
          )}
        </Link>

        <Link
          href="/cart"
          className="hidden h-[46px] shrink-0 items-center justify-center gap-2 rounded-full border border-[#c9c9c9] bg-white px-5 py-3 text-[14px] font-normal uppercase leading-none text-[#221f1f] hover:bg-[#f7f7f7] focus:outline-none min-[1200px]:inline-flex"
          style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
        >
          КОРЗИНА
          <span className="relative inline-flex">
            <CartIcon className="size-5 shrink-0" />
            {totalItems > 0 && (
              <span
                className="absolute -right-2 -top-2 inline-flex min-h-5 min-w-5 items-center justify-center bg-[#d31b1b] px-1 text-[11px] font-semibold leading-none text-white"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                {totalItems}
              </span>
            )}
          </span>
        </Link>

        <div className="flex shrink-0 min-[1200px]:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#c9c9c9] bg-white text-[#221f1f] hover:bg-[#f7f7f7] focus:outline-none"
                aria-label="Открыть меню"
              >
                <Menu className="size-6" aria-hidden />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(100vw,320px)]">
              <SheetHeader>
                <SheetTitle
                  className="text-left"
                  style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                  Меню
                </SheetTitle>
              </SheetHeader>
              <nav aria-label="Мобильная навигация" className="flex flex-col gap-2 px-4 pb-6">
                {navItems.map((item) => {
                  const isHome = item.href === "/";
                  return (
                    <SheetClose asChild key={item.href}>
                      <Link
                        href={item.href}
                        className={isHome ? homeLinkClassName : linkClassName}
                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                      >
                        {item.label}
                      </Link>
                    </SheetClose>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
