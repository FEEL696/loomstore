import { MainSection } from "@/components/main/MainSection";
import { CategoryNavSection } from "@/components/main/CategoryNavSection";
import { PromoProductsSection } from "@/components/main/PromoProductsSection";
import { VideoSection } from "@/components/main/VideoSection";
import { ArticlesSection } from "@/components/main/ArticlesSection";
import { ReviewsSection } from "@/components/main/ReviewsSection";
import { getCategoryNavCounts } from "@/lib/category-nav-counts";

export default async function Home() {
  const categoryCounts = await getCategoryNavCounts();

  return (
    <>
      <MainSection />
      <CategoryNavSection counts={categoryCounts} />
      <PromoProductsSection />
      <VideoSection />
      <ArticlesSection />
      <ReviewsSection />
    </>
  );
}
