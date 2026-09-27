import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getBusinessByManagementToken } from "@/modules/marketplace/business-repository";

type RouteContext = {
  params: Promise<{
    token: string;
  }>;
};

export async function PATCH(
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

    if (business.moderationStatus !== "APPROVED") {
      return NextResponse.json(
        {
          error:
            "El negocio debe estar aprobado antes de poder abrirse.",
        },
        {
          status: 403,
        },
      );
    }

    const body = await request.json();

    if (typeof body.isOpen !== "boolean") {
      return NextResponse.json(
        {
          error: "Estado del negocio inválido.",
        },
        {
          status: 400,
        },
      );
    }

    const updatedBusiness = await prisma.business.update({
      where: {
        id: business.id,
      },
      data: {
        isOpen: body.isOpen,
      },
    });

    return NextResponse.json({
      id: updatedBusiness.id,
      isOpen: updatedBusiness.isOpen,
    });
  } catch (error) {
    console.error(
      "Error updating business availability:",
      error,
    );

    return NextResponse.json(
      {
        error: "No fue posible actualizar el estado del negocio.",
      },
      {
        status: 500,
      },
    );
  }
}
