"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import type {
  ChangeEvent,
  FormEvent,
} from "react";
import { useState } from "react";

type Category = {
  id: string;
  name: string;
  slug: string;
};

type ProductData = {
  id: string;
  name: string;
  description: string;
  price: string;
  categoryId: string;

  trackStock: boolean;
  stockQuantity: number | null;
  isAvailable: boolean;

  imagePath: string | null;
};

type EditProductFormProps = {
  token: string;
  product: ProductData;
  categories: Category[];
};

const MAX_IMAGE_SIZE =
  10 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export default function EditProductForm({
  token,
  product,
  categories,
}: EditProductFormProps) {
  const router = useRouter();

  const [name, setName] =
    useState(product.name);

  const [description, setDescription] =
    useState(product.description);

  const [price, setPrice] =
    useState(product.price);

  const [categoryId, setCategoryId] =
    useState(product.categoryId);

  const [trackStock, setTrackStock] =
    useState(product.trackStock);

  const [
    stockQuantity,
    setStockQuantity,
  ] = useState(
    product.stockQuantity?.toString() ??
      "0",
  );

  const [
    isAvailable,
    setIsAvailable,
  ] = useState(product.isAvailable);

  const [image, setImage] =
    useState<File | null>(null);

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [error, setError] =
    useState<string | null>(null);

  function handleImageChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    setError(null);

    const file =
      event.target.files?.[0] ?? null;

    if (!file) {
      setImage(null);
      return;
    }

    if (
      !ALLOWED_IMAGE_TYPES.includes(
        file.type,
      )
    ) {
      setImage(null);

      setError(
        "Formato no permitido. Usa JPG, PNG o WebP.",
      );

      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setImage(null);

      setError(
        "La imagen no puede pesar más de 10 MB.",
      );

      event.target.value = "";
      return;
    }

    setImage(file);
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError(null);
    setIsSubmitting(true);

    try {
      /*
       * PASO 1
       * Actualizar información del producto.
       */
      const response = await fetch(
        `/api/gestionar/${token}/productos/${product.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name,
            description,
            price,
            categoryId,
            trackStock,

            stockQuantity: trackStock
              ? stockQuantity
              : null,

            isAvailable,
          }),
        },
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ??
            "No fue posible actualizar el producto.",
        );
      }

      /*
       * PASO 2
       * Si seleccionó una imagen nueva,
       * subirla y reemplazar la anterior.
       */
      if (image) {
        const formData =
          new FormData();

        formData.append(
          "image",
          image,
        );

        const imageResponse =
          await fetch(
            `/api/gestionar/${token}/productos/${product.id}/image`,
            {
              method: "POST",
              body: formData,
            },
          );

        const imageData =
          await imageResponse.json();

        if (!imageResponse.ok) {
          setError(
            imageData.error ??
              "Los cambios se guardaron, pero no fue posible actualizar la imagen.",
          );

          return;
        }
      }

      router.push(
        `/gestionar/${token}`,
      );

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
        <p className="text-sm font-semibold">
          Imagen del producto
        </p>

        {product.imagePath ? (
          <div className="relative mt-3 aspect-[4/3] max-w-sm overflow-hidden rounded-2xl bg-zinc-100">
            <Image
              src={product.imagePath}
              alt={product.name}
              fill
              sizes="384px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="mt-3 flex aspect-[4/3] max-w-sm items-center justify-center rounded-2xl bg-zinc-100 text-5xl">
            📦
          </div>
        )}

        <label
          htmlFor="productImage"
          className="mt-5 block text-sm font-semibold"
        >
          {product.imagePath
            ? "Reemplazar imagen"
            : "Agregar imagen"}
        </label>

        <input
          id="productImage"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleImageChange}
          className="mt-2 block w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm"
        />

        <p className="mt-2 text-xs text-zinc-500">
          JPG, PNG o WebP · máximo
          10 MB. La imagen será
          optimizada automáticamente.
        </p>

        {image && (
          <div className="mt-3 rounded-xl bg-zinc-50 p-3 text-sm">
            <p className="font-medium">
              Nueva imagen:
              {" "}
              {image.name}
            </p>

            <p className="mt-1 text-xs text-zinc-500">
              {(
                image.size /
                1024 /
                1024
              ).toFixed(2)}
              {" MB"}
            </p>
          </div>
        )}
      </div>

      <div className="mt-8">
        <label
          htmlFor="name"
          className="text-sm font-semibold"
        >
          Nombre del producto o servicio
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
            setDescription(
              event.target.value,
            )
          }
          rows={4}
          required
          className="mt-2 w-full resize-none rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-500"
        />
      </div>

      <div className="mt-6">
        <label
          htmlFor="category"
          className="text-sm font-semibold"
        >
          Categoría
        </label>

        <select
          id="category"
          value={categoryId}
          onChange={(event) =>
            setCategoryId(
              event.target.value,
            )
          }
          required
          className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3"
        >
          {categories.map(
            (category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ),
          )}
        </select>
      </div>

      <div className="mt-6">
        <label
          htmlFor="price"
          className="text-sm font-semibold"
        >
          Precio
        </label>

        <input
          id="price"
          type="number"
          min="0.01"
          step="0.01"
          value={price}
          onChange={(event) =>
            setPrice(event.target.value)
          }
          required
          className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-500"
        />
      </div>

      <div className="mt-6 rounded-2xl bg-zinc-50 p-5">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={trackStock}
            onChange={(event) =>
              setTrackStock(
                event.target.checked,
              )
            }
          />

          <span className="font-medium">
            Controlar stock
          </span>
        </label>

        <p className="mt-2 text-sm text-zinc-500">
          Desactívalo para servicios
          o productos que no se controlan
          por unidades.
        </p>

        {trackStock && (
          <div className="mt-5">
            <label
              htmlFor="stockQuantity"
              className="text-sm font-semibold"
            >
              Cantidad disponible
            </label>

            <input
              id="stockQuantity"
              type="number"
              min="0"
              step="1"
              value={stockQuantity}
              onChange={(event) =>
                setStockQuantity(
                  event.target.value,
                )
              }
              required
              className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3"
            />
          </div>
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-zinc-200 p-5">
        <label className="flex items-center justify-between gap-4">
          <div>
            <p className="font-medium">
              Producto disponible
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              Puedes pausarlo sin
              eliminarlo.
            </p>
          </div>

          <input
            type="checkbox"
            checked={isAvailable}
            onChange={(event) =>
              setIsAvailable(
                event.target.checked,
              )
            }
          />
        </label>
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
          ? image
            ? "Guardando cambios e imagen..."
            : "Guardando cambios..."
          : "Guardar cambios"}
      </button>
    </form>
  );
}
