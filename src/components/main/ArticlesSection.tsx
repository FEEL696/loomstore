import Link from "next/link";

import { ArticleCard } from "@/components/main/ArticleCard";
import { ARTICLES } from "@/lib/articles";

export function ArticlesSection() {
  const articles = ARTICLES.slice(0, 4);

  return (
    <section id="articles" className="bg-white pb-16 pt-12">
      <div className="mx-auto max-w-[1920px] px-[15px] md:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h2
            className="text-[30px] font-normal leading-none tracking-[3px] text-[#221f1f]"
            style={{ fontFamily: "var(--font-charito), sans-serif" }}
          >
            СТАТЬИ
          </h2>
          <Link
            href="/articles"
            className="inline-flex items-center gap-1.5 rounded text-[18px] font-normal leading-none text-[#949494] hover:text-[#221f1f] focus:outline-none focus:ring-2 focus:ring-[#221f1f] focus:ring-offset-2"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            Смотреть все
            <span className="ml-0.5" aria-hidden>
              →
            </span>
          </Link>
        </div>

        <ul className="flex max-md:flex-row max-md:gap-4 max-md:overflow-x-auto max-md:pb-2 max-md:[scrollbar-width:thin] md:grid md:grid-cols-2 md:gap-6 min-[1200px]:grid-cols-3 2xl:grid-cols-4">
          {articles.map((article) => (
            <li
              key={article.id}
              className="min-w-0 max-md:min-w-[min(280px,calc(100vw-62px))] max-md:max-w-[min(280px,calc(100vw-62px))] max-md:shrink-0 max-md:snap-start md:min-w-0"
            >
              <ArticleCard article={article} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
