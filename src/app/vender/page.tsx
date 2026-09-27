"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useState } from "react";

type CreatedBusiness = {
  id: string;
  name: string;
  moderationStatus: string;
  managementToken: string;
};

export default function SellPage() {
  const [businessName, setBusinessName] = useState("");
  const [description, setDescription] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdBusiness, setCreatedBusiness] =
    useState<CreatedBusiness | null>(null);

  const [copied, setCopied] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/businesses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: businessName,
          description,
          whatsapp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ?? "No fue posible crear el negocio.",
        );
      }

      setCreatedBusiness(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Ocurrió un error inesperado.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function copyManagementLink() {
    if (!createdBusiness) {
      return;
    }

    const url =
      `${window.location.origin}/gestionar/${createdBusiness.managementToken}`;

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      } else {
        const textarea = document.createElement("textarea");

        textarea.value = url;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";

        document.body.appendChild(textarea);

        textarea.focus();
        textarea.select();

        document.execCommand("copy");

        document.body.removeChild(textarea);
      }

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setError(
        "No pudimos copiar la liga automáticamente. Abre tu panel y guarda la dirección del navegador.",
      );
    }
  }

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-3xl px-6 py-5">
          <Link
            href="/"
            className="text-sm font-medium text-zinc-600"
          >
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

        {createdBusiness ? (
          <section className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8">
            <div className="text-4xl">✓</div>

            <h2 className="mt-5 text-2xl font-bold">
              Negocio registrado
            </h2>

            <p className="mt-2 text-zinc-600">
              Tu negocio fue guardado correctamente y está
              pendiente de aprobación.
            </p>

            <div className="mt-6 rounded-2xl bg-zinc-50 p-5">
              <p className="font-semibold">
                {createdBusiness.name}
              </p>

              <p className="mt-2 text-sm text-zinc-500">
                Estado: {createdBusiness.moderationStatus}
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <p className="font-semibold text-amber-900">
                🔐 Guarda tu liga privada de administración
              </p>

              <p className="mt-2 text-sm leading-6 text-amber-800">
                Esta liga funciona como tu acceso a Sin Dicato.
                La necesitarás cada vez que quieras administrar
                tu negocio.
              </p>

              <ul className="mt-4 space-y-1 text-sm text-amber-800">
                <li>• Agregar o editar productos</li>
                <li>• Actualizar precios y stock</li>
                <li>• Marcar productos como disponibles o agotados</li>
                <li>• Abrir o cerrar tu negocio</li>
                <li>• Editar la información de tu negocio</li>
              </ul>

              <p className="mt-4 text-sm font-medium text-amber-900">
                No compartas esta liga públicamente. Cualquier
                persona que la tenga podrá administrar tu negocio.
              </p>
            </div>

            <button
              type="button"
              onClick={copyManagementLink}
              className="mt-6 w-full rounded-xl border border-zinc-300 px-4 py-4 font-semibold"
            >
              {copied
                ? "✓ Liga copiada"
                : "Copiar liga privada"}
            </button>

            <Link
              href={`/gestionar/${createdBusiness.managementToken}`}
              className="mt-3 block w-full rounded-xl bg-zinc-900 px-4 py-4 text-center font-semibold text-white"
            >
              Gestionar mi negocio
            </Link>

            <Link
              href="/"
              className="mt-3 block w-full rounded-xl px-4 py-4 text-center font-medium text-zinc-600"
            >
              Volver a Sin Dicato
            </Link>

            {error && (
              <div className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}
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
                onChange={(event) =>
                  setBusinessName(event.target.value)
                }
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
                onChange={(event) =>
                  setDescription(event.target.value)
                }
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
                onChange={(event) =>
                  setWhatsapp(event.target.value)
                }
                placeholder="Ej. 55 1234 5678"
                required
                className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-500"
              />

              <p className="mt-2 text-xs leading-5 text-zinc-500">
                Este número será visible como medio de contacto
                para tus compradores. Puedes registrar hasta
                3 negocios con el mismo número.
              </p>
            </div>

            {error && (
              <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-8 w-full rounded-xl bg-zinc-900 px-4 py-4 font-semibold text-white disabled:cursor-not-allowed disabled:bg-zinc-400"
            >
              {isSubmitting
                ? "Registrando negocio..."
                : "Continuar"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
