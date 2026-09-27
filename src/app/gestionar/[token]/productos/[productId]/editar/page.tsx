import Link from "next/link";
import { notFound } from "next/navigation";

import EditProductForm from "@/components/edit-product-form";
import { getBusinessByManagementToken } from "@/modules/marketplace/business-repository";
import { getCategories } from "@/modules/marketplace/category-repository";
import { getProductForBusiness } from "@/modules/marketplace/product-repository";

type EditProductPageProps = {
  params: Promise<{
    token: string;
    productId: string;
  }>;
};

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { token, productId } = await params;

  const business =
    await getBusinessByManagementToken(token);

  if (!business) {
    notFound();
  }

  const product = await getProductForBusiness(
    productId,
    business.id,
  );

  if (!product) {
    notFound();
  }

  const categories = await getCategories();

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-3xl px-6 py-5">
          <Link
            href={`/gestionar/${token}`}
            className="text-sm font-medium text-zinc-600"
          >
            ← Volver a {business.name}
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Editar producto
          </h1>

          <p className="mt-2 text-zinc-600">
            Actualiza la información de{" "}
            <strong>{product.name}</strong>.
          </p>
        </div>

        <EditProductForm
          token={token}
          categories={categories}
          product={{
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price.toString(),
            categoryId: product.categoryId,
            trackStock: product.trackStock,
            stockQuantity: product.stockQuantity,
            isAvailable: product.isAvailable,
          }}
        />
      </div>
    </main>
  );
}
