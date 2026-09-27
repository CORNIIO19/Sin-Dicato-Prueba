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

    if (!product.trackStock) {
      return NextResponse.json(
        {
          error: "Este producto no controla stock.",
        },
        {
          status: 400,
        },
      );
    }

    const body = await request.json();

    const delta = Number(body.delta);

    if (delta !== 1 && delta !== -1) {
      return NextResponse.json(
        {
          error: "Operación de stock inválida.",
        },
        {
          status: 400,
        },
      );
    }

    const currentStock = product.stockQuantity ?? 0;

    const newStock = Math.max(
      0,
      currentStock + delta,
    );

    const updatedProduct = await prisma.product.update({
      where: {
        id: product.id,
      },
      data: {
        stockQuantity: newStock,
      },
    });

    return NextResponse.json({
      stockQuantity: updatedProduct.stockQuantity,
    });
  } catch (error) {
    console.error("Error updating stock:", error);

    return NextResponse.json(
      {
        error: "No fue posible actualizar el stock.",
      },
      {
        status: 500,
      },
    );
  }
}
