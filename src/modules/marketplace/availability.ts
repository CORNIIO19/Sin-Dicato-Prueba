export type ProductAvailability =
  | "available"
  | "sold_out"
  | "unavailable"
  | "business_closed";

type AvailabilityBusiness = {
  isOpen: boolean;
};

type AvailabilityProduct = {
  isAvailable: boolean;
  trackStock: boolean;
  stockQuantity: number | null;
};

export function getProductAvailability(
  product: AvailabilityProduct,
  business: AvailabilityBusiness | undefined,
): ProductAvailability {
  if (!business || !business.isOpen) {
    return "business_closed";
  }

  if (!product.isAvailable) {
    return "unavailable";
  }

  if (
    product.trackStock &&
    (product.stockQuantity ?? 0) <= 0
  ) {
    return "sold_out";
  }

  return "available";
}
