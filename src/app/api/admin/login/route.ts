import { NextResponse } from "next/server";

import { createAdminSession } from "@/lib/admin-auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const password = body.password;

    const adminPassword =
      process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json(
        {
          error:
            "La contraseña de administrador no está configurada.",
        },
        {
          status: 500,
        },
      );
    }

    if (password !== adminPassword) {
      return NextResponse.json(
        {
          error: "Contraseña incorrecta.",
        },
        {
          status: 401,
        },
      );
    }

    await createAdminSession();

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Admin login error:", error);

    return NextResponse.json(
      {
        error: "No fue posible iniciar sesión.",
      },
      {
        status: 500,
      },
    );
  }
}
