import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  request: Request,
  { params }: RouteContext,
) {
  try {
    const authenticated =
      await isAdminAuthenticated();

    if (!authenticated) {
      return NextResponse.json(
        {
          error: "No autorizado.",
        },
        {
          status: 401,
        },
      );
    }

    const { id } = await params;

    const body = await request.json();

    const moderationStatus =
      body.moderationStatus;

    if (
      moderationStatus !== "APPROVED" &&
      moderationStatus !== "REJECTED"
    ) {
      return NextResponse.json(
        {
          error: "Estado de moderación inválido.",
        },
        {
          status: 400,
        },
      );
    }

    const product =
      await prisma.product.findUnique({
        where: {
          id,
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

    const updatedProduct =
      await prisma.product.update({
        where: {
          id,
        },
        data: {
          moderationStatus,
        },
      });

    return NextResponse.json({
      id: updatedProduct.id,
      moderationStatus:
        updatedProduct.moderationStatus,
    });
  } catch (error) {
    console.error(
      "Product moderation error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "No fue posible moderar el producto.",
      },
      {
        status: 500,
      },
    );
  }
}
