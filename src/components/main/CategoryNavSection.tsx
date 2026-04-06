"use client";

import { useState } from "react";
import Link from "next/link";

import type { ProductCategory } from "@/lib/products-db";

const categories = [
  { name: "IPHONE", category: "iphone" as const, href: "/category/iphone" },
  {
    name: "IMAC и MACBOOK",
    category: "macbook" as const,
    href: "/category/macbook",
  },
  { name: "AIRPODS", category: "airpods" as const, href: "/category/airpods" },
  {
    name: "APPLE WATCH",
    category: "applewatch" as const,
    href: "/category/applewatch",
  },
  { name: "IPAD", category: "ipad" as const, href: "/category/ipad" },
] as const;

const hoverColor = "#221f1f";
const defaultColor = "#949494";

export function CategoryNavSection({
  counts,
}: {
  counts: Record<ProductCategory, number>;
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);

  return (
    <section id="catalog" className="bg-white py-14 md:py-20">
      <div className="mx-auto max-w-[1920px] px-[15px] md:px-6 lg:px-8">
        <nav
          aria-label="Каталог категорий"
          className="loom-category-nav flex flex-col items-center gap-4 text-center md:gap-6 leading-none uppercase"
        >
          {categories.map((cat) => {
            const isActive = hoveredId === cat.href || focusedId === cat.href;
            const nameColor = isActive ? hoverColor : defaultColor;
            const numberColor = isActive ? hoverColor : defaultColor;
            const n = counts[cat.category] ?? 0;
            const stackCountBelowMobile =
              cat.category === "iphone" ||
              cat.category === "airpods" ||
              cat.category === "ipad";

            return (
              <Link
                key={cat.href}
                href={cat.href}
                className={
                  stackCountBelowMobile
                    ? "flex max-w-full cursor-pointer flex-col items-center justify-center gap-1 py-1 transition-colors duration-300 focus:outline-none md:flex-row md:flex-wrap md:gap-x-3 md:gap-y-1"
                    : "flex max-w-full cursor-pointer flex-wrap items-center justify-center gap-x-3 gap-y-1 py-1 transition-colors duration-300 focus:outline-none"
                }
                onMouseEnter={() => setHoveredId(cat.href)}
                onMouseLeave={() => setHoveredId(null)}
                onFocus={() => setFocusedId(cat.href)}
                onBlur={() => setFocusedId(null)}
              >
                <span
                  className="text-[40px] font-normal leading-none md:text-[56px] lg:text-[72px]"
                  style={{ color: nameColor, transition: "color 0.3s ease" }}
                >
                  {cat.name}
                </span>
                <div
                  className="shrink-0 whitespace-nowrap text-[18px] font-normal leading-none md:text-[24px] lg:text-[30px]"
                  style={{ color: numberColor, transition: "color 0.3s ease" }}
                >
                  / {n} /
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
    </section>
  );
}
