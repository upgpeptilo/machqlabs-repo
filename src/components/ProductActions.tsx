"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import type { Product } from "@/lib/products";
import { formatUsdAmount, type UsdRates } from "@/lib/currency";

export default function ProductActions({ product, rates }: { product: Product; rates: UsdRates }) {
  const router = useRouter();
  const { addItem } = useCart();
  const [variant, setVariant] = useState(product.variants[0]);
  const size = variant?.size ?? "";
  const price = variant?.price ?? 0;

  function cartItem() {
    return { slug: product.slug, title: product.title, image: product.image300, price, size };
  }

  function handleAddToBasket() {
    addItem(cartItem(), 1);
    router.push("/basket");
  }

  function handleCheckoutNow() {
    router.push(`/checkout?buy=${encodeURIComponent(product.slug)}&size=${encodeURIComponent(size)}`);
  }

  return (
    <>
      <p className="mt-2 text-xl text-neutral-700">{formatUsdAmount(price, rates)}</p>
      <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#eef7f9] px-3 py-1 text-xs font-semibold text-[#1b6b80]">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3.5 w-3.5">
          <path d="M9 2h6v4l1 2v12a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V8l1-2V2Z" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 14h8" strokeLinecap="round" />
        </svg>
        Pack of 10 vials
      </span>

      {product.variants.length > 0 && (
        <div className="mt-6">
          <p className="text-sm font-semibold uppercase text-neutral-500">Size</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.variants.map((v) => (
              <button
                key={v.size}
                type="button"
                onClick={() => setVariant(v)}
                className={`rounded border px-3 py-1 text-sm ${
                  v.size === size
                    ? "border-[#1b6b80] bg-[#eef7f9] text-[#1b6b80]"
                    : "border-neutral-300 text-neutral-700 hover:border-neutral-400"
                }`}
              >
                {v.size}
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="mt-4 text-sm text-neutral-500">Form: {product.form}</p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleAddToBasket}
          className="flex-1 rounded bg-[#1b6b80] py-3 font-semibold text-white hover:bg-[#164f5f]"
        >
          Add to Basket
        </button>
        <button
          type="button"
          onClick={handleCheckoutNow}
          className="flex-1 rounded border-2 border-[#6b3fd4] py-3 font-semibold text-[#6b3fd4] hover:bg-[#f4effc]"
        >
          Proceed to Checkout
        </button>
      </div>
    </>
  );
}
