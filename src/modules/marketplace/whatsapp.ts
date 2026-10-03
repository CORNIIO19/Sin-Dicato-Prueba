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

type WhatsAppManagementLinkParams = {
  whatsapp: string;
  businessName: string;
  managementUrl: string;
};

export function createWhatsAppManagementLink({
  whatsapp,
  businessName,
  managementUrl,
}: WhatsAppManagementLinkParams) {
  const message = [
    "🔐 *Tu acceso a Sin Dicato*",
    "",
    `¡Hola! Aquí tienes la liga privada para administrar tu negocio *${businessName}*:`,
    "",
    managementUrl,
    "",
    "⚠️ *Guarda este mensaje:*",
    "Esta liga es tu llave para:",
    "• Agregar o editar productos",
    "• Actualizar precios y stock",
    "• Pausar o activar productos",
    "• Abrir o cerrar tu negocio",
  ].join("\n");

  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
}

