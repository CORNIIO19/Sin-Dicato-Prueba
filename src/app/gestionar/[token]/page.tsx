import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getBusinessByManagementToken } from "@/modules/marketplace/business-repository";

export const metadata: Metadata = {
  title: "Gestionar negocio | Sin Dicato",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

type ManageBusinessPageProps = {
  params: Promise<{
    token: string;
  }>;
};

export default async function ManageBusinessPage({
  params,
}: ManageBusinessPageProps) {
  const { token } = await params;

  const business =
    await getBusinessByManagementToken(token);

  if (!business) {
    notFound();
  }

  const isApproved =
    business.moderationStatus === "APPROVED";

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="text-sm font-medium text-zinc-600"
          >
            ← Sin Dicato
          </Link>

          <span className="text-sm text-zinc-500">
            Panel del vendedor
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-10">
        <section className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm text-zinc-500">
                Tu negocio
              </p>

              <h1 className="mt-1 text-3xl font-bold">
                {business.name}
              </h1>

              <p className="mt-3 max-w-xl text-zinc-600">
                {business.description}
              </p>

              <p className="mt-4 text-sm text-zinc-500">
                WhatsApp: {business.whatsapp}
              </p>
            </div>

            <div>
              {business.moderationStatus === "PENDING" && (
                <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-medium text-amber-700">
                  Pendiente de aprobación
                </span>
              )}

              {business.moderationStatus === "APPROVED" && (
                <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700">
                  Aprobado
                </span>
              )}

              {business.moderationStatus === "REJECTED" && (
                <span className="rounded-full bg-red-100 px-4 py-2 text-sm font-medium text-red-700">
                  Rechazado
                </span>
              )}
            </div>
          </div>

          <div className="mt-8 border-t border-zinc-200 pt-6">
            <p className="text-sm text-zinc-500">
              Estado del negocio
            </p>

            <p className="mt-2 text-lg font-semibold">
              {business.isOpen
                ? "🟢 Abierto"
                : "⚪ Cerrado"}
            </p>

            {!isApproved && (
              <p className="mt-2 text-sm text-zinc-500">
                Podrás abrir el negocio cuando haya sido aprobado.
              </p>
            )}
          </div>
        </section>

        <section className="mt-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                Productos
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Administra lo que vendes desde aquí.
              </p>
            </div>

            <Link
  href={`/gestionar/${token}/productos/nuevo`}
  className="rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white"
>
  + Agregar producto
</Link>
          </div>

          {business.products.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center">
              <p className="font-medium">
                Todavía no tienes productos.
              </p>

              <p className="mt-2 text-sm text-zinc-500">
                En el siguiente paso conectaremos el alta de
                productos a este panel.
              </p>
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              {business.products.map((product) => (
                <article
                  key={product.id}
                  className="rounded-2xl border border-zinc-200 bg-white p-5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold">
                        {product.name}
                      </p>

                      <p className="mt-1 text-sm text-zinc-500">
                        {product.category.name}
                      </p>
                    </div>

                    <p className="font-semibold">
                      ${product.price.toString()}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
