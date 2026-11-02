"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import FloatingActions from "./FloatingActions";
import { CartProvider } from "@/lib/cart";

export default function SiteChrome({
  children,
  whatsappNumber,
}: {
  children: React.ReactNode;
  whatsappNumber?: string;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) return <main className="flex-1">{children}</main>;

  return (
    <CartProvider>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingActions whatsappNumber={whatsappNumber} />
    </CartProvider>
  );
}
