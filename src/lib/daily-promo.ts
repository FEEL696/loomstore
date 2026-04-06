/** Календарный день акции (одинаковый набор товаров для всех клиентов). */
export const PROMO_DATE_TIMEZONE = "Europe/Moscow";

export const PROMO_DISCOUNT_RATE = 0.07;

/** Без импорта БД — безопасно для client components. */
export function getPromoCalendarDateKey(date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: PROMO_DATE_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function hashString(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5) >>> 0;
    t = Math.imul(t ^ (t >>> 15), t | 1) >>> 0;
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61) >>> 0;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  const rnd = mulberry32(seed);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** До 4 уникальных slug на дату `dateKey` (YYYY-MM-DD). */
export function pickDailyPromoSlugs(
  allSlugs: string[],
  dateKey: string
): string[] {
  if (allSlugs.length === 0) return [];
  const seed = hashString(dateKey);
  const shuffled = seededShuffle(allSlugs, seed);
  return shuffled.slice(0, Math.min(4, shuffled.length));
}

export function applyDailyPromoPrice(price: number): number {
  return Math.round(price * (1 - PROMO_DISCOUNT_RATE));
}
