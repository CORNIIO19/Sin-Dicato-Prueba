import MarketplaceHome from "@/components/marketplace-home";
import { getCategories } from "@/modules/marketplace/category-repository";
import {
  getPublicBusinesses,
  getPublicProducts,
} from "@/modules/marketplace/public-marketplace-repository";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [categories, businesses, products] =
    await Promise.all([
      getCategories(),
      getPublicBusinesses(),
      getPublicProducts(),
    ]);

  return (
    <MarketplaceHome
      categories={categories}
      businesses={businesses}
      products={products}
    />
  );
}
