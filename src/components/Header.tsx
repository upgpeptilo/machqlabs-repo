import Image from "next/image";
import Link from "next/link";
import MobileNav from "./MobileNav";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "All Products" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-[#eef1fb]">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-3">
        <MobileNav />

        <Link href="/" className="shrink-0 sm:mr-2">
          <Image src="/images/logo.png" alt="MachQ Labs" width={150} height={28} priority />
        </Link>

        <nav className="hidden gap-8 text-sm font-medium uppercase tracking-wide text-neutral-700 sm:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-[#1b6b80]">
              {link.label}
            </Link>
          ))}
        </nav>

        <form action="/products" className="hidden flex-1 max-w-md sm:flex">
          <input
            type="text"
            name="q"
            placeholder="Search"
            className="w-full rounded-l border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none"
          />
          <button
            type="submit"
            aria-label="Search"
            className="flex items-center justify-center rounded-r border border-l-0 border-neutral-300 bg-white px-3 hover:bg-neutral-100"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
          </button>
        </form>

        <div className="flex items-center gap-4 text-neutral-800">
          <Link href="/basket" aria-label="Basket">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-6 w-6">
              <path d="M6 6h15l-1.5 9h-12z" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M6 6 5 3H2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="9" cy="20" r="1.4" />
              <circle cx="18" cy="20" r="1.4" />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}
