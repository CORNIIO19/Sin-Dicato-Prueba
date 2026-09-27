import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getBusinessByManagementToken } from "@/modules/marketplace/business-repository";

type RouteContext = {
  params: Promise<{
    token: string;
  }>;
};

function normalizeWhatsapp(value: string) {
  const digits = value.replace(/\D/g, "");

  if (digits.length === 10) {
    return `52${digits}`;
  }

  if (
    digits.length === 12 &&
    digits.startsWith("52")
  ) {
    return digits;
  }

  if (
    digits.length === 13 &&
    digits.startsWith("521")
  ) {
    return `52${digits.slice(3)}`;
  }

  return null;
}

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

    const body = await request.json();

    const name = body.name?.trim();
    const description = body.description?.trim();
    const whatsapp =
      normalizeWhatsapp(body.whatsapp ?? "");

    if (!name || !description) {
      return NextResponse.json(
        {
          error:
            "Nombre y descripción son obligatorios.",
        },
        {
          status: 400,
        },
      );
    }

    if (!whatsapp) {
      return NextResponse.json(
        {
          error:
            "Ingresa un número de WhatsApp mexicano válido.",
        },
        {
          status: 400,
        },
      );
    }

    if (whatsapp !== business.whatsapp) {
      const businessCount =
        await prisma.business.count({
          where: {
            whatsapp,
            id: {
              not: business.id,
            },
          },
        });

      if (businessCount >= 3) {
        return NextResponse.json(
          {
            error:
              "Este número de WhatsApp ya tiene 3 negocios registrados.",
          },
          {
            status: 409,
          },
        );
      }
    }

    const updatedBusiness =
      await prisma.business.update({
        where: {
          id: business.id,
        },
        data: {
          name,
          description,
          whatsapp,
        },
      });

    return NextResponse.json({
      id: updatedBusiness.id,
      name: updatedBusiness.name,
      description: updatedBusiness.description,
      whatsapp: updatedBusiness.whatsapp,
    });
  } catch (error) {
    console.error(
      "Error updating business:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "No fue posible actualizar el negocio.",
      },
      {
        status: 500,
      },
    );
  }
}
