import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/products";

export const metadata = { title: "Products – MachQ Labs" };

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim().toLowerCase();
  const products = await getProducts();
  const filtered = query ? products.filter((p) => p.title.toLowerCase().includes(query)) : products;

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-3xl font-bold text-[#1b6b80]">Products</h1>
      <p className="mt-2 text-sm text-neutral-500">For research purposes only</p>
      {query && (
        <p className="mt-4 text-sm text-neutral-600">
          {filtered.length} result{filtered.length === 1 ? "" : "s"} for &ldquo;{q}&rdquo;
        </p>
      )}
      <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
        {filtered.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </div>
  );
}
