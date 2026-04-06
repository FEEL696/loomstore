/** Подписи для карточек категорий (модели / цены). */

export function formatPriceRub(value: number): string {
  return new Intl.NumberFormat("ru-RU").format(value) + " Р";
}

/** «от 99 196 Р» для карточки товара в списке моделей линейки. */
export function formatMinPriceSubtitle(
  product: { variants: { price: number }[] } | null
): string {
  if (!product?.variants?.length) return "Подробнее";
  const min = Math.min(...product.variants.map((v) => v.price));
  return `от ${formatPriceRub(min)}`;
}

/** «от … Р» только по вариантам с выбранным цветом (карточки iPad по цвету). */
export function formatMinPriceSubtitleForColor(
  product: { variants: { price: number; color: string }[] } | null,
  color: string
): string {
  if (!product?.variants?.length) return "Подробнее";
  const match = product.variants.filter(
    (v) =>
      v.color === color ||
      v.color.localeCompare(color, "ru", { sensitivity: "accent" }) === 0
  );
  const pool = match.length > 0 ? match : product.variants;
  const min = Math.min(...pool.map((v) => v.price));
  return `от ${formatPriceRub(min)}`;
}

/** «4 модели», «1 модель», «32 модели» — для плашек линеек iPad / Mac. */
export function formatModelCountRu(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  let word: string;
  if (mod100 >= 11 && mod100 <= 14) word = "моделей";
  else if (mod10 === 1) word = "модель";
  else if (mod10 >= 2 && mod10 <= 4) word = "модели";
  else word = "моделей";
  return `${n} ${word}`;
}

/** «4 цвета», «1 цвет» — для плашек линеек iPad (скан папок). */
export function formatColorCountRu(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  let word: string;
  if (mod100 >= 11 && mod100 <= 14) word = "цветов";
  else if (mod10 === 1) word = "цвет";
  else if (mod10 >= 2 && mod10 <= 4) word = "цвета";
  else word = "цветов";
  return `${n} ${word}`;
}
