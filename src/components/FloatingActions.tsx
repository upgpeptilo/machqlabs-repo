"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";

export default function FloatingActions() {
  const { items } = useCart();
  const count = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-center gap-3">
      <Link
        href="/basket"
        aria-label="View basket"
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#6b3fd4] text-white shadow-lg hover:bg-[#5c33bd]"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6">
          <path d="M6 6h15l-1.5 9h-12z" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 6 5 3H2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="9" cy="20" r="1.5" />
          <circle cx="18" cy="20" r="1.5" />
        </svg>
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-[#6b3fd4]">
          {count}
        </span>
      </Link>
      <button
        type="button"
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1b6b80] text-white shadow-lg hover:bg-[#164f5f]"
      >
        ↑
      </button>
    </div>
  );
}
