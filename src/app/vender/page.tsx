"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useState } from "react";

import BrandLockup from "@/components/brand-lockup";
import { createWhatsAppManagementLink } from "@/modules/marketplace/whatsapp";

type CreatedBusiness = {
  id: string;
  name: string;
  whatsapp: string;
  moderationStatus: string;
  managementToken: string;
};

export default function SellPage() {
  const [businessName, setBusinessName] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [whatsapp, setWhatsapp] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [
    createdBusiness,
    setCreatedBusiness,
  ] = useState<CreatedBusiness | null>(
    null,
  );

  const [copied, setCopied] =
    useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(
        "/api/businesses",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name: businessName,
            description,
            whatsapp,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ??
            "No fue posible crear el negocio.",
        );
      }

      setCreatedBusiness(data);

      if (typeof window !== "undefined") {
        const url = `${window.location.origin}/gestionar/${data.managementToken}`;
        const waUrl = createWhatsAppManagementLink({
          whatsapp: data.whatsapp,
          businessName: data.name,
          managementUrl: url,
        });

        window.open(waUrl, "_blank");
      }
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
        await navigator.clipboard.writeText(
          url,
        );
      } else {
        const textarea =
          document.createElement(
            "textarea",
          );

        textarea.value = url;
        textarea.style.position =
          "fixed";
        textarea.style.opacity = "0";

        document.body.appendChild(
          textarea,
        );

        textarea.focus();
        textarea.select();

        document.execCommand("copy");

        document.body.removeChild(
          textarea,
        );
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

  const managementUrl =
    typeof window !== "undefined" && createdBusiness
      ? `${window.location.origin}/gestionar/${createdBusiness.managementToken}`
      : "";

  const whatsappUrl =
    createdBusiness && managementUrl
      ? createWhatsAppManagementLink({
          whatsapp: createdBusiness.whatsapp,
          businessName: createdBusiness.name,
          managementUrl,
        })
      : "";

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-950">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <BrandLockup compact />

          <Link
            href="/"
            className="shrink-0 rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50"
          >
            Volver
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        {!createdBusiness && (
          <div className="mb-8">
            <div className="mb-5 h-1.5 w-10 rounded-full bg-orange-500" />

            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-zinc-500">
              Vende en Sin Dicato
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
              Publica tu negocio
            </h1>

            <p className="mt-3 max-w-xl leading-7 text-zinc-600">
              Crea tu espacio dentro del
              mercadito digital de la
              comunidad UAMera.
            </p>
          </div>
        )}

        {createdBusiness ? (
          <section className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-xl font-bold text-emerald-700">
              ✓
            </div>

            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.12em] text-zinc-500">
              Registro completado
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-[-0.03em]">
              Tu negocio ya está en Sin Dicato
            </h1>

            <p className="mt-3 leading-7 text-zinc-600">
              Guardamos tu negocio
              correctamente. Ahora está
              pendiente de revisión antes de
              aparecer públicamente.
            </p>

            <div className="mt-7 rounded-2xl bg-zinc-50 p-5">
              <p className="text-sm text-zinc-500">
                Negocio
              </p>

              <p className="mt-1 text-lg font-semibold">
                {createdBusiness.name}
              </p>

              <p className="mt-3 text-sm text-zinc-500">
                Estado
              </p>

              <p className="mt-1 font-medium text-amber-700">
                Pendiente de aprobación
              </p>
            </div>

            {/* AVISO DE LIGA */}
            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <p className="font-semibold text-amber-900">
                🔐 Guarda tu liga privada
                de administración
              </p>

              <p className="mt-2 text-sm leading-6 text-amber-800">
                Esta liga funciona como tu
                acceso a Sin Dicato. La
                necesitarás cada vez que
                quieras administrar tu
                negocio.
              </p>

              <ul className="mt-4 space-y-1 text-sm leading-6 text-amber-800">
                <li>
                  • Agregar o editar
                  productos
                </li>
                <li>
                  • Actualizar precios y
                  stock
                </li>
                <li>
                  • Pausar o activar
                  productos
                </li>
                <li>
                  • Abrir o cerrar tu
                  negocio
                </li>
                <li>
                  • Editar la información
                  del negocio
                </li>
              </ul>

              <p className="mt-4 text-sm font-semibold text-amber-900">
                No compartas esta liga
                públicamente. Cualquier
                persona que la tenga podrá
                administrar tu negocio.
              </p>
            </div>

            {/* ACCIÓN PRINCIPAL: WHATSAPP */}
            <div className="mt-6">
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-emerald-600 px-5 py-3.5 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                >
                  <svg
                    className="h-5 w-5 fill-current"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.074-2.02-.476-1.579-.654-2.612-2.28-2.69-2.385-.078-.106-.633-.844-.633-1.611 0-.767.399-1.144.542-1.299.144-.156.314-.195.42-.195.105 0 .21.001.303.006.097.004.228-.037.356.271.132.318.452 1.103.492 1.185.04.082.067.177.013.283-.053.106-.079.172-.158.265-.079.092-.167.206-.239.277-.079.079-.161.164-.069.322.092.158.409.675.877 1.092.603.537 1.11.703 1.268.782.159.079.251.066.345-.04.093-.106.399-.464.505-.623.106-.159.212-.132.357-.079.146.053.927.437 1.086.517.159.079.265.119.305.185.04.066.04.384-.104.789zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.66 1.434 5.176L2 22l4.966-1.396A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.182c-1.636 0-3.155-.478-4.442-1.3l-.318-.203-2.951.829.832-2.887-.222-.338A8.141 8.141 0 013.818 12c0-4.511 3.671-8.182 8.182-8.182 4.511 0 8.182 3.671 8.182 8.182 0 4.511-3.671 8.182-8.182 8.182z" />
                  </svg>
                  Enviar liga a mi WhatsApp
                </a>
              )}

              <p className="mt-2 text-center text-xs text-zinc-500">
                Abre un chat con tu número para enviarte tu liga privada y guardarla de forma segura.
              </p>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={
                  copyManagementLink
                }
                className="min-h-12 rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm font-semibold transition hover:bg-zinc-50"
              >
                {copied
                  ? "✓ Liga copiada"
                  : "Copiar liga privada"}
              </button>

              <Link
                href={`/gestionar/${createdBusiness.managementToken}`}
                className="flex min-h-12 items-center justify-center rounded-xl bg-zinc-950 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-zinc-800"
              >
                Gestionar mi negocio
              </Link>
            </div>

            <Link
              href="/"
              className="mt-3 block min-h-12 rounded-xl px-4 py-3 text-center text-sm font-medium text-zinc-600 transition hover:bg-zinc-50"
            >
              Volver al mercadito
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
                  setBusinessName(
                    event.target.value,
                  )
                }
                placeholder="Ej. Dulce Campus"
                required
                className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-zinc-500"
              />
            </div>

            <div className="mt-6">
              <label
                htmlFor="description"
                className="text-sm font-semibold"
              >
                ¿Qué ofrece tu negocio?
              </label>

              <textarea
                id="description"
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value,
                  )
                }
                placeholder="Cuéntale brevemente a la comunidad qué vendes u ofreces."
                required
                rows={4}
                className="mt-2 w-full resize-none rounded-xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-zinc-500"
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
                  setWhatsapp(
                    event.target.value,
                  )
                }
                placeholder="Ej. 55 1234 5678"
                required
                className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-zinc-500"
              />

              <p className="mt-2 text-xs leading-5 text-zinc-500">
                Tus compradores usarán este
                número para contactarte
                directamente por WhatsApp.
                Puedes registrar hasta 3
                negocios con el mismo número.
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
              className="mt-8 w-full rounded-xl bg-zinc-950 px-4 py-4 font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
            >
              {isSubmitting
                ? "Registrando negocio..."
                : "Crear mi negocio"}
            </button>

            <p className="mt-4 text-center text-xs leading-5 text-zinc-500">
              Tu negocio será revisado antes
              de aparecer públicamente en
              Sin Dicato.
            </p>
          </form>
        )}
      </div>
    </main>
  );
}
