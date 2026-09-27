import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getBusinessByManagementToken } from "@/modules/marketplace/business-repository";

type RouteContext = {
  params: Promise<{
    token: string;
    productId: string;
  }>;
};

export async function PATCH(
  request: Request,
  { params }: RouteContext,
) {
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

    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        businessId: business.id,
      },
    });

    if (!product) {
      return NextResponse.json(
        {
          error: "Producto no encontrado.",
        },
        {
          status: 404,
        },
      );
    }

    const body = await request.json();

    if (typeof body.isAvailable !== "boolean") {
      return NextResponse.json(
        {
          error: "Estado de disponibilidad inválido.",
        },
        {
          status: 400,
        },
      );
    }

    const updatedProduct = await prisma.product.update({
      where: {
        id: product.id,
      },
      data: {
        isAvailable: body.isAvailable,
      },
    });

    return NextResponse.json({
      id: updatedProduct.id,
      isAvailable: updatedProduct.isAvailable,
    });
  } catch (error) {
    console.error(
      "Error updating product availability:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "No fue posible actualizar la disponibilidad.",
      },
      {
        status: 500,
      },
    );
  }
}
