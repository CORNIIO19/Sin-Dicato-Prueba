
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
    imagePath: product.imagePath,

    categoryId: product.category.id,
    categoryName: product.category.name,
    categorySlug: product.category.slug,

    trackStock: product.trackStock,
    stockQuantity: product.stockQuantity,
    isAvailable: product.isAvailable,
  }));
}

export async function getPublicBusinessById(
  businessId: string,
) {
  const business = await prisma.business.findFirst({
    where: {
      id: businessId,
      moderationStatus: "APPROVED",
    },
    include: {
      products: {
        where: {
          moderationStatus: "APPROVED",
        },
        include: {
          category: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!business) {
    return null;
  }

  return {
    id: business.id,
    name: business.name,
    description: business.description,
    whatsapp: business.whatsapp,
    isOpen: business.isOpen,

    products: business.products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: Number(product.price),
      imagePath: product.imagePath,

      trackStock: product.trackStock,
      stockQuantity: product.stockQuantity,
      isAvailable: product.isAvailable,

      category: {
        id: product.category.id,
        name: product.category.name,
        slug: product.category.slug,
      },
    })),
  };
}

export async function getPublicProductById(
  productId: string,
) {
  const product = await prisma.product.findFirst({
    where: {
      id: productId,
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
          description: true,
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
  });

  if (!product) {
    return null;
  }

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: Number(product.price),
    imagePath: product.imagePath,

    trackStock: product.trackStock,
    stockQuantity: product.stockQuantity,
    isAvailable: product.isAvailable,

    business: product.business,
    category: product.category,
  };
}
