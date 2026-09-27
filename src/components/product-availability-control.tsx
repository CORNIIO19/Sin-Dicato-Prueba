"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type ProductAvailabilityControlProps = {
  token: string;
  productId: string;
  initialIsAvailable: boolean;
};

export default function ProductAvailabilityControl({
  token,
  productId,
  initialIsAvailable,
}: ProductAvailabilityControlProps) {
  const router = useRouter();

  const [isAvailable, setIsAvailable] =
    useState(initialIsAvailable);

  const [isUpdating, setIsUpdating] = useState(false);

  async function toggleAvailability() {
    if (isUpdating) {
      return;
    }

    const newValue = !isAvailable;

    setIsUpdating(true);

    try {
      const response = await fetch(
        `/api/gestionar/${token}/productos/${productId}/availability`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isAvailable: newValue,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        return;
      }

      setIsAvailable(data.isAvailable);

      router.refresh();
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <span
        className={`rounded-full px-3 py-1 text-xs font-medium ${
          isAvailable
            ? "bg-emerald-100 text-emerald-700"
            : "bg-zinc-100 text-zinc-500"
        }`}
      >
        {isAvailable
          ? "● Publicación activa"
          : "Publicación pausada"}
      </span>

      <button
        type="button"
        disabled={isUpdating}
        onClick={toggleAvailability}
        className="text-sm font-semibold text-zinc-700 disabled:opacity-50"
      >
        {isUpdating
          ? "Actualizando..."
          : isAvailable
            ? "Pausar producto"
            : "Activar producto"}
      </button>
    </div>
  );
}
