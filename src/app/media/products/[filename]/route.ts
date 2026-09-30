import {
  readFile,
  stat,
} from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{
    filename: string;
  }>;
};

function getProductImagePath(
  filename: string,
) {
  const validFilename =
    /^[0-9a-f-]{36}\.webp$/i;

  if (!validFilename.test(filename)) {
    return null;
  }

  const uploadRoot =
    process.env.UPLOAD_DIR ??
    path.join(process.cwd(), "uploads");

  return path.join(
    uploadRoot,
    "products",
    filename,
  );
}

export async function GET(
  _request: Request,
  { params }: RouteContext,
) {
  const { filename } = await params;

  const filePath =
    getProductImagePath(filename);

  if (!filePath) {
    return new NextResponse(
      "Imagen no encontrada",
      {
        status: 404,
      },
    );
  }

  try {
    const file = await readFile(filePath);

    return new NextResponse(file, {
      headers: {
        "Content-Type": "image/webp",
        "Content-Length":
          file.length.toString(),

        /*
         * Los nombres son UUID.
         * Cuando se reemplaza una foto,
         * cambia la URL, así que podemos
         * cachearla por largo tiempo.
         */
        "Cache-Control":
          "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse(
      "Imagen no encontrada",
      {
        status: 404,
      },
    );
  }
}

export async function HEAD(
  _request: Request,
  { params }: RouteContext,
) {
  const { filename } = await params;

  const filePath =
    getProductImagePath(filename);

  if (!filePath) {
    return new NextResponse(null, {
      status: 404,
    });
  }

  try {
    const fileStat =
      await stat(filePath);

    return new NextResponse(null, {
      status: 200,
      headers: {
        "Content-Type": "image/webp",
        "Content-Length":
          fileStat.size.toString(),
        "Cache-Control":
          "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse(null, {
      status: 404,
    });
  }
}
