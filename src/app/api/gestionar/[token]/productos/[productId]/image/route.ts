import { randomUUID } from "node:crypto";
import {
  mkdir,
  unlink,
} from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";
import sharp from "sharp";

import { prisma } from "@/lib/prisma";
import { getBusinessByManagementToken } from "@/modules/marketplace/business-repository";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

type RouteContext = {
  params: Promise<{
    token: string;
    productId: string;
  }>;
};

export async function POST(
  request: Request,
  { params }: RouteContext,
) {
  let newFilePath: string | null = null;

  try {
    const { token, productId } = await params;

    const business =
      await getBusinessByManagementToken(token);

    if (!business) {
      return NextResponse.json(
        {
          error: "Liga de administración inválida.",
        },
        {
          status: 404,
        },
      );
    }

    const product =
      await prisma.product.findFirst({
        where: {
          id: productId,
          businessId: business.id,
        },
      });

    if (!product) {
      return NextResponse.json(
        {
          error:
            "El producto no existe o no pertenece a este negocio.",
        },
        {
          status: 404,
        },
      );
    }

    const formData = await request.formData();

    const image = formData.get("image");

    if (!(image instanceof File)) {
      return NextResponse.json(
        {
          error: "Selecciona una imagen.",
        },
        {
          status: 400,
        },
      );
    }

    if (image.size === 0) {
      return NextResponse.json(
        {
          error: "La imagen está vacía.",
        },
        {
          status: 400,
        },
      );
    }

    if (image.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error:
            "La imagen no puede pesar más de 10 MB.",
        },
        {
          status: 413,
        },
      );
    }

    if (!ALLOWED_TYPES.has(image.type)) {
      return NextResponse.json(
        {
          error:
            "Formato no permitido. Usa JPG, PNG o WebP.",
        },
        {
          status: 415,
        },
      );
    }

    const buffer = Buffer.from(
      await image.arrayBuffer(),
    );

    const uploadDirectory = path.join(
      process.cwd(),
      "public",
      "uploads",
      "products",
    );

    await mkdir(uploadDirectory, {
      recursive: true,
    });

    const filename = `${randomUUID()}.webp`;

    newFilePath = path.join(
      uploadDirectory,
      filename,
    );

    try {
      await sharp(buffer, {
        limitInputPixels: 40_000_000,
      })
        .rotate()
        .resize({
          width: 1200,
          height: 1200,
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({
          quality: 80,
        })
        .toFile(newFilePath);
    } catch {
      return NextResponse.json(
        {
          error:
            "El archivo no contiene una imagen válida.",
        },
        {
          status: 400,
        },
      );
    }

    const imagePath =
      `/uploads/products/${filename}`;

    const previousImagePath =
      product.imagePath;

    const updatedProduct =
      await prisma.product.update({
        where: {
          id: product.id,
        },
        data: {
          imagePath,
        },
      });

    if (
      previousImagePath &&
      previousImagePath.startsWith(
        "/uploads/products/",
      )
    ) {
      const previousFile = path.join(
        process.cwd(),
        "public",
        previousImagePath,
      );

      try {
        await unlink(previousFile);
      } catch {
        // Si el archivo anterior ya no existe,
        // no bloqueamos la actualización.
      }
    }

    return NextResponse.json({
      id: updatedProduct.id,
      imagePath:
        updatedProduct.imagePath,
    });
  } catch (error) {
    console.error(
      "Error uploading product image:",
      error,
    );

    if (newFilePath) {
      try {
        await unlink(newFilePath);
      } catch {
        // No hacemos nada si la limpieza falla.
      }
    }

    return NextResponse.json(
      {
        error:
          "No fue posible guardar la imagen.",
      },
      {
        status: 500,
      },
    );
  }
}
