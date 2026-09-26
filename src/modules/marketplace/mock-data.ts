import type { Business, Product } from "./types";

export const businesses: Business[] = [
  {
    id: "business-1",
    name: "Dulce Campus",
    description: "Postres y brownies hechos en casa.",
    whatsapp: "5215555555555",
    isOpen: true,
    moderationStatus: "approved",
  },
  {
    id: "business-2",
    name: "Campus Café",
    description: "Café, bebidas frías y snacks.",
    whatsapp: "5215555555555",
    isOpen: true,
    moderationStatus: "approved",
  },
  {
    id: "business-3",
    name: "Diseño Estudiantil",
    description: "Diseño gráfico para tareas y proyectos.",
    whatsapp: "5215555555555",
    isOpen: false,
    moderationStatus: "approved",
  },
];

export const products: Product[] = [
  {
    id: "product-1",
    businessId: "business-1",
    categoryId: "food",
    name: "Brownie clásico",
    description: "Brownie artesanal de chocolate.",
    price: 45,
    trackStock: true,
    stockQuantity: 7,
    isAvailable: true,
    moderationStatus: "approved",
  },
  {
    id: "product-2",
    businessId: "business-2",
    categoryId: "drinks",
    name: "Cold Brew",
    description: "Café frío preparado al momento.",
    price: 55,
    trackStock: true,
    stockQuantity: 4,
    isAvailable: true,
    moderationStatus: "approved",
  },
  {
    id: "product-3",
    businessId: "business-1",
    categoryId: "food",
    name: "Galleta de chocolate",
    description: "Galleta casera con chispas de chocolate.",
    price: 30,
    trackStock: true,
    stockQuantity: 0,
    isAvailable: true,
    moderationStatus: "approved",
  },
];
