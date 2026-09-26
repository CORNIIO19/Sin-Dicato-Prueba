import Link from "next/link";
import { notFound } from "next/navigation";

import { businesses, products } from "@/modules/marketplace/mock-data";
import { getProductAvailability } from "@/modules/marketplace/availability";

type ProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { id } = await params;

  const product = products.find(
    (product) => product.id === id,
  );

  if (!product) {
    notFound();
  }

  const business = businesses.find(
    (business) => business.id === product.businessId,
  );

  if (!business) {
    notFound();
  }

  const availability = getProductAvailability(
    product,
    business,
  );

  const available = availability === "available";

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-5">
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
              href={`/negocios/${business.id}`}
              className="text-sm font-medium text-zinc-500 hover:text-zinc-900"
            >
              {business.name}
            </Link>

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
                <span className="text-sm font-medium text-zinc-500">
                  Agotado
                </span>
              )}

              {availability === "business_closed" && (
                <span className="text-sm font-medium text-zinc-500">
                  Negocio cerrado
                </span>
              )}

              {availability === "unavailable" && (
                <span className="text-sm font-medium text-zinc-500">
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
                    href={`/negocios/${business.id}`}
                    className="font-semibold"
                  >
                    {business.name}
                  </Link>

                  <p className="mt-1 text-sm text-zinc-500">
                    {business.isOpen
                      ? "● Abierto ahora"
                      : "Cerrado"}
                  </p>
                </div>

                <Link
                  href={`/negocios/${business.id}`}
                  className="text-sm font-medium"
                >
                  Ver negocio →
                </Link>
              </div>
            </div>

            <a
              href={`https://wa.me/${business.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-8 block w-full rounded-xl px-4 py-4 text-center font-semibold ${
                available
                  ? "bg-zinc-900 text-white"
                  : "pointer-events-none bg-zinc-200 text-zinc-500"
              }`}
            >
              {available
                ? "Contactar por WhatsApp"
                : "No disponible"}
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
