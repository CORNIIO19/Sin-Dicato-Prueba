"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type AdminModerationControlsProps = {
  type: "businesses" | "products";
  id: string;
  name: string;
};

export default function AdminModerationControls({
  type,
  id,
  name,
}: AdminModerationControlsProps) {
  const router = useRouter();

  const [isUpdating, setIsUpdating] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  async function updateModeration(
    moderationStatus:
      | "APPROVED"
      | "REJECTED",
  ) {
    if (isUpdating) {
      return;
    }

    if (moderationStatus === "REJECTED") {
      const confirmed = window.confirm(
        `¿Seguro que quieres rechazar "${name}"?`,
      );

      if (!confirmed) {
        return;
      }
    }

    setError(null);
    setIsUpdating(true);

    try {
      const response = await fetch(
        `/api/admin/${type}/${id}/moderation`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            moderationStatus,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ??
            "No fue posible moderar el contenido.",
        );
      }

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
    <div className="mt-5">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={isUpdating}
          onClick={() =>
            updateModeration("APPROVED")
          }
          className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white disabled:bg-zinc-400"
        >
          {isUpdating
            ? "Procesando..."
            : "Aprobar"}
        </button>

        <button
          type="button"
          disabled={isUpdating}
          onClick={() =>
            updateModeration("REJECTED")
          }
          className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 disabled:opacity-50"
        >
          Rechazar
        </button>
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
