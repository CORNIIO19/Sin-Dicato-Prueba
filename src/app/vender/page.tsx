"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function SellPage() {
  const [businessName, setBusinessName] = useState("");
  const [description, setDescription] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!businessName.trim() || !description.trim() || !whatsapp.trim()) {
      return;
    }

    setSubmitted(true);
  }

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-3xl px-6 py-5">
          <Link href="/" className="text-sm font-medium text-zinc-600">
            ← Volver a Sin Dicato
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Publica tu negocio
          </h1>

          <p className="mt-2 text-zinc-600">
            Comparte lo que vendes con la comunidad UAM.
          </p>
        </div>

        {submitted ? (
          <section className="rounded-3xl border border-zinc-200 bg-white p-8">
            <div className="text-4xl">✓</div>

            <h2 className="mt-5 text-2xl font-bold">
              Datos recibidos
            </h2>

            <p className="mt-2 text-zinc-600">
              Por ahora estamos probando el formulario. En el siguiente paso
              conectaremos estos datos con nuestra base de datos.
            </p>

            <div className="mt-6 rounded-2xl bg-zinc-50 p-5">
              <p className="font-semibold">{businessName}</p>
              <p className="mt-2 text-sm text-zinc-600">{description}</p>
              <p className="mt-3 text-sm text-zinc-500">
                WhatsApp: {whatsapp}
              </p>
            </div>
          </section>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8"
          >
            <div>
              <label
                htmlFor="businessName"
                className="text-sm font-semibold"
              >
                Nombre del negocio
              </label>

              <input
                id="businessName"
                type="text"
                value={businessName}
                onChange={(event) => setBusinessName(event.target.value)}
                placeholder="Ej. Dulce Campus"
                required
                className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-500"
              />
            </div>

            <div className="mt-6">
              <label
                htmlFor="description"
                className="text-sm font-semibold"
              >
                Descripción
              </label>

              <textarea
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Cuéntanos brevemente qué ofrece tu negocio."
                required
                rows={4}
                className="mt-2 w-full resize-none rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-500"
              />
            </div>

            <div className="mt-6">
              <label
                htmlFor="whatsapp"
                className="text-sm font-semibold"
              >
                WhatsApp de contacto
              </label>

              <input
                id="whatsapp"
                type="tel"
                value={whatsapp}
                onChange={(event) => setWhatsapp(event.target.value)}
                placeholder="Ej. 55 1234 5678"
                required
                className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-500"
              />

              <p className="mt-2 text-xs text-zinc-500">
                Este número será utilizado para que los compradores puedan
                contactarte.
              </p>
            </div>

            <button
              type="submit"
              className="mt-8 w-full rounded-xl bg-zinc-900 px-4 py-4 font-semibold text-white"
            >
              Continuar
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
