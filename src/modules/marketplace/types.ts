export type ModerationStatus = "pending" | "approved" | "rejected";
export type Category = {
  id: string;
  name: string;
  slug: string;
};
export type Business = {
  id: string;
  name: string;
  description: string;
  whatsapp: string;
  isOpen: boolean;
  moderationStatus: ModerationStatus;
};

export type Product = {
  id: string;
  businessId: string;
  categoryId: string;

  name: string;
  description: string;
  price: number;

  trackStock: boolean;
  stockQuantity: number | null;

  isAvailable: boolean;
  moderationStatus: ModerationStatus;
};
