import type { Business, Product } from "./types";

export type ProductAvailability =
  | "available"
  | "sold_out"
  | "unavailable"
  | "business_closed";

export function getProductAvailability(
  product: Product,
  business: Business | undefined,
): ProductAvailability {
  if (!business || !business.isOpen) {
    return "business_closed";
  }

  if (!product.isAvailable) {
    return "unavailable";
  }

  if (product.trackStock && (product.stockQuantity ?? 0) <= 0) {
    return "sold_out";
  }

  return "available";
}
