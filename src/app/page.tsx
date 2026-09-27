import MarketplaceHome from "@/components/marketplace-home";
import { getCategories } from "@/modules/marketplace/category-repository";

export default async function Home() {
  const categories = await getCategories();

  return <MarketplaceHome categories={categories} />;
}
