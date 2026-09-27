import { createHash, randomBytes } from "crypto";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

function normalizeWhatsapp(value: string) {
  const digits = value.replace(/\D/g, "");

  // Número mexicano local: 55 1234 5678
  if (digits.length === 10) {
    return `52${digits}`;
  }

  // Número mexicano con código de país: +52 55 1234 5678
  if (digits.length === 12 && digits.startsWith("52")) {
    return digits;
  }

  // Formato antiguo +52 1 ...
  if (digits.length === 13 && digits.startsWith("521")) {
    return `52${digits.slice(3)}`;
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = body.name?.trim();
    const description = body.description?.trim();
    const whatsapp = normalizeWhatsapp(body.whatsapp ?? "");

    if (!name || !description) {
      return NextResponse.json(
        {
          error: "Nombre y descripción son obligatorios.",
        },
        {
          status: 400,
        },
      );
    }

    if (!whatsapp) {
      return NextResponse.json(
        {
          error: "Ingresa un número de WhatsApp mexicano válido.",
        },
        {
          status: 400,
        },
      );
    }

    const businessCount = await prisma.business.count({
      where: {
        whatsapp,
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

    const managementToken = randomBytes(32).toString("hex");

    const managementTokenHash = createHash("sha256")
      .update(managementToken)
      .digest("hex");

    const business = await prisma.business.create({
      data: {
        name,
        description,
        whatsapp,
        managementTokenHash,
      },
    });

    return NextResponse.json(
      {
        id: business.id,
        name: business.name,
        moderationStatus: business.moderationStatus,
        managementToken,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("Error creating business:", error);

    return NextResponse.json(
      {
        error: "No fue posible crear el negocio.",
      },
      {
        status: 500,
      },
    );
  }
}
