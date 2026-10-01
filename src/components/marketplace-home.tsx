"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { getProductAvailability } from "@/modules/marketplace/availability";

type Category = {
  id: string;
  name: string;
  slug: string;
};

type Business = {
  id: string;
  name: string;
  description: string;
  whatsapp: string;
  isOpen: boolean;
};

type Product = {
  id: string;

  businessId: string;
  businessName: string;

  name: string;
  description: string;
  price: number;
  imagePath: string | null;

  categoryId: string;
  categoryName: string;
  categorySlug: string;

  trackStock: boolean;
  stockQuantity: number | null;
  isAvailable: boolean;
};

type MarketplaceHomeProps = {
  categories: Category[];
  businesses: Business[];
  products: Product[];
};

function normalizeText(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export default function MarketplaceHome({
  categories,
  businesses,
  products,
}: MarketplaceHomeProps) {
  const [selectedCategory, setSelectedCategory] =
    useState("all");

  const [searchTerm, setSearchTerm] =
    useState("");

  const search = normalizeText(searchTerm);

  const filteredProducts = products.filter(
    (product) => {
      const business = businesses.find(
        (business) =>
          business.id === product.businessId,
      );

      const matchesCategory =
        selectedCategory === "all" ||
        product.categorySlug ===
          selectedCategory;

      const matchesSearch =
        search === "" ||
        normalizeText(product.name).includes(
          search,
        ) ||
        normalizeText(
          product.description,
        ).includes(search) ||
        normalizeText(
          product.businessName,
        ).includes(search) ||
        normalizeText(
          product.categoryName,
        ).includes(search);

      return (
        matchesCategory &&
        matchesSearch &&
        Boolean(business)
      );
    },
  );

  const filteredBusinesses =
    businesses.filter((business) => {
      const businessProducts =
        products.filter(
          (product) =>
            product.businessId === business.id,
        );

      const matchesCategory =
        selectedCategory === "all" ||
        businessProducts.some(
          (product) =>
            product.categorySlug ===
            selectedCategory,
        );

      const matchesSearch =
        search === "" ||
        normalizeText(
          business.name,
        ).includes(search) ||
        normalizeText(
          business.description,
        ).includes(search) ||
        businessProducts.some(
          (product) =>
            normalizeText(
              product.name,
            ).includes(search) ||
            normalizeText(
              product.description,
            ).includes(search),
        );

      return (
        matchesCategory &&
        matchesSearch
      );
    });

  return (
    <main className="min-h-screen bg-white text-zinc-950">
      {/* HEADER FIJO */}
      <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
              <Image
                src="/branding/icon-sin-dicato.png"
                alt="Sin Dicato"
                fill
                sizes="44px"
                className="object-cover"
                priority
              />
            </div>

            <div className="min-w-0">
              <Link
                href="/"
                className="block w-fit"
                aria-label="Ir al inicio de Sin Dicato"
              >
                <div className="text-[17px] font-black uppercase leading-[0.78] tracking-[-0.06em] sm:text-[19px]">
                  <span className="block">
                    SIN
                  </span>
                  <span className="block">
                    DICATO
                  </span>
                </div>
              </Link>

              <p className="mt-1 max-w-[420px] text-[10px] leading-4 text-zinc-500 sm:text-[11px]">
                <strong className="font-bold text-zinc-800">
                  SIN
                </strong>{" "}
                intermediarios.{" "}
                <strong className="font-bold text-zinc-800">
                  SIN
                </strong>{" "}
                complicaciones.{" "}
                <strong className="font-bold text-zinc-800">
                  SIN DICATO.
                </strong>
              </p>
            </div>
          </div>

          <Link
            href="/vender"
            className="shrink-0 rounded-xl bg-zinc-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            Quiero vender
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="border-b border-zinc-200">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="max-w-3xl">
            <div className="mb-5 h-1.5 w-10 rounded-full bg-orange-500" />

            <h1 className="max-w-2xl text-4xl font-bold leading-[1.05] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              Mercadito digital para la
              comunidad UAMera.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600 sm:text-xl">
              Compra, vende y descubre negocios,
              productos y servicios de la
              comunidad.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/vender"
                className="rounded-2xl bg-zinc-950 px-6 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-zinc-800"
              >
                Publicar mi negocio
              </Link>

              <a
                href="#explorar"
                className="rounded-2xl border border-zinc-300 bg-white px-6 py-3.5 text-center text-sm font-semibold text-zinc-950 transition hover:bg-zinc-50"
              >
                Explorar productos
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* EXPLORAR */}
      <div
        id="explorar"
        className="bg-zinc-50"
      >
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <section>
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-zinc-500">
                Explora
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
                ¿Qué estás buscando?
              </h2>

              <p className="mt-3 text-zinc-600">
                Descubre productos y servicios
                ofrecidos por la comunidad.
              </p>
            </div>

            <input
              type="search"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value,
                )
              }
              placeholder="Buscar comida, servicios, ropa..."
              className="mt-7 w-full rounded-2xl border border-zinc-300 bg-white px-5 py-4 outline-none transition focus:border-zinc-500"
            />

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  setSelectedCategory("all")
                }
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  selectedCategory === "all"
                    ? "bg-zinc-950 text-white"
                    : "border border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400"
                }`}
              >
                Todos
              </button>

              {categories.map(
                (category) => (
                  <button
                    type="button"
                    key={category.id}
                    onClick={() =>
                      setSelectedCategory(
                        category.slug,
                      )
                    }
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      selectedCategory ===
                      category.slug
                        ? "bg-zinc-950 text-white"
                        : "border border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400"
                    }`}
                  >
                    {category.name}
                  </button>
                ),
              )}
            </div>
          </section>

          {/* NEGOCIOS */}
          <section className="mt-14">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-zinc-500">
                  Comunidad
                </p>

                <h2 className="mt-1 text-2xl font-bold tracking-[-0.02em]">
                  Negocios
                </h2>
              </div>
            </div>

            {filteredBusinesses.length ===
            0 ? (
              <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center">
                <p className="font-medium">
                  No encontramos negocios.
                </p>

                <p className="mt-2 text-sm text-zinc-500">
                  Prueba con otra búsqueda o
                  categoría.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredBusinesses.map(
                  (business) => (
                    <article
                      key={business.id}
                      className="rounded-2xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-300"
                    >
                      <div className="mb-5 flex items-start justify-between gap-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100 text-lg">
                          🏪
                        </div>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            business.isOpen
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-zinc-100 text-zinc-500"
                          }`}
                        >
                          {business.isOpen
                            ? "● Abierto"
                            : "Cerrado"}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold">
                        {business.name}
                      </h3>

                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-500">
                        {business.description}
                      </p>

                      <Link
                        href={`/negocios/${business.id}`}
                        className="mt-5 inline-block text-sm font-semibold"
                      >
                        Ver negocio →
                      </Link>
                    </article>
                  ),
                )}
              </div>
            )}
          </section>

          {/* PRODUCTOS */}
          <section className="mt-16">
            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-zinc-500">
                Descubre
              </p>

              <h2 className="mt-1 text-2xl font-bold tracking-[-0.02em]">
                Productos recientes
              </h2>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center">
                <p className="font-medium">
                  No encontramos productos.
                </p>

                <p className="mt-2 text-sm text-zinc-500">
                  Prueba con otra búsqueda o
                  categoría.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map(
                  (product) => {
                    const business =
                      businesses.find(
                        (business) =>
                          business.id ===
                          product.businessId,
                      );

                    const availability =
                      getProductAvailability(
                        product,
                        business,
                      );

                    return (
                      <article
                        key={product.id}
                        className="overflow-hidden rounded-2xl border border-zinc-200 bg-white transition hover:border-zinc-300"
                      >
                        {product.imagePath ? (
                          <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
                            <Image
                              src={
                                product.imagePath
                              }
                              alt={
                                product.name
                              }
                              fill
                              unoptimized
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex aspect-[4/3] items-center justify-center bg-zinc-100 text-5xl">
                            📦
                          </div>
                        )}

                        <div className="p-5">
                          <p className="text-sm text-zinc-500">
                            {
                              product.businessName
                            }
                          </p>

                          <h3 className="mt-1 text-lg font-semibold">
                            {product.name}
                          </h3>

                          <p className="mt-3 text-2xl font-bold">
                            ${product.price}
                          </p>

                          <div className="mt-3 min-h-5">
                            {availability ===
                              "available" && (
                              <span className="text-sm font-medium text-emerald-700">
                                {product.trackStock
                                  ? `${product.stockQuantity} disponibles`
                                  : "Disponible"}
                              </span>
                            )}

                            {availability ===
                              "sold_out" && (
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

                          <Link
                            href={`/productos/${product.id}`}
                            className="mt-5 block w-full rounded-xl bg-zinc-950 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-zinc-800"
                          >
                            Ver producto
                          </Link>
                        </div>
                      </article>
                    );
                  },
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
