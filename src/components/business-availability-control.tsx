"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type BusinessAvailabilityControlProps = {
  token: string;
  initialIsOpen: boolean;
  isApproved: boolean;
};

export default function BusinessAvailabilityControl({
  token,
  initialIsOpen,
  isApproved,
}: BusinessAvailabilityControlProps) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(initialIsOpen);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function toggleBusiness() {
    if (!isApproved || isUpdating) {
      return;
    }

    const newValue = !isOpen;

    setError(null);
    setIsUpdating(true);

    try {
      const response = await fetch(
        `/api/gestionar/${token}/availability`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isOpen: newValue,
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

      setIsOpen(data.isOpen);

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Ocurrió un error inesperado.",
      );
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div className="mt-4">
      <p className="text-lg font-semibold">
        {isOpen ? "🟢 Abierto" : "🔴 Cerrado"}
      </p>

      {isApproved ? (
        <button
          type="button"
          disabled={isUpdating}
          onClick={toggleBusiness}
          className="mt-3 rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white disabled:bg-zinc-400"
        >
          {isUpdating
            ? "Actualizando..."
            : isOpen
              ? "Cerrar negocio"
              : "Abrir negocio"}
        </button>
      ) : (
        <p className="mt-2 text-sm text-zinc-500">
          Podrás abrir tu negocio cuando haya sido aprobado.
        </p>
      )}

      {error && (
        <p className="mt-3 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
