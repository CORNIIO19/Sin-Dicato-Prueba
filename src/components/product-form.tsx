"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";

type Category = {
  id: string;
  name: string;
  slug: string;
};

type ProductFormProps = {
  token: string;
  categories: Category[];
};

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export default function ProductForm({
  token,
  categories,
}: ProductFormProps) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] =
    useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] =
    useState("");

  const [trackStock, setTrackStock] =
    useState(true);

  const [stockQuantity, setStockQuantity] =
    useState("1");

  const [image, setImage] =
    useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [createdProductId, setCreatedProductId] =
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

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
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

    if (createdProductId) {
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      /*
       * PASO 1
       * Crear primero el producto.
       */
      const productResponse = await fetch(
        `/api/gestionar/${token}/productos`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
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
          }),
        },
      );

      const productData =
        await productResponse.json();

      if (!productResponse.ok) {
        throw new Error(
          productData.error ??
            "No fue posible agregar el producto.",
        );
      }

      const productId =
        productData.id as string;

      /*
       * Si no seleccionó imagen,
       * terminamos aquí.
       */
      if (!image) {
        router.push(`/gestionar/${token}`);
        router.refresh();
        return;
      }

      /*
       * PASO 2
       * Subir la imagen usando el ID
       * del producto recién creado.
       */
      const formData = new FormData();

      formData.append("image", image);

      const imageResponse = await fetch(
        `/api/gestionar/${token}/productos/${productId}/image`,
        {
          method: "POST",
          body: formData,
        },
      );

      const imageData =
        await imageResponse.json();

      if (!imageResponse.ok) {
        /*
         * El producto YA existe.
         * No permitimos enviar otra vez
         * el formulario para evitar duplicarlo.
         */
        setCreatedProductId(productId);

        setError(
          imageData.error ??
            "El producto fue creado, pero no fue posible guardar la imagen.",
        );

        return;
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

  if (createdProductId) {
    return (
      <section className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8">
        <div className="text-4xl">
          ✓
        </div>

        <h2 className="mt-5 text-2xl font-bold">
          Producto creado
        </h2>

        <p className="mt-2 text-zinc-600">
          El producto se guardó correctamente,
          pero hubo un problema al procesar la
          imagen.
        </p>

        {error && (
          <div className="mt-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
            {error}
          </div>
        )}

        <p className="mt-5 text-sm text-zinc-500">
          No vuelvas a crear el producto.
          Podremos agregar o reemplazar su imagen
          desde la edición del producto.
        </p>

        <Link
          href={`/gestionar/${token}`}
          className="mt-6 block w-full rounded-xl bg-zinc-900 px-4 py-4 text-center font-semibold text-white"
        >
          Volver a mi negocio
        </Link>
      </section>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8"
    >
      <div>
        <label
          htmlFor="productImage"
          className="text-sm font-semibold"
        >
          Imagen del producto
        </label>

        <input
          id="productImage"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleImageChange}
          className="mt-2 block w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm"
        />

        <p className="mt-2 text-xs leading-5 text-zinc-500">
          JPG, PNG o WebP · máximo 10 MB.
          La imagen se optimizará
          automáticamente antes de guardarse.
        </p>

        {image && (
          <div className="mt-3 rounded-xl bg-zinc-50 p-3 text-sm text-zinc-600">
            <p className="font-medium">
              {image.name}
            </p>

            <p className="mt-1 text-xs text-zinc-500">
              {(image.size / 1024 / 1024).toFixed(2)}
              {" MB"}
            </p>
          </div>
        )}
      </div>

      <div className="mt-6">
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
          placeholder="Ej. Brownie clásico"
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
          placeholder="Describe brevemente lo que vendes."
          required
          rows={4}
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
            setCategoryId(event.target.value)
          }
          required
          className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3"
        >
          <option value="">
            Selecciona una categoría
          </option>

          {categories.map((category) => (
            <option
              key={category.id}
              value={category.id}
            >
              {category.name}
            </option>
          ))}
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
          placeholder="Ej. 45.00"
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
          Desactívalo si publicas un servicio
          o algo que no se maneja por unidades.
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
          ? image
            ? "Guardando producto e imagen..."
            : "Guardando producto..."
          : "Agregar producto"}
      </button>
    </form>
  );
}
