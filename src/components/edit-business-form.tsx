"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";

type EditBusinessFormProps = {
  token: string;
  business: {
    name: string;
    description: string;
    whatsapp: string;
  };
};

export default function EditBusinessForm({
  token,
  business,
}: EditBusinessFormProps) {
  const router = useRouter();

  const [name, setName] =
    useState(business.name);

  const [description, setDescription] =
    useState(business.description);

  const [whatsapp, setWhatsapp] =
    useState(business.whatsapp);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `/api/gestionar/${token}/business`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name,
            description,
            whatsapp,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ??
            "No fue posible actualizar el negocio.",
        );
      }

      router.push(`/gestionar/${token}`);
      router.refresh();
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

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8"
    >
      <div>
        <label
          htmlFor="name"
          className="text-sm font-semibold"
        >
          Nombre del negocio
        </label>

        <input
          id="name"
          type="text"
          value={name}
          onChange={(event) =>
            setName(event.target.value)
          }
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
          rows={4}
          required
          className="mt-2 w-full resize-none rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-500"
        />
      </div>

      <div className="mt-6">
        <label
          htmlFor="whatsapp"
          className="text-sm font-semibold"
        >
          WhatsApp
        </label>

        <input
          id="whatsapp"
          type="tel"
          value={whatsapp}
          onChange={(event) =>
            setWhatsapp(event.target.value)
          }
          required
          className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-500"
        />

        <p className="mt-2 text-xs text-zinc-500">
          Este será el número al que llegarán las
          solicitudes de compra.
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
        className="mt-8 w-full rounded-xl bg-zinc-900 px-4 py-4 font-semibold text-white disabled:bg-zinc-400"
      >
        {isSubmitting
          ? "Guardando cambios..."
          : "Guardar cambios"}
      </button>
    </form>
  );
}
