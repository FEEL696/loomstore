import type { ProductCategory } from "@/lib/products-db";
import { getCategoryProductCounts } from "@/lib/products-db";
import { MODELS } from "@/lib/iphone-models";
import { getMacbookLines } from "@/lib/macbook-models";
import { getIpadLines } from "@/lib/ipad-models";

/** Числа как на страницах категорий: линейки Mac/iPad, модели iPhone, товары из БД для AirPods/Watch. */
export async function getCategoryNavCounts(): Promise<
  Record<ProductCategory, number>
> {
  const base = await getCategoryProductCounts();
  return {
    ...base,
    iphone: Object.keys(MODELS).length,
    macbook: getMacbookLines().length,
    ipad: getIpadLines().length,
  };
}
