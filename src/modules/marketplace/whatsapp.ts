type WhatsAppProductLinkParams = {
  whatsapp: string;
  productName: string;
  businessName: string;
  price: number;
};

export function createWhatsAppProductLink({
  whatsapp,
  productName,
  businessName,
  price,
}: WhatsAppProductLinkParams) {
  const message = [
    "Hola 👋",
    "",
    `Vi "${productName}" en Sin Dicato y me interesa.`,
    `Negocio: ${businessName}`,
    `Precio: $${price}`,
    "",
    "¿Todavía lo tienes disponible?",
  ].join("\n");

  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
}
