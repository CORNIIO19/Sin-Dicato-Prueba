import { redirect } from "next/navigation";

import AdminModerationControls from "@/components/admin-moderation-controls";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authenticated =
    await isAdminAuthenticated();

  if (!authenticated) {
    redirect("/admin/login");
  }

  const pendingBusinesses =
    await prisma.business.findMany({
      where: {
        moderationStatus: "PENDING",
      },
      include: {
        products: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

  const pendingProducts =
    await prisma.product.findMany({
      where: {
        moderationStatus: "PENDING",
      },
      include: {
        business: true,
        category: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-5">
          <p className="text-sm text-zinc-500">
            Sin Dicato
          </p>

          <h1 className="text-2xl font-bold">
            Panel administrador
          </h1>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <section>
          <h2 className="text-xl font-semibold">
            Negocios pendientes
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            {pendingBusinesses.length} pendientes
          </p>

          <div className="mt-5 space-y-4">
            {pendingBusinesses.map((business) => (
              <article
                key={business.id}
                className="rounded-2xl border border-zinc-200 bg-white p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-semibold">
                      {business.name}
                    </h3>

                    <p className="mt-2 text-sm text-zinc-600">
                      {business.description}
                    </p>

                    <p className="mt-3 text-sm text-zinc-500">
                      WhatsApp: {business.whatsapp}
                    </p>

                    <p className="mt-1 text-sm text-zinc-500">
                      Productos: {business.products.length}
                    </p>

                    <AdminModerationControls
                      type="businesses"
                      id={business.id}
                      name={business.name}
                    />
                  </div>

                  <span className="w-fit rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                    PENDIENTE
                  </span>
                </div>
              </article>
            ))}

            {pendingBusinesses.length === 0 && (
              <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center text-zinc-500">
                No hay negocios pendientes.
              </div>
            )}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-semibold">
            Productos pendientes
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            {pendingProducts.length} pendientes
          </p>

          <div className="mt-5 space-y-4">
            {pendingProducts.map((product) => (
              <article
                key={product.id}
                className="rounded-2xl border border-zinc-200 bg-white p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-semibold">
                      {product.name}
                    </h3>

                    <p className="mt-1 text-sm text-zinc-500">
                      Negocio: {product.business.name}
                    </p>

                    <p className="mt-2 text-sm text-zinc-600">
                      {product.description}
                    </p>

                    <p className="mt-3 font-semibold">
                      ${product.price.toString()}
                    </p>

                    <p className="mt-1 text-sm text-zinc-500">
                      Categoría: {product.category.name}
                    </p>

                    {product.trackStock ? (
                      <p className="mt-1 text-sm text-zinc-500">
                        Stock: {product.stockQuantity ?? 0}
                      </p>
                    ) : (
                      <p className="mt-1 text-sm text-zinc-500">
                        Sin control de stock
                      </p>
                    )}

                    <AdminModerationControls
                      type="products"
                      id={product.id}
                      name={product.name}
                    />
                  </div>

                  <span className="w-fit rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                    PENDIENTE
                  </span>
                </div>
              </article>
            ))}

            {pendingProducts.length === 0 && (
              <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center text-zinc-500">
                No hay productos pendientes.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
