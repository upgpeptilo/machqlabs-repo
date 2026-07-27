"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function OrderSoundListener() {
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("orders-inserts")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload) => {
          new Audio("/sounds/new-order.wav").play().catch(() => {});
          if (Notification.permission === "granted") {
            new Notification("New Order", {
              body: `Order #${payload.new.order_number} from ${payload.new.name}`,
              icon: "/images/logo.png",
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return null;
}
