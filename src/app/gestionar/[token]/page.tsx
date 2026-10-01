import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import BrandLockup from "@/components/brand-lockup";
import BusinessAvailabilityControl from "@/components/business-availability-control";
import ProductAvailabilityControl from "@/components/product-availability-control";
import SellerModerationStatus from "@/components/seller-moderation-status";
import StockControls from "@/components/stock-controls";
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

  const isRejected =
    business.moderationStatus === "REJECTED";

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-950">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <BrandLockup compact />

          <Link
            href="/"
            className="shrink-0 rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50"
          >
            Ver mercadito
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        {/* ENCABEZADO */}
        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-zinc-500">
            Panel del vendedor
          </p>

          <div className="mt-3 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <h1 className="text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
                {business.name}
              </h1>

              <p className="mt-3 leading-7 text-zinc-600">
                Administra tu negocio, productos,
                disponibilidad y stock desde aquí.
              </p>
            </div>

            <Link
              href={`/gestionar/${token}/editar`}
              className="w-fit rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold transition hover:bg-zinc-50"
            >
              Editar información
            </Link>
          </div>
        </section>

        {/* INFORMACIÓN DEL NEGOCIO */}
        <section className="mt-8 overflow-hidden rounded-3xl border border-zinc-200 bg-white">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
                  Tu negocio
                </p>

                <p className="mt-3 leading-7 text-zinc-600">
                  {business.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3 text-sm">
                  <div>
                    <p className="text-zinc-500">
                      WhatsApp
                    </p>

                    <p className="mt-1 font-semibold">
                      {business.whatsapp}
                    </p>
                  </div>

                  <div>
                    <p className="text-zinc-500">
                      Productos
                    </p>

                    <p className="mt-1 font-semibold">
                      {business.products.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full lg:max-w-sm">
                <SellerModerationStatus
                  status={business.moderationStatus}
                  type="business"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-zinc-200 bg-zinc-50 p-6 sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
              Estado del negocio
            </p>

            <BusinessAvailabilityControl
              token={token}
              initialIsOpen={business.isOpen}
              isApproved={isApproved}
            />
          </div>
        </section>

        {/* PRODUCTOS */}
        <section className="mt-12">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-zinc-500">
                Tu catálogo
              </p>

              <h2 className="mt-1 text-2xl font-bold tracking-[-0.02em]">
                Productos y servicios
              </h2>

              <p className="mt-2 text-sm leading-6 text-zinc-500">
                Actualiza precios, stock y disponibilidad
                cuando lo necesites.
              </p>
            </div>

            {isRejected ? (
              <div className="rounded-xl bg-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-500">
                No puedes agregar productos
              </div>
            ) : (
              <Link
                href={`/gestionar/${token}/productos/nuevo`}
                className="w-fit rounded-xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
              >
                + Agregar producto
              </Link>
            )}
          </div>

          {business.products.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-dashed border-zinc-300 bg-white p-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-xl">
                📦
              </div>

              <h3 className="mt-5 font-semibold">
                Tu catálogo está vacío
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
                Agrega tu primer producto o servicio para
                comenzar a construir tu espacio en Sin Dicato.
              </p>

              {!isRejected && (
                <Link
                  href={`/gestionar/${token}/productos/nuevo`}
                  className="mt-6 inline-block rounded-xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white"
                >
                  Agregar mi primer producto
                </Link>
              )}
            </div>
          ) : (
            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              {business.products.map((product) => (
                <article
                  key={product.id}
                  className="overflow-hidden rounded-3xl border border-zinc-200 bg-white"
                >
                  {/* PRODUCTO */}
                  <div className="flex gap-4 p-5">
                    {product.imagePath ? (
                      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-zinc-100">
                        <Image
                          src={product.imagePath}
                          alt={product.name}
                          fill
                          unoptimized
                          sizes="96px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-zinc-100 text-3xl">
                        📦
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-lg font-semibold">
                            {product.name}
                          </p>

                          <p className="mt-1 text-sm text-zinc-500">
                            {product.category.name}
                          </p>
                        </div>

                        <p className="shrink-0 text-lg font-bold">
                          ${product.price.toString()}
                        </p>
                      </div>

                      <Link
                        href={`/gestionar/${token}/productos/${product.id}/editar`}
                        className="mt-4 inline-block text-sm font-semibold text-zinc-700 underline decoration-zinc-300 underline-offset-4"
                      >
                        Editar producto
                      </Link>
                    </div>
                  </div>

                  {/* MODERACIÓN */}
                  <div className="border-t border-zinc-100 px-5 pb-1">
                    <SellerModerationStatus
                      status={product.moderationStatus}
                      type="product"
                    />
                  </div>

                  {/* OPERACIÓN */}
                  <div className="mt-4 border-t border-zinc-200 bg-zinc-50 p-5">
                    {product.trackStock ? (
                      <StockControls
                        token={token}
                        productId={product.id}
                        initialStock={
                          product.stockQuantity ?? 0
                        }
                      />
                    ) : (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
                          Inventario
                        </p>

                        <p className="mt-2 text-sm font-medium">
                          Sin control de stock
                        </p>
                      </div>
                    )}

                    <ProductAvailabilityControl
                      token={token}
                      productId={product.id}
                      initialIsAvailable={
                        product.isAvailable
                      }
                    />
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* RECORDATORIO */}
        <section className="mt-12 rounded-2xl border border-zinc-200 bg-white p-5">
          <p className="text-sm font-semibold">
            🔐 Esta es tu liga privada
          </p>

          <p className="mt-2 text-sm leading-6 text-zinc-500">
            Guarda esta página. Cualquier persona que
            tenga esta liga puede administrar tu negocio.
          </p>
        </section>
      </div>
    </main>
  );
}
