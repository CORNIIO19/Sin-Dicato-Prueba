import { prisma } from "@/lib/prisma";

export async function getProductForBusiness(
  productId: string,
  businessId: string,
) {
  return prisma.product.findFirst({
    where: {
      id: productId,
      businessId,
    },
    include: {
      category: true,
    },
  });
}
