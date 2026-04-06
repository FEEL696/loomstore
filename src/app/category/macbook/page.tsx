import Link from "next/link";
import Image from "next/image";
import { getMacbookLines } from "@/lib/macbook-models";
import { formatModelCountRu } from "@/lib/catalog-ui";
import { cn } from "@/lib/utils";

export default function MacbookCategoryPage() {
  const lines = getMacbookLines();

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
          <span className="font-medium text-[#221f1f]">MacBook и iMac</span>
        </nav>

        <h1 className="loom-promo-section-title mb-8">MacBook и iMac</h1>

        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 min-[1200px]:grid-cols-3 xl:grid-cols-4">
          {lines.map((line) => (
            <li key={line.slug}>
              <Link
                href={`/category/macbook/${line.slug}`}
                className={cn(
                  "flex aspect-square max-w-full cursor-pointer flex-col overflow-hidden rounded-none border border-[#e4e4e4] bg-white shadow-sm transition-shadow hover:shadow-md"
                )}
              >
                <div className="relative min-h-0 flex-1 overflow-hidden rounded-none bg-white">
                  <div className="absolute inset-0 flex items-center justify-center p-2">
                    <div className="relative h-[80%] w-[80%] max-h-full max-w-full">
                      <Image
                        src={line.previewUrl ?? "/main/iPhone_main.png"}
                        alt={line.lineName}
                        fill
                        className="object-contain object-center"
                        sizes="(max-width: 640px) 50vw, 33vw"
                        unoptimized
                      />
                    </div>
                  </div>
                </div>
                <div className="shrink-0 border-t border-[#e4e4e4] p-3 pt-2 text-center">
                  <h2
                    className="text-[15px] font-normal leading-tight text-[#221f1f]"
                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                  >
                    {line.lineName}
                  </h2>
                  <p
                    className="text-[13px] font-normal text-[#949494]"
                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                  >
                    {formatModelCountRu(line.count)}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
