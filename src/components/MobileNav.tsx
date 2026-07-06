"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "All Products" },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        type="button"
        aria-label="Toggle menu"
        onClick={() => setOpen((v) => !v)}
        className="flex flex-col gap-1.5 p-1"
      >
        <span className="h-0.5 w-6 -rotate-3 rounded bg-[#ff6f61]" />
        <span className="h-0.5 w-6 rounded bg-[#ff6f61]" />
        <span className="h-0.5 w-6 rotate-3 rounded bg-[#ff6f61]" />
      </button>

      {open && (
        <nav className="absolute left-0 top-full flex w-full flex-col border-t border-neutral-200 bg-[#eef1fb] px-4 py-3 text-sm font-medium uppercase tracking-wide text-neutral-800 shadow-md">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="py-2 hover:text-[#1b6b80]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
