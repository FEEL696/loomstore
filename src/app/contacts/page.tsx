import Link from "next/link";
import { Instagram, Mail, MapPin, Phone, Send } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/** Условные реквизиты для отображения на сайте (подставьте актуальные при необходимости). */
const LEGAL_ADDRESS =
  "125047, г. Москва, вн. тер. г. муниципальный округ Тверской, ул. Тверская, д. 18, стр. 1, офис 204";

const SOLE_PROPRIETOR = {
  /** Условные данные — замените на актуальные */
  ip: "ИП Соколов Дмитрий Андреевич",
  inn: "770812345678",
} as const;

const contactLinks: {
  label: string;
  href: string;
  external?: boolean;
  icon: LucideIcon;
}[] = [
  { label: "Тг", href: "https://t.me/loomstore", external: true, icon: Send },
  {
    label: "Инст.",
    href: "https://instagram.com/",
    external: true,
    icon: Instagram,
  },
  { label: "Телефон", href: "tel:+78001234567", icon: Phone },
  { label: "Email", href: "mailto:info@loomstore.ru", icon: Mail },
];

export default function ContactsPage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-[1920px] px-[15px] py-6 md:px-6 md:py-8">
        <nav
          className="mb-4 text-[14px] text-[#878787]"
          style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          aria-label="Хлебные крошки"
        >
          <Link href="/" className="hover:text-[#221f1f]">
            Главная
          </Link>
          <span className="mx-1">/</span>
          <span className="font-medium text-[#221f1f]">Контакты</span>
        </nav>

        <h1 className="loom-promo-section-title mb-8">Контакты</h1>

        <ul className="mx-auto flex max-w-2xl flex-col items-center gap-3 pt-6 md:grid md:grid-cols-4 md:items-stretch md:gap-4 md:pt-0">
          {contactLinks.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.label} className="w-full max-w-sm md:max-w-none">
                <a
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-[#c9c9c9] bg-white px-4 text-[13px] font-normal uppercase leading-none text-[#221f1f] transition-colors hover:bg-[#f7f7f7] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#221f1f] focus-visible:ring-offset-2"
                  style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                  <Icon className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>

        <div
          className="mx-auto mt-12 max-w-2xl border-t border-[#e4e4e4] pt-10"
          style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
        >
          <h2 className="mb-4 text-[15px] font-medium leading-tight text-[#221f1f]">
            Адрес
          </h2>
          <p className="flex gap-2 text-[14px] leading-relaxed text-[#221f1f]">
            <MapPin
              className="mt-0.5 h-4 w-4 shrink-0 text-[#878787]"
              strokeWidth={2}
              aria-hidden
            />
            <span>{LEGAL_ADDRESS}</span>
          </p>

          <div className="mt-10 space-y-2 text-[14px] leading-relaxed text-[#221f1f]">
            <p>{SOLE_PROPRIETOR.ip}</p>
            <p>
              ИНН{" "}
              <span className="font-mono tabular-nums">{SOLE_PROPRIETOR.inn}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
