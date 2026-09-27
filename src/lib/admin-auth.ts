import {
  createHmac,
  timingSafeEqual,
} from "node:crypto";

import { cookies } from "next/headers";

const COOKIE_NAME = "sin_dicato_admin";

function getSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!secret) {
    throw new Error(
      "ADMIN_SESSION_SECRET no está definido",
    );
  }

  return secret;
}

function createAdminToken() {
  return createHmac(
    "sha256",
    getSessionSecret(),
  )
    .update("sin-dicato-admin")
    .digest("hex");
}

export async function createAdminSession() {
  const cookieStore = await cookies();

  cookieStore.set(
    COOKIE_NAME,
    createAdminToken(),
    {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8,
    },
  );
}

export async function deleteAdminSession() {
  const cookieStore = await cookies();

  cookieStore.delete(COOKIE_NAME);
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();

  const receivedToken =
    cookieStore.get(COOKIE_NAME)?.value;

  if (!receivedToken) {
    return false;
  }

  const expectedToken = createAdminToken();

  const receivedBuffer = Buffer.from(receivedToken);
  const expectedBuffer = Buffer.from(expectedToken);

  if (
    receivedBuffer.length !== expectedBuffer.length
  ) {
    return false;
  }

  return timingSafeEqual(
    receivedBuffer,
    expectedBuffer,
  );
}
