"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { buildWhatsappLink } from "@/lib/whatsapp";

export default function FloatingActions({ whatsappNumber }: { whatsappNumber?: string }) {
  const { items } = useCart();
  const count = items.reduce((sum, i) => sum + i.qty, 0);
  const whatsappHref = whatsappNumber
    ? buildWhatsappLink(whatsappNumber, "Hi! I have a question about MachQ Labs products.")
    : "";

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-center gap-3">
      {whatsappHref && (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:bg-[#1ebe5b]"
        >
          <svg viewBox="0 0 32 32" fill="currentColor" className="h-7 w-7">
            <path d="M16.004 3C9.376 3 4 8.373 4 15c0 2.34.652 4.523 1.785 6.393L4 29l7.828-1.75A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm0 21.7a9.67 9.67 0 0 1-4.937-1.354l-.354-.21-4.646 1.04 1.06-4.53-.23-.37A9.65 9.65 0 0 1 5.3 15c0-5.9 4.8-10.7 10.704-10.7 5.9 0 10.696 4.8 10.696 10.7 0 5.9-4.796 10.7-10.696 10.7Zm5.87-8.02c-.32-.16-1.9-.94-2.194-1.047-.294-.107-.508-.16-.722.16-.214.32-.828 1.047-1.016 1.262-.187.214-.374.24-.694.08-.32-.16-1.35-.498-2.572-1.588-.95-.848-1.592-1.895-1.78-2.215-.187-.32-.02-.492.14-.652.144-.144.32-.374.48-.56.16-.187.213-.32.32-.534.107-.214.053-.4-.027-.56-.08-.16-.722-1.74-.99-2.383-.26-.626-.526-.54-.722-.55-.187-.008-.4-.01-.614-.01-.214 0-.56.08-.854.4-.294.32-1.12 1.094-1.12 2.668 0 1.574 1.147 3.094 1.307 3.308.16.214 2.256 3.445 5.467 4.83.764.33 1.36.527 1.825.674.767.244 1.465.21 2.017.127.615-.092 1.9-.777 2.168-1.527.267-.75.267-1.393.187-1.527-.08-.133-.294-.213-.614-.373Z" />
          </svg>
        </a>
      )}
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
