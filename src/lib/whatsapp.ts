// Pure helpers for building wa.me links. No server-only imports here — this file is
// safe to use from both client and server components.

/** wa.me wants digits only (with the country code), no +, spaces, dashes or parens. */
export function normalizeWhatsappNumber(raw: string): string {
  return raw.replace(/[^\d]/g, "");
}

export function buildWhatsappLink(number: string, message?: string): string {
  const digits = normalizeWhatsappNumber(number || "");
  if (!digits) return "";
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export type WhatsappOrderItem = {
  title: string;
  size?: string;
  qty: number;
  price: number;
};

/** Builds the prefilled message sent to the store's WhatsApp when a customer confirms an order. */
export function buildOrderWhatsappMessage(order: {
  orderNumber: number | string;
  name: string;
  items: WhatsappOrderItem[];
  total: number;
  currency: string;
}): string {
  const lines = [
    `Hi! I just placed order ORD-${String(order.orderNumber).padStart(4, "0")} on MachQ Labs.`,
    `Name: ${order.name}`,
    "",
    "Items:",
    ...order.items.map(
      (item) => `- ${item.title}${item.size ? ` (${item.size})` : ""} x${item.qty} — ${item.price}`
    ),
    "",
    `Total: ${order.total} ${order.currency}`,
  ];
  return lines.join("\n");
}
