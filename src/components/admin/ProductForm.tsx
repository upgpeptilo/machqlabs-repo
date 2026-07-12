"use client";

import { useState } from "react";
import ImageUploader from "./ImageUploader";
import type { Product, ProductSpec, ProductVariant } from "@/lib/products";
import { formatUsdAmount, type UsdRates } from "@/lib/currency";

const KNOWN_SPECS = ["CAS Number", "Molecular Formula", "Molecular Weight", "Purity", "Peptide Sequence"];

function findSpec(specs: ProductSpec[] | undefined, label: string) {
  return specs?.find((s) => s.label.toLowerCase() === label.toLowerCase())?.value ?? "";
}

export default function ProductForm({
  product,
  action,
  submitLabel,
  cancelHref = "/admin",
  rates,
}: {
  product?: Product;
  action: (formData: FormData) => void;
  submitLabel: string;
  cancelHref?: string;
  rates: UsdRates;
}) {
  const [extraSpecs, setExtraSpecs] = useState<ProductSpec[]>(
    () => product?.specs.filter((s) => !KNOWN_SPECS.includes(s.label)) ?? []
  );
  const [variants, setVariants] = useState<ProductVariant[]>(
    () => product?.variants ?? [{ size: "", price: 0 }]
  );

  function updateVariant(index: number, field: keyof ProductVariant, value: string) {
    setVariants((prev) =>
      prev.map((v, i) =>
        i === index ? { ...v, [field]: field === "price" ? Number(value) || 0 : value } : v
      )
    );
  }

  return (
    <div className="rounded-xl border border-neutral-200 bg-white shadow-sm">
      <div className="flex items-start gap-3 border-b border-neutral-200 p-6">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#eef7f9] text-[#1b6b80]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
            <path d="M21 8 12 3 3 8l9 5 9-5Z" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 8v8l9 5 9-5V8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 13v8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <div>
          <h2 className="font-semibold text-neutral-900">{product ? "Edit Product" : "Add Product"}</h2>
          <p className="text-sm text-neutral-500">
            {product ? "Update the details for this product" : "Add a new product to the storefront"}
          </p>
        </div>
      </div>

      <form action={action} className="space-y-6 p-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-neutral-700" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              defaultValue={product?.title}
              className="mt-1.5 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 focus:border-[#1b6b80] focus:outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-700" htmlFor="form">
              Form
            </label>
            <input
              id="form"
              name="form"
              type="text"
              defaultValue={product?.form ?? "Lyophilized Powder"}
              className="mt-1.5 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 focus:border-[#1b6b80] focus:outline-none"
            />
          </div>
        </div>

        <div className="border-t border-neutral-200 pt-6">
          <h3 className="font-semibold text-neutral-900">Sizes &amp; Pricing</h3>
          <p className="mt-1 text-xs text-neutral-500">Sold as a pack of 10 vials. Set a price for each size.</p>

          <div className="mt-4 space-y-3">
            {variants.map((variant, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-1/3">
                  <input
                    name="variantSize"
                    type="text"
                    required
                    placeholder="10MG"
                    value={variant.size}
                    onChange={(e) => updateVariant(index, "size", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-900 focus:border-[#1b6b80] focus:outline-none"
                  />
                </div>
                <div className="flex-1">
                  <input
                    name="variantPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    placeholder="59.99"
                    value={variant.price || ""}
                    onChange={(e) => updateVariant(index, "price", e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-900 focus:border-[#1b6b80] focus:outline-none"
                  />
                  {variant.price > 0 && (
                    <p className="mt-1 text-xs text-neutral-500">{formatUsdAmount(variant.price, rates)}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setVariants(variants.filter((_, i) => i !== index))}
                  className="px-2 py-2.5 text-neutral-400 hover:text-red-600"
                  aria-label="Remove size"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setVariants([...variants, { size: "", price: 0 }])}
            className="mt-4 text-sm font-medium text-[#1b6b80] hover:underline"
          >
            + Add another size
          </button>
        </div>

        <label className="flex items-center gap-2 text-sm font-medium text-neutral-700">
          <input type="checkbox" name="bestSeller" defaultChecked={product?.bestSeller} />
          Best Seller
        </label>

        <div className="border-t border-neutral-200 pt-6">
          <h3 className="font-semibold text-neutral-900">Specifications</h3>

          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-neutral-700" htmlFor="specCas">
                CAS Number
              </label>
              <input
                id="specCas"
                name="specCas"
                type="text"
                defaultValue={findSpec(product?.specs, "CAS Number")}
                className="mt-1.5 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 focus:border-[#1b6b80] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-700" htmlFor="specFormula">
                Molecular Formula
              </label>
              <input
                id="specFormula"
                name="specFormula"
                type="text"
                defaultValue={findSpec(product?.specs, "Molecular Formula")}
                className="mt-1.5 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 focus:border-[#1b6b80] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-700" htmlFor="specWeight">
                Molecular Weight
              </label>
              <input
                id="specWeight"
                name="specWeight"
                type="text"
                defaultValue={findSpec(product?.specs, "Molecular Weight")}
                className="mt-1.5 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 focus:border-[#1b6b80] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-700" htmlFor="specPurity">
                Purity
              </label>
              <input
                id="specPurity"
                name="specPurity"
                type="text"
                defaultValue={findSpec(product?.specs, "Purity")}
                className="mt-1.5 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 focus:border-[#1b6b80] focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-neutral-700" htmlFor="specSequence">
                Peptide Sequence
              </label>
              <input
                id="specSequence"
                name="specSequence"
                type="text"
                defaultValue={findSpec(product?.specs, "Peptide Sequence")}
                className="mt-1.5 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 focus:border-[#1b6b80] focus:outline-none"
              />
            </div>
          </div>

          {extraSpecs.length > 0 && (
            <div className="mt-4 space-y-3">
              {extraSpecs.map((spec, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    name="extraSpecLabel"
                    type="text"
                    placeholder="Label (e.g. BPC-157)"
                    defaultValue={spec.label}
                    className="w-1/3 rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-900 focus:border-[#1b6b80] focus:outline-none"
                  />
                  <input
                    name="extraSpecValue"
                    type="text"
                    placeholder="Value"
                    defaultValue={spec.value}
                    className="flex-1 rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-900 focus:border-[#1b6b80] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setExtraSpecs(extraSpecs.filter((_, i) => i !== index))}
                    className="px-2 text-neutral-400 hover:text-red-600"
                    aria-label="Remove spec"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => setExtraSpecs([...extraSpecs, { label: "", value: "" }])}
            className="mt-4 text-sm font-medium text-[#1b6b80] hover:underline"
          >
            + Add another spec
          </button>
        </div>

        <div className="border-t border-neutral-200 pt-6">
          <label className="text-sm font-medium text-neutral-700">Product Image</label>
          <p className="text-sm text-neutral-500">Drag and drop an image, or browse to upload</p>
          <div className="mt-3">
            <ImageUploader initialUrl={product?.image600} />
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-neutral-200 pt-6">
          <a
            href={cancelHref}
            className="rounded-lg border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          >
            Cancel
          </a>
          <div className="flex gap-3">
            <button
              type="reset"
              className="rounded-lg border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              Reset
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#1b6b80] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#164f5f]"
            >
              {submitLabel}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
