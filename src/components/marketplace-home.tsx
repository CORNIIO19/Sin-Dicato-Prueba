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
imagePath: string | null;

  name: string;
  description: string;
  price: number;

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
        normalizeText(product.name).includes(search) ||
        normalizeText(product.description).includes(
          search,
        ) ||
        normalizeText(product.businessName).includes(
          search,
        ) ||
        normalizeText(product.categoryName).includes(
          search,
        );

      return (
        matchesCategory &&
        matchesSearch &&
        Boolean(business)
      );
    },
  );

  const filteredBusinesses =
    businesses.filter((business) => {
      const businessProducts = products.filter(
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
        normalizeText(business.name).includes(
          search,
        ) ||
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
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-xl font-bold">
              Sin Dicato
            </h1>

            <p className="text-sm text-zinc-500">
              Compra, vende y descubre lo que ofrece
              la comunidad UAM-C.
            </p>
          </div>

          <Link
            href="/vender"
            className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
          >
            Quiero vender
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <section>
          <h2 className="text-3xl font-bold tracking-tight">
            ¿Qué estás buscando?
          </h2>

          <p className="mt-2 text-zinc-600">
            Descubre productos y servicios ofrecidos
            por estudiantes.
          </p>

          <input
            type="search"
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
            placeholder="Buscar comida, servicios, ropa..."
            className="mt-6 w-full rounded-2xl border border-zinc-300 bg-white px-5 py-4 outline-none transition focus:border-zinc-500"
          />

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                setSelectedCategory("all")
              }
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                selectedCategory === "all"
                  ? "bg-zinc-900 text-white"
                  : "border border-zinc-200 bg-white text-zinc-700"
              }`}
            >
              Todos
            </button>

            {categories.map((category) => (
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
                    ? "bg-zinc-900 text-white"
                    : "border border-zinc-200 bg-white text-zinc-700"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Negocios
            </h2>
          </div>

          {filteredBusinesses.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center">
              <p className="font-medium">
                Todavía no hay negocios disponibles.
              </p>

              <p className="mt-2 text-sm text-zinc-500">
                Los negocios aparecerán aquí cuando
                sean aprobados.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {filteredBusinesses.map(
                (business) => (
                  <article
                    key={business.id}
                    className="rounded-2xl border border-zinc-200 bg-white p-5"
                  >
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-xl">
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

                    <h3 className="font-semibold">
                      {business.name}
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-zinc-500">
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

        <section className="mt-12">
          <div className="mb-5">
            <h2 className="text-xl font-semibold">
              Productos recientes
            </h2>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center">
              <p className="font-medium">
                Todavía no hay productos disponibles.
              </p>

              <p className="mt-2 text-sm text-zinc-500">
                Los productos aparecerán aquí cuando
                hayan sido aprobados.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                      className="overflow-hidden rounded-2xl border border-zinc-200 bg-white"
                    >
                      {product.imagePath ? (
  <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
    <Image
      src={product.imagePath}
      alt={product.name}
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
                          {product.businessName}
                        </p>

                        <h3 className="mt-1 font-semibold">
                          {product.name}
                        </h3>

                        <p className="mt-3 text-2xl font-bold">
                          ${product.price}
                        </p>

                        <div className="mt-4">
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
                          className="mt-5 block w-full rounded-xl bg-zinc-900 px-4 py-3 text-center text-sm font-semibold text-white"
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
    </main>
  );
}
