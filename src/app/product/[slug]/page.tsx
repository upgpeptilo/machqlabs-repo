import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, storageText, disclaimerText } from "@/lib/products";
import { getUsdRates } from "@/lib/currency";
import ProductActions from "@/components/ProductActions";
import Reviews from "@/components/Reviews";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();
  const rates = await getUsdRates();

  return (
    <div>
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-12 sm:grid-cols-2">
          <Image
            src={product.image600}
            alt={product.title}
            width={600}
            height={600}
            className="w-full rounded-lg border border-neutral-200 bg-white object-contain"
          />
          <div>
            <h1 className="text-3xl font-bold text-[#1b6b80]">{product.title}</h1>

            <ProductActions product={product} rates={rates} />

            <div className="mt-10 space-y-2 border-t border-neutral-200 pt-6">
              {product.specs.map((spec) => (
                <p key={spec.label} className="text-sm">
                  <span className="font-semibold text-neutral-900">{spec.label}: </span>
                  <span className="text-neutral-600">{spec.value}</span>
                </p>
              ))}
            </div>

            <div className="mt-8 border-t border-neutral-200 pt-6">
              <h2 className="text-sm font-semibold text-neutral-900">Storage &amp; Handling</h2>
              <p className="mt-2 text-sm text-neutral-600">{storageText}</p>
            </div>

            <p className="mt-6 text-xs text-neutral-500">
              ⚠️ {disclaimerText}{" "}
              <Link href="/termsconditions" className="text-[#1b6b80] underline">
                Terms &amp; Conditions
              </Link>
              .
            </p>
          </div>
        </div>
      </div>

      <Reviews limit={3} title="What Customers Say" />
    </div>
  );
}
