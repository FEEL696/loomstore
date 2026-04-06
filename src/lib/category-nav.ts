import type { ProductCategory } from "@/lib/products-db";

export function getCategoryBreadcrumb(category: ProductCategory): {
  href: string;
  label: string;
} {
  switch (category) {
    case "iphone":
      return { href: "/category/iphone", label: "iPhone" };
    case "ipad":
      return { href: "/category/ipad", label: "iPad" };
    case "macbook":
      return { href: "/category/macbook", label: "MacBook и iMac" };
    case "airpods":
      return { href: "/category/airpods", label: "AirPods" };
    case "applewatch":
      return { href: "/category/applewatch", label: "Apple Watch" };
    default:
      return { href: "/", label: "Каталог" };
  }
}
