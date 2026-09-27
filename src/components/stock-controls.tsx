"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type StockControlsProps = {
  token: string;
  productId: string;
  initialStock: number;
};

export default function StockControls({
  token,
  productId,
  initialStock,
}: StockControlsProps) {
  const router = useRouter();

  const [stock, setStock] = useState(initialStock);
  const [isUpdating, setIsUpdating] = useState(false);

  async function updateStock(delta: 1 | -1) {
    if (isUpdating) {
      return;
    }

    setIsUpdating(true);

    try {
      const response = await fetch(
        `/api/gestionar/${token}/productos/${productId}/stock`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            delta,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        return;
      }

      setStock(data.stockQuantity);

      router.refresh();
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div className="mt-4">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
        Stock disponible
      </p>

      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          disabled={isUpdating || stock === 0}
          onClick={() => updateStock(-1)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-300 font-semibold disabled:opacity-40"
        >
          −
        </button>

        <span className="min-w-8 text-center text-lg font-semibold">
          {stock}
        </span>

        <button
          type="button"
          disabled={isUpdating}
          onClick={() => updateStock(1)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-300 font-semibold disabled:opacity-40"
        >
          +
        </button>
      </div>

      {stock === 0 && (
        <p className="mt-2 text-sm font-medium text-zinc-500">
          Agotado
        </p>
      )}
    </div>
  );
}
