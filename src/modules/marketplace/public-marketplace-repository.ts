import { prisma } from "@/lib/prisma";

export async function getPublicBusinesses() {
  return prisma.business.findMany({
    where: {
      moderationStatus: "APPROVED",
    },
    orderBy: [
      {
        isOpen: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
    select: {
      id: true,
      name: true,
      description: true,
      whatsapp: true,
      isOpen: true,
    },
  });
}

export async function getPublicProducts() {
  const products = await prisma.product.findMany({
    where: {
      moderationStatus: "APPROVED",
      business: {
        moderationStatus: "APPROVED",
      },
    },
    include: {
      business: {
        select: {
          id: true,
          name: true,
          whatsapp: true,
          isOpen: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return products.map((product) => ({
    id: product.id,
    businessId: product.businessId,
    businessName: product.business.name,

    name: product.name,
    description: product.description,
    price: Number(product.price),

    categoryId: product.category.id,
    categoryName: product.category.name,
    categorySlug: product.category.slug,

    trackStock: product.trackStock,
    stockQuantity: product.stockQuantity,
    isAvailable: product.isAvailable,
  }));
}
