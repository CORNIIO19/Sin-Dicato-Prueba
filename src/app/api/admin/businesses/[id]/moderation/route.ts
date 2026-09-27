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

    const business =
      await prisma.business.findUnique({
        where: {
          id,
        },
      });

    if (!business) {
      return NextResponse.json(
        {
          error: "Negocio no encontrado.",
        },
        {
          status: 404,
        },
      );
    }

    const updatedBusiness =
      await prisma.business.update({
        where: {
          id,
        },
        data: {
          moderationStatus,

          ...(moderationStatus === "REJECTED"
            ? {
                isOpen: false,
              }
            : {}),
        },
      });

    return NextResponse.json({
      id: updatedBusiness.id,
      moderationStatus:
        updatedBusiness.moderationStatus,
    });
  } catch (error) {
    console.error(
      "Business moderation error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "No fue posible moderar el negocio.",
      },
      {
        status: 500,
      },
    );
  }
}

