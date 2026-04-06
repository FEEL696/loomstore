import type { Product } from "@/lib/products-db";

export function getProductPageHref(product: Product): string {
  if (product.category === "iphone") {
    return `/category/iphone/${product.slug}`;
  }
  if (product.category === "ipad") {
    return `/category/ipad/${product.slug}`;
  }
  if (product.category === "macbook") {
    return `/category/macbook/${product.slug}`;
  }
  return `/product/${product.slug}`;
}
