"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart, type CartItem } from "@/lib/cart";
import { createClient } from "@/lib/supabase/client";
import { firstGbpAmount, formatGbpAmount, getGbpRates, type GbpRates } from "@/lib/currency";

const WHATSAPP_NUMBER = "237670666946";

type Option = { name: string; logo?: string; emoji?: string };

const payLogo = (file: string) => `/images/payment/${encodeURIComponent(file)}`;
const bankLogo = (file: string) => `/images/banks/${encodeURIComponent(file)}`;

const PAYMENT_METHODS: Option[] = [
  { name: "Bank Transfer", emoji: "🏦" },
  { name: "ACH", logo: payLogo("ACH.png") },
  { name: "Visa Card", logo: payLogo("Cards.png") },
  { name: "Venmo", logo: payLogo("Venmo.png") },
  { name: "Chime", logo: payLogo("Chime.png") },
  { name: "PayPal", logo: payLogo("Paypal.png") },
  { name: "Cryptocurrency", logo: payLogo("Bitcoin.png") },
  { name: "Apple Pay", logo: payLogo("ApplePay.png") },
  { name: "Google Pay", logo: payLogo("Google Pay.png") },
  { name: "Gift Card", logo: payLogo("Cards.png") },
  { name: "Cash App", logo: payLogo("Cash App.png") },
  { name: "e-Transfer", logo: payLogo("e-Transfer.png") },
  { name: "Zelle", logo: payLogo("zelle.png") },
];

const BANKS: Option[] = [
  { name: "Barclays", logo: bankLogo("Barclays.png") },
  { name: "BNP Paribas", logo: bankLogo("BNP Paribas.png") },
  { name: "Credit Agricole", logo: bankLogo("Credit Agricole.png") },
  { name: "HSBC Holdings", logo: bankLogo("HSBC Holdings.png") },
  { name: "Lloyds Bank", logo: bankLogo("Lloyds Bank.png") },
  { name: "Santander", logo: bankLogo("Santander.png") },
  { name: "Societe Generale", logo: bankLogo("Societe Generale.png") },
  { name: "UBS Group AG", logo: bankLogo("UBS Group AG.png") },
];

function OptionDropdown({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: Option[];
  value: string;
  onChange: (name: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.name === value);

  return (
    <div className="relative">
      <label className="text-sm font-medium text-neutral-700">{label}</label>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="mt-1.5 flex w-full items-center justify-between rounded-lg border border-neutral-300 px-3 py-2.5 text-left focus:border-[#1b6b80] focus:outline-none"
      >
        <span className="flex items-center gap-2">
          {selected ? (
            selected.logo ? (
              <span className="flex h-7 w-7 items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element -- local logo, next/image blocks SVGs by default */}
                <img src={selected.logo} alt="" className="max-h-full max-w-full object-contain" />
              </span>
            ) : (
              <span className="flex h-7 w-7 items-center justify-center text-lg leading-none">{selected.emoji}</span>
            )
          ) : null}
          <span className={selected ? "text-neutral-900" : "text-neutral-400"}>
            {selected?.name ?? `Select ${label.toLowerCase()}`}
          </span>
        </span>
        <span className="text-neutral-400">▾</span>
      </button>
      {open && (
        <div className="absolute z-10 mt-1 grid max-h-64 w-full grid-cols-3 gap-2 overflow-auto rounded-lg border border-neutral-200 bg-white p-2 shadow-lg">
          {options.map((option) => (
            <button
              key={option.name}
              type="button"
              onClick={() => {
                onChange(option.name);
                setOpen(false);
              }}
              className={`flex flex-col items-center gap-1.5 rounded-lg border p-2.5 text-center transition-colors ${
                value === option.name
                  ? "border-[#1b6b80] bg-[#eef7f9]"
                  : "border-neutral-200 hover:border-neutral-400"
              }`}
            >
              <span className="flex h-11 w-11 items-center justify-center">
                {option.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element -- local logo, next/image blocks SVGs by default
                  <img src={option.logo} alt="" className="max-h-full max-w-full object-contain" />
                ) : (
                  <span className="text-3xl leading-none">{option.emoji}</span>
                )}
              </span>
              <span className="text-xs font-medium text-neutral-700">{option.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const buySlug = searchParams.get("buy");
  const buySize = searchParams.get("size") ?? "";
  const { items: cartItems, removeItem, clear } = useCart();

  const [buyNowItem, setBuyNowItem] = useState<CartItem | null>(null);
  const [loading, setLoading] = useState(!!buySlug);
  const [rates, setRates] = useState<GbpRates | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [payment, setPayment] = useState("");
  const [bank, setBank] = useState("");

  useEffect(() => {
    getGbpRates().then(setRates);
  }, []);

  useEffect(() => {
    if (!buySlug) return;
    const supabase = createClient();
    supabase
      .from("products")
      .select("slug, title, price, image300")
      .eq("slug", buySlug)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setBuyNowItem({
            slug: data.slug,
            title: data.title,
            image: data.image300,
            priceGbp: firstGbpAmount(data.price),
            size: buySize,
            qty: 1,
          });
        }
        setLoading(false);
      });
  }, [buySlug, buySize]);

  const items = buySlug ? (buyNowItem ? [buyNowItem] : []) : cartItems;
  const subtotal = items.reduce((sum, i) => sum + i.priceGbp * i.qty, 0);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!payment || (payment === "Bank Transfer" && !bank)) return;
    const data = new FormData(e.currentTarget);
    const priceOf = (i: CartItem) =>
      rates ? formatGbpAmount(i.priceGbp * i.qty, rates) : `£${(i.priceGbp * i.qty).toFixed(2)}`;
    const lines = items
      .map((i) => `- ${i.title}${i.size ? ` (${i.size})` : ""} x${i.qty} — ${priceOf(i)}`)
      .join("\n");
    const message = [
      "New Order",
      `Name: ${data.get("name")}`,
      `Email: ${data.get("email")}`,
      `Address: ${data.get("address")}`,
      `Payment Method: ${payment}${payment === "Bank Transfer" ? ` (${bank})` : ""}`,
      "",
      "Items:",
      lines,
      "",
      `Total: ${rates ? formatGbpAmount(subtotal, rates) : `£${subtotal.toFixed(2)}`}`,
    ].join("\n");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
    setSubmitted(true);
    if (!buySlug) clear();
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-[#1b6b80]">Order Received</h1>
        <p className="mt-3 text-neutral-600">
          Thanks for your order. If a WhatsApp tab didn&apos;t open, message us directly to confirm payment and shipping details.
        </p>
        <Link href="/products" className="mt-6 inline-block rounded bg-[#1b6b80] px-5 py-2.5 font-semibold text-white hover:bg-[#164f5f]">
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (loading) {
    return <div className="mx-auto max-w-2xl px-4 py-16 text-center text-neutral-500">Loading…</div>;
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-[#1b6b80]">Checkout</h1>
        <p className="mt-3 text-neutral-600">There&apos;s nothing to check out yet.</p>
        <Link href="/products" className="mt-6 inline-block rounded bg-[#1b6b80] px-5 py-2.5 font-semibold text-white hover:bg-[#164f5f]">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-2xl font-bold text-[#1b6b80]">Checkout</h1>

      <div className="mt-6 divide-y divide-neutral-200 rounded-lg border border-neutral-200 bg-white">
        {items.map((item) => (
          <div key={`${item.slug}-${item.size}`} className="flex items-center gap-4 p-4">
            <Image src={item.image} alt={item.title} width={56} height={56} className="rounded border border-neutral-200 object-contain" />
            <div className="flex-1">
              <p className="font-semibold text-neutral-900">{item.title}</p>
              <p className="text-sm text-neutral-500">
                {item.size && `Size: ${item.size} · `}Qty: {item.qty}
              </p>
            </div>
            <p className="text-sm font-semibold text-neutral-700">
              {rates ? formatGbpAmount(item.priceGbp * item.qty, rates) : `£${(item.priceGbp * item.qty).toFixed(2)}`}
            </p>
            <button
              type="button"
              onClick={() => (buySlug ? router.push("/products") : removeItem(item.slug, item.size))}
              className="text-sm text-red-600 underline"
            >
              Cancel
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between rounded-lg border border-neutral-200 bg-white p-4">
        <p className="font-semibold text-neutral-900">Total</p>
        <p className="font-semibold text-[#1b6b80]">{rates ? formatGbpAmount(subtotal, rates) : `£${subtotal.toFixed(2)}`}</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-lg border border-neutral-200 bg-white p-6">
        <h2 className="font-semibold text-neutral-900">Your Details</h2>
        <div>
          <label className="text-sm font-medium text-neutral-700" htmlFor="name">Full Name</label>
          <input id="name" name="name" type="text" required className="mt-1.5 w-full rounded-lg border border-neutral-300 px-3 py-2.5 focus:border-[#1b6b80] focus:outline-none" />
        </div>
        <div>
          <label className="text-sm font-medium text-neutral-700" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required className="mt-1.5 w-full rounded-lg border border-neutral-300 px-3 py-2.5 focus:border-[#1b6b80] focus:outline-none" />
        </div>
        <div>
          <label className="text-sm font-medium text-neutral-700" htmlFor="address">Shipping Address</label>
          <textarea id="address" name="address" required rows={3} className="mt-1.5 w-full rounded-lg border border-neutral-300 px-3 py-2.5 focus:border-[#1b6b80] focus:outline-none" />
        </div>
        <OptionDropdown
          label="Payment Method"
          options={PAYMENT_METHODS}
          value={payment}
          onChange={(name) => {
            setPayment(name);
            if (name !== "Bank Transfer") setBank("");
          }}
        />
        {payment === "Bank Transfer" && (
          <OptionDropdown label="Order Banks" options={BANKS} value={bank} onChange={setBank} />
        )}
        <p className="text-xs text-neutral-500">Placing your order opens WhatsApp with your order details — hit Send to confirm with us.</p>
        <button type="submit" className="w-full rounded bg-[#6b3fd4] py-3 font-semibold text-white hover:bg-[#5c33bd]">
          Place Order
        </button>
      </form>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-2xl px-4 py-16 text-center text-neutral-500">Loading…</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
