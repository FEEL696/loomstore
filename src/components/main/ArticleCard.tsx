import Image from "next/image";

import type { ArticleItem } from "@/lib/articles";

export function ArticleCard({ article }: { article: ArticleItem }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-none border border-[#e4e4e4] bg-white shadow-sm transition-[border-color,box-shadow,background-color] duration-300 ease-out hover:border-[#221f1f] hover:bg-[#fafafa] hover:shadow-md">
      <div className="relative h-[180px] w-full shrink-0 overflow-hidden rounded-none bg-[#f7f7f7] md:h-[220px]">
        <div className="absolute inset-3 md:inset-4">
          <Image
            src={article.image}
            alt=""
            fill
            className="object-contain"
            sizes="(max-width: 768px) 75vw, (max-width: 1024px) 40vw, 320px"
            unoptimized
          />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4 md:gap-2.5 md:p-5">
        <h3
          className="text-[15px] font-semibold leading-[1.2] text-[#221f1f] md:text-[20px]"
          style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
        >
          {article.title}
        </h3>
        <p
          className="line-clamp-3 text-[13px] font-normal leading-[1.3] text-[#949494] md:text-[16px]"
          style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
        >
          {article.description}
        </p>
        <p
          className="mt-auto text-[12px] font-normal leading-none text-[#949494] md:text-[14px]"
          style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
        >
          {article.date}
        </p>
      </div>
    </article>
  );
}
