"use server";

import { createClient } from "@/lib/supabase/server";
import type { CartItem } from "@/lib/cart";

export async function placeOrder(order: {
  name: string;
  email: string;
  address: string;
  paymentMethod: string;
  currency: string;
  items: CartItem[];
  total: number;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .insert({
      name: order.name,
      email: order.email,
      address: order.address,
      payment_method: order.paymentMethod,
      currency: order.currency,
      items: order.items,
      total: order.total,
    })
    .select("order_number")
    .single();

  if (error) throw error;
  return data.order_number as number;
}
