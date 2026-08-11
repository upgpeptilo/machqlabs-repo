"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import Header from "./Header";
import Footer from "./Footer";
import FloatingActions from "./FloatingActions";
import { CartProvider } from "@/lib/cart";
import { CurrencyProvider } from "@/lib/currency-context";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) return <main className="flex-1">{children}</main>;

  return (
    <CurrencyProvider>
      <CartProvider>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingActions />
        <Script
          id="jivo-chat"
          src="//code.jivosite.com/widget/rSxak4sIkA"
          strategy="afterInteractive"
        />
      </CartProvider>
    </CurrencyProvider>
  );
}
