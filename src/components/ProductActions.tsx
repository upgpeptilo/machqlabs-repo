"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import type { Product } from "@/lib/products";
import { firstGbpAmount } from "@/lib/currency";

export default function ProductActions({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem } = useCart();
  const [size, setSize] = useState(product.sizes[0] ?? "");
  const priceGbp = firstGbpAmount(product.price);

  function cartItem() {
    return { slug: product.slug, title: product.title, image: product.image300, priceGbp, size };
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
      {product.sizes.length > 0 && (
        <div className="mt-6">
          <p className="text-sm font-semibold uppercase text-neutral-500">Size</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                className={`rounded border px-3 py-1 text-sm ${
                  s === size
                    ? "border-[#1b6b80] bg-[#eef7f9] text-[#1b6b80]"
                    : "border-neutral-300 text-neutral-700 hover:border-neutral-400"
                }`}
              >
                {s}
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
