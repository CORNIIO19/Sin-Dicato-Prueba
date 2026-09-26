import Link from "next/link";
import { notFound } from "next/navigation";

import { businesses, products } from "@/modules/marketplace/mock-data";
import { getProductAvailability } from "@/modules/marketplace/availability";

type BusinessPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function BusinessPage({
  params,
}: BusinessPageProps) {
  const { id } = await params;

  const business = businesses.find(
    (business) => business.id === id,
  );

  if (!business) {
    notFound();
  }

  const businessProducts = products.filter(
    (product) => product.businessId === business.id,
  );

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

      <div className="mx-auto max-w-6xl px-6 py-10">
        <section className="rounded-3xl border border-zinc-200 bg-white p-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 text-3xl">
                🏪
              </div>

              <h1 className="text-3xl font-bold">
                {business.name}
              </h1>

              <p className="mt-2 max-w-xl text-zinc-600">
                {business.description}
              </p>
            </div>

            <span
              className={`w-fit rounded-full px-4 py-2 text-sm font-medium ${
                business.isOpen
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-zinc-100 text-zinc-500"
              }`}
            >
              {business.isOpen ? "● Abierto" : "Cerrado"}
            </span>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold">
            Productos y servicios
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {businessProducts.map((product) => {
              const availability = getProductAvailability(
                product,
                business,
              );

              const available =
                availability === "available";

              return (
                <article
                  key={product.id}
                  className="overflow-hidden rounded-2xl border border-zinc-200 bg-white"
                >
                  <div className="flex aspect-[4/3] items-center justify-center bg-zinc-100 text-5xl">
                    📦
                  </div>

                  <div className="p-5">
                    <h3 className="font-semibold">
                      {product.name}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-zinc-500">
                      {product.description}
                    </p>

                    <p className="mt-4 text-2xl font-bold">
                      ${product.price}
                    </p>

                    <div className="mt-3">
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

                      {availability === "business_closed" && (
                        <span className="text-sm text-zinc-500">
                          Negocio cerrado
                        </span>
                      )}

                      {availability === "unavailable" && (
                        <span className="text-sm text-zinc-500">
                          No disponible
                        </span>
                      )}
                    </div>

                    <a
                      href={`https://wa.me/${business.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`mt-5 block w-full rounded-xl px-4 py-3 text-center text-sm font-semibold ${
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
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
