import { createClient } from "@/lib/supabase/server";
import StatusSelect from "@/components/admin/StatusSelect";
import DeleteOrderButton from "@/components/admin/DeleteOrderButton";

export const metadata = { title: "Orders – Admin" };

type OrderItem = { title: string; size: string; qty: number; price: number };

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1b6b80]">Orders</h1>

      <div className="mt-6 max-w-3xl divide-y divide-neutral-200 rounded-lg border border-neutral-200 bg-white">
        {(orders ?? []).map((order) => (
          <details key={order.id} className="group">
            <summary className="flex cursor-pointer flex-wrap items-center gap-4 p-4 hover:bg-neutral-50">
              <span className="rounded-full bg-[#eef7f9] px-2.5 py-1 text-sm font-semibold text-[#1b6b80]">
                ORD-{String(order.order_number).padStart(4, "0")}
              </span>
              <span className="flex-1 text-sm text-neutral-700">
                {order.name} · {order.email}
              </span>
              <span className="text-sm font-semibold text-neutral-700">
                {order.total} {order.currency}
              </span>
              <StatusSelect orderId={order.id} status={order.status} />
              <span className="text-xs text-neutral-400">{new Date(order.created_at).toLocaleString()}</span>
            </summary>
            <div className="space-y-1 border-t border-neutral-100 p-4 pt-3 text-sm text-neutral-600">
              <p>Address: {order.address}</p>
              <p>Payment: {order.payment_method}</p>
              <ul className="list-disc pl-5">
                {(order.items as OrderItem[]).map((item, idx) => (
                  <li key={idx}>
                    {item.title}
                    {item.size ? ` (${item.size})` : ""} x{item.qty} — {item.price}
                  </li>
                ))}
              </ul>
              <div className="pt-2">
                <DeleteOrderButton orderId={order.id} />
              </div>
            </div>
          </details>
        ))}
        {(orders ?? []).length === 0 && <p className="p-4 text-sm text-neutral-500">No orders yet.</p>}
      </div>
    </div>
  );
}
