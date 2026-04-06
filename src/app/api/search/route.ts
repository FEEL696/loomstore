import { NextResponse, type NextRequest } from "next/server";

import { searchProducts } from "@/lib/products-db";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? "";
  const results = await searchProducts(q, 12);
  return NextResponse.json({ results });
}
