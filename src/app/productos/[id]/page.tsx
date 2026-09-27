import Link from "next/link";
import { notFound } from "next/navigation";

import { getProductAvailability } from "@/modules/marketplace/availability";

import { getPublicProductById } from "@/modules/marketplace/public-marketplace-repository";

export const dynamic = "force-dynamic";

type ProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { id } = await params;

  const product =
    await getPublicProductById(id);

  if (!product) {
    notFound();
  }

  const availability =
    getProductAvailability(
      product,
      product.business,
    );

  const available =
    availability === "available";

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-4xl px-6 py-5">
          <Link
            href="/"
            className="text-sm font-medium text-zinc-600"
          >
            ← Volver a Sin Dicato
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white">
          <div className="flex aspect-[16/8] items-center justify-center bg-zinc-100 text-7xl">
            📦
          </div>

          <div className="p-6 sm:p-8">
            <Link
              href={`/negocios/${product.business.id}`}
              className="text-sm font-medium text-zinc-500"
            >
              {product.business.name}
            </Link>

            <p className="mt-2 text-sm text-zinc-500">
              {product.category.name}
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              {product.name}
            </h1>

            <p className="mt-3 text-zinc-600">
              {product.description}
            </p>

            <p className="mt-6 text-3xl font-bold">
              ${product.price}
            </p>

            <div className="mt-4">
              {availability === "available" && (
                <span className="text-sm font-medium text-emerald-700">
                  {product.trackStock
                    ? `${product.stockQuantity} disponibles`
                    : "Disponible"}
                </span>
              )}

              {availability === "sold_out" && (
                <span className="text-sm text-zinc-500">
                  Agotado
                </span>
              )}

              {availability ===
                "business_closed" && (
                <span className="text-sm text-zinc-500">
                  Negocio cerrado
                </span>
              )}

              {availability ===
                "unavailable" && (
                <span className="text-sm text-zinc-500">
                  No disponible
                </span>
              )}
            </div>

            <div className="mt-8 border-t border-zinc-200 pt-6">
              <p className="text-sm text-zinc-500">
                Vendido por
              </p>

              <div className="mt-2 flex items-center justify-between gap-4">
                <div>
                  <Link
                    href={`/negocios/${product.business.id}`}
                    className="font-semibold"
                  >
                    {product.business.name}
                  </Link>

                  <p className="mt-1 text-sm text-zinc-500">
                    {product.business.isOpen
                      ? "● Abierto ahora"
                      : "Cerrado"}
                  </p>
                </div>

                <Link
                  href={`/negocios/${product.business.id}`}
                  className="text-sm font-medium"
                >
                  Ver negocio →
                </Link>
              </div>
            </div>

            {available ? (
              <a
                href={`https://wa.me/${product.business.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 block w-full rounded-xl bg-zinc-900 px-4 py-4 text-center font-semibold text-white"
              >
                Contactar por WhatsApp
              </a>
            ) : (
              <div className="mt-8 w-full rounded-xl bg-zinc-200 px-4 py-4 text-center font-semibold text-zinc-500">
                No disponible
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
