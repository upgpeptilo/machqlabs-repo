"use client";

import { updateOrderStatus } from "@/app/admin/actions";

const STATUSES = ["pending", "processing", "paid", "fulfilled"];

export default function StatusSelect({ orderId, status }: { orderId: string; status: string }) {
  return (
    <select
      defaultValue={status}
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => updateOrderStatus(orderId, e.target.value)}
      className="rounded border border-neutral-300 px-2 py-1 text-sm"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
