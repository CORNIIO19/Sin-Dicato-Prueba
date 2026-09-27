import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getBusinessByManagementToken } from "@/modules/marketplace/business-repository";

type RouteContext = {
  params: Promise<{
    token: string;
  }>;
};

export async function POST(
  request: Request,
  { params }: RouteContext,
) {
  try {
    const { token } = await params;

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

    if (business.moderationStatus === "REJECTED") {
      return NextResponse.json(
        {
          error: "Este negocio no puede agregar productos.",
        },
        {
          status: 403,
        },
      );
    }

    const body = await request.json();

    const name = body.name?.trim();
    const description = body.description?.trim();
    const categoryId = body.categoryId?.trim();

    const price = Number(body.price);
    const trackStock = body.trackStock === true;

    if (!name || !description || !categoryId) {
      return NextResponse.json(
        {
          error:
            "Nombre, descripción y categoría son obligatorios.",
        },
        {
          status: 400,
        },
      );
    }

    if (!Number.isFinite(price) || price <= 0) {
      return NextResponse.json(
        {
          error: "Ingresa un precio válido.",
        },
        {
          status: 400,
        },
      );
    }

    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      return NextResponse.json(
        {
          error: "La categoría seleccionada no existe.",
        },
        {
          status: 400,
        },
      );
    }

    let stockQuantity: number | null = null;

    if (trackStock) {
      const stock = Number(body.stockQuantity);

      if (!Number.isInteger(stock) || stock < 0) {
        return NextResponse.json(
          {
            error:
              "El stock debe ser un número entero igual o mayor a 0.",
          },
          {
            status: 400,
          },
        );
      }

      stockQuantity = stock;
    }

    const product = await prisma.product.create({
      data: {
        businessId: business.id,
        categoryId,
        name,
        description,
        price: price.toFixed(2),
        trackStock,
        stockQuantity,
        isAvailable: true,
      },
    });

    return NextResponse.json(
      {
        id: product.id,
        name: product.name,
        moderationStatus: product.moderationStatus,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("Error creating product:", error);

    return NextResponse.json(
      {
        error: "No fue posible crear el producto.",
      },
      {
        status: 500,
      },
    );
  }
}
