import { createHash } from "node:crypto";

import { prisma } from "@/lib/prisma";

function hashManagementToken(token: string) {
  return createHash("sha256")
    .update(token)
    .digest("hex");
}

export async function getBusinessByManagementToken(
  token: string,
) {
  const managementTokenHash = hashManagementToken(token);

  return prisma.business.findUnique({
    where: {
      managementTokenHash,
    },
    include: {
      products: {
        include: {
          category: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
}
