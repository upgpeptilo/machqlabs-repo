"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import type { CartItem } from "@/lib/cart";

export async function placeOrder(order: {
  name: string;
  email: string;
  phone?: string;
  address: string;
  paymentMethod: string;
  items: CartItem[];
  total: number;
  source?: string;
  referrer?: string;
  landing?: string;
}) {
  const supabase = createAdminClient();
  const base = {
    name: order.name,
    email: order.email,
    phone: order.phone ?? "",
    address: order.address,
    payment_method: order.paymentMethod,
    currency: "USD", // ponytail: column is NOT NULL and never shown; prices are stored in this base
    items: order.items,
    total: order.total,
  };
  const tracking = {
    source: (order.source || "Direct").slice(0, 100),
    referrer: (order.referrer ?? "").slice(0, 500),
    landing: (order.landing ?? "").slice(0, 500),
  };

  let { data, error } = await supabase
    .from("orders")
    .insert({ ...base, ...tracking })
    .select("order_number")
    .single();

  // if supabase/order_source.sql hasn't been run yet, still take the order
  if (error && (error.code === "PGRST204" || error.code === "42703")) {
    ({ data, error } = await supabase.from("orders").insert(base).select("order_number").single());
  }

  if (error || !data) throw error;
  return data.order_number as number;
}
