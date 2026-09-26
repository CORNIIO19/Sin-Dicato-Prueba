"use client";
import { useState } from "react";
import { businesses, products } from "@/modules/marketplace/mock-data";
import { getProductAvailability } from "@/modules/marketplace/availability";
import { categories } from "@/modules/marketplace/categories";
function normalizeText(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}
export default function Home() {
const [selectedCategory, setSelectedCategory] = useState<string>("all");
const [searchTerm, setSearchTerm] = useState("");
const search = normalizeText(searchTerm);
const filteredProducts = products.filter((product) => {
  const business = businesses.find(
    (business) => business.id === product.businessId,
  );

  const category = categories.find(
    (category) => category.id === product.categoryId,
  );

  const matchesCategory =
    selectedCategory === "all" ||
    product.categoryId === selectedCategory;

  const matchesSearch =
    search === "" ||
    normalizeText(product.name).includes(search) ||
    normalizeText(product.description).includes(search) ||
    normalizeText(business?.name ?? "").includes(search) ||
    normalizeText(category?.name ?? "").includes(search);

  return matchesCategory && matchesSearch;
});

const filteredBusinesses = businesses.filter((business) => {
  const businessProducts = products.filter(
    (product) => product.businessId === business.id,
  );

  const matchesCategory =
    selectedCategory === "all" ||
    businessProducts.some(
      (product) => product.categoryId === selectedCategory,
    );

  const matchesSearch =
    search === "" ||
    normalizeText(business.name).includes(search) ||
    normalizeText(business.description).includes(search) ||
    businessProducts.some(
      (product) =>
        normalizeText(product.name).includes(search) ||
        normalizeText(product.description).includes(search),
    );

  return matchesCategory && matchesSearch;
});

 return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-xl font-bold">Sin Dicato</h1>
            <p className="text-sm text-zinc-500">
            Compra, vende y descubre lo que ofrece la comunidad UAM-C.
             </p>
           </div>

          <button className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white">
            Quiero vender
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <section>
          <h2 className="text-3xl font-bold tracking-tight">
            ¿Qué estás buscando?
          </h2>

          <p className="mt-2 text-zinc-600">
            Descubre productos y servicios ofrecidos por estudiantes.
          </p>

          <input
            type="search"
            value={searchTerm}
  onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Buscar comida, servicios, ropa..."
            className="mt-6 w-full rounded-2xl border border-zinc-300 bg-white px-5 py-4 outline-none transition focus:border-zinc-500"
          />
          <div className="mt-5 flex flex-wrap gap-2">
   <button
  onClick={() => setSelectedCategory("all")}
  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
    selectedCategory === "all"
      ? "bg-zinc-900 text-white"
      : "border border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400"
  }`}
>
  Todos
</button>

  {categories.map((category) => (
    <button
  key={category.id}
  onClick={() => setSelectedCategory(category.id)}
  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
    selectedCategory === category.id
      ? "bg-zinc-900 text-white"
      : "border border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400"
  }`}
>
  {category.name}
</button>
  ))}
</div>


        </section>

        <section className="mt-12">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Negocios</h2>

            <button className="text-sm font-medium text-zinc-600">
              Ver todos
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {filteredBusinesses.map((business) => (
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
                    {business.isOpen ? "● Abierto" : "Cerrado"}
                  </span>
                </div>

                <h3 className="font-semibold">{business.name}</h3>

                <p className="mt-1 text-sm leading-6 text-zinc-500">
                  {business.description}
                </p>

                <button className="mt-5 text-sm font-semibold">
                  Ver negocio →
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Productos recientes</h2>

            <button className="text-sm font-medium text-zinc-600">
              Ver todos
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => {
              const business = businesses.find(
                (business) => business.id === product.businessId,
                  );

                const availability = getProductAvailability(product, business);
                const available = availability === "available";

              return (
                <article
                  key={product.id}
                  className="overflow-hidden rounded-2xl border border-zinc-200 bg-white"
                >
                  <div className="flex aspect-[4/3] items-center justify-center bg-zinc-100 text-5xl">
                    📦
                  </div>

                  <div className="p-5">
                    <p className="text-sm text-zinc-500">{business?.name ?? "Negocio"}</p>

                    <h3 className="mt-1 font-semibold">{product.name}</h3>

                    <p className="mt-3 text-2xl font-bold">${product.price}</p>

                    <div className="mt-4">
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
                    </div>

                    <button
                      disabled={!available}
                      className="mt-5 w-full rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-500"
                    >
                      {available ? "Ver producto" : "No disponible"}
                    </button>
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
