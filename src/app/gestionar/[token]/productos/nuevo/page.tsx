import Link from "next/link";
import { notFound } from "next/navigation";

import ProductForm from "@/components/product-form";
import { getBusinessByManagementToken } from "@/modules/marketplace/business-repository";
import { getCategories } from "@/modules/marketplace/category-repository";

type NewProductPageProps = {
  params: Promise<{
    token: string;
  }>;
};

export default async function NewProductPage({
  params,
}: NewProductPageProps) {
  const { token } = await params;

  const business =
    await getBusinessByManagementToken(token);

  if (!business) {
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
            Agregar producto
          </h1>

          <p className="mt-2 text-zinc-600">
            Publica un producto o servicio de{" "}
            <strong>{business.name}</strong>.
          </p>
        </div>

        <ProductForm
          token={token}
          categories={categories}
        />
      </div>
    </main>
  );
}
