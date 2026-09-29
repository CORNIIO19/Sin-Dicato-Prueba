import AdminLogoutButton from "@/components/admin-logout-button";
import Link from "next/link";
import { redirect } from "next/navigation";

import AdminModerationControls from "@/components/admin-moderation-controls";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type AdminPageProps = {
  searchParams: Promise<{
    status?: string;
  }>;
};

type ModerationStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

function getModerationStatus(
  value: string | undefined,
): ModerationStatus {
  if (value === "approved") {
    return "APPROVED";
  }

  if (value === "rejected") {
    return "REJECTED";
  }

  return "PENDING";
}

function getStatusLabel(
  status: ModerationStatus,
) {
  if (status === "APPROVED") {
    return "Aprobados";
  }

  if (status === "REJECTED") {
    return "Rechazados";
  }

  return "Pendientes";
}

export default async function AdminPage({
  searchParams,
}: AdminPageProps) {
  const authenticated =
    await isAdminAuthenticated();

  if (!authenticated) {
    redirect("/admin/login");
  }

  const params = await searchParams;

  const status =
    getModerationStatus(params.status);

  const [
    businesses,
    products,
    pendingBusinessCount,
    approvedBusinessCount,
    rejectedBusinessCount,
    pendingProductCount,
    approvedProductCount,
    rejectedProductCount,
  ] = await Promise.all([
    prisma.business.findMany({
      where: {
        moderationStatus: status,
      },
      include: {
        products: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.product.findMany({
      where: {
        moderationStatus: status,
      },
      include: {
        business: true,
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.business.count({
      where: {
        moderationStatus: "PENDING",
      },
    }),

    prisma.business.count({
      where: {
        moderationStatus: "APPROVED",
      },
    }),

    prisma.business.count({
      where: {
        moderationStatus: "REJECTED",
      },
    }),

    prisma.product.count({
      where: {
        moderationStatus: "PENDING",
      },
    }),

    prisma.product.count({
      where: {
        moderationStatus: "APPROVED",
      },
    }),

    prisma.product.count({
      where: {
        moderationStatus: "REJECTED",
      },
    }),
  ]);

  const statusLabel =
    getStatusLabel(status);

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="border-b border-zinc-200 bg-white">
  <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5">
    <div>
      <p className="text-sm text-zinc-500">
        Sin Dicato
      </p>

      <h1 className="text-2xl font-bold">
        Panel administrador
      </h1>
    </div>

    <AdminLogoutButton />
  </div>
</header>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <nav className="flex flex-wrap gap-2">
          <Link
            href="/admin"
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              status === "PENDING"
                ? "bg-zinc-900 text-white"
                : "border border-zinc-200 bg-white text-zinc-700"
            }`}
          >
            Pendientes (
            {pendingBusinessCount +
              pendingProductCount}
            )
          </Link>

          <Link
            href="/admin?status=approved"
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              status === "APPROVED"
                ? "bg-zinc-900 text-white"
                : "border border-zinc-200 bg-white text-zinc-700"
            }`}
          >
            Aprobados (
            {approvedBusinessCount +
              approvedProductCount}
            )
          </Link>

          <Link
            href="/admin?status=rejected"
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              status === "REJECTED"
                ? "bg-zinc-900 text-white"
                : "border border-zinc-200 bg-white text-zinc-700"
            }`}
          >
            Rechazados (
            {rejectedBusinessCount +
              rejectedProductCount}
            )
          </Link>
        </nav>

        <div className="mt-10">
          <h2 className="text-2xl font-bold">
            {statusLabel}
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Negocios y productos con este
            estado de moderación.
          </p>
        </div>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">
            Negocios
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            {businesses.length} negocios
          </p>

          <div className="mt-5 space-y-4">
            {businesses.map((business) => (
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
                      WhatsApp:{" "}
                      {business.whatsapp}
                    </p>

                    <p className="mt-1 text-sm text-zinc-500">
                      Productos:{" "}
                      {business.products.length}
                    </p>

                    <p className="mt-1 text-sm text-zinc-500">
                      Estado operativo:{" "}
                      {business.isOpen
                        ? "Abierto"
                        : "Cerrado"}
                    </p>

                    <AdminModerationControls
                      type="businesses"
                      id={business.id}
                      name={business.name}
                      currentStatus={
                        business.moderationStatus
                      }
                    />
                  </div>

                  <StatusBadge
                    status={
                      business.moderationStatus
                    }
                  />
                </div>
              </article>
            ))}

            {businesses.length === 0 && (
              <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center text-zinc-500">
                No hay negocios en este
                estado.
              </div>
            )}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-semibold">
            Productos
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            {products.length} productos
          </p>

          <div className="mt-5 space-y-4">
            {products.map((product) => (
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
                      Negocio:{" "}
                      {product.business.name}
                    </p>

                    <p className="mt-2 text-sm text-zinc-600">
                      {product.description}
                    </p>

                    <p className="mt-3 font-semibold">
                      $
                      {product.price.toString()}
                    </p>

                    <p className="mt-1 text-sm text-zinc-500">
                      Categoría:{" "}
                      {product.category.name}
                    </p>

                    {product.trackStock ? (
                      <p className="mt-1 text-sm text-zinc-500">
                        Stock:{" "}
                        {product.stockQuantity ??
                          0}
                      </p>
                    ) : (
                      <p className="mt-1 text-sm text-zinc-500">
                        Sin control de stock
                      </p>
                    )}

                    <p className="mt-1 text-sm text-zinc-500">
                      Publicación:{" "}
                      {product.isAvailable
                        ? "Activa"
                        : "Pausada"}
                    </p>

                    <AdminModerationControls
                      type="products"
                      id={product.id}
                      name={product.name}
                      currentStatus={
                        product.moderationStatus
                      }
                    />
                  </div>

                  <StatusBadge
                    status={
                      product.moderationStatus
                    }
                  />
                </div>
              </article>
            ))}

            {products.length === 0 && (
              <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center text-zinc-500">
                No hay productos en este
                estado.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function StatusBadge({
  status,
}: {
  status: ModerationStatus;
}) {
  if (status === "APPROVED") {
    return (
      <span className="w-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
        APROBADO
      </span>
    );
  }

  if (status === "REJECTED") {
    return (
      <span className="w-fit rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
        RECHAZADO
      </span>
    );
  }

  return (
    <span className="w-fit rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
      PENDIENTE
    </span>
  );
}
