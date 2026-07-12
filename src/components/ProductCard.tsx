import Image from "next/image";
import Link from "next/link";
import { priceRange, type Product } from "@/lib/products";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white transition hover:shadow-md"
    >
      <Image
        src={product.image300}
        alt={product.title}
        width={300}
        height={300}
        className="aspect-square w-full object-contain p-4"
      />
      <div className="flex flex-1 flex-col gap-1 px-4 pb-4 text-center">
        <h3 className="font-semibold text-[#1b6b80] group-hover:underline">{product.title}</h3>
        <p className="text-sm text-neutral-600">{priceRange(product.variants)}</p>
      </div>
    </Link>
  );
}
