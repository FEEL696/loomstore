import Link from "next/link";

import { ArticleCard } from "@/components/main/ArticleCard";
import { ARTICLES } from "@/lib/articles";

export default function ArticlesPage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-[1920px] px-[15px] py-6 md:px-6 md:py-8 lg:px-8">
        <nav
          className="mb-4 text-[14px] text-[#878787]"
          style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          aria-label="Хлебные крошки"
        >
          <Link href="/" className="hover:text-[#221f1f]">
            Главная
          </Link>
          <span className="mx-1">/</span>
          <span className="font-medium text-[#221f1f]">Статьи</span>
        </nav>

        <h1
          className="loom-promo-section-title mb-8"
          style={{ fontFamily: "var(--font-charito), sans-serif" }}
        >
          Статьи
        </h1>

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 min-[1200px]:grid-cols-3 xl:grid-cols-4">
          {ARTICLES.map((article) => (
            <li key={article.id} className="min-w-0">
              <ArticleCard article={article} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
