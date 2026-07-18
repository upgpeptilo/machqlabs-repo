import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import FaqAccordion from "@/components/FaqAccordion";
import Reviews from "@/components/Reviews";
import { getBestSellers } from "@/lib/products";

const valueProps = [
  {
    title: "Research-Focused Quality",
    body: "Peptides produced with consistency and precision to support laboratory research.",
  },
  {
    title: "Reliable Customer Care",
    body: "Clear communication and dependable support throughout the ordering process.",
  },
  {
    title: "Secure US Fulfilment",
    body: "Carefully packaged orders shipped promptly within the US.",
  },
];

const faqs = [
  {
    q: "What happens when I order?",
    a: "You will receive an email to confirm receipt of payment, please check your junk folder as they sometimes end up in there. Our dispatch team will then promptly process your order, this is normally in 1-2 business days. You will receive an email confirmation and tracking information once shipped.",
  },
  {
    q: "My bottle doesn't look the same as the website?",
    a: "Packaging may differ between batches. The contents of each bottle are verified through independent third-party testing to ensure quality standards are met.",
  },
  {
    q: "Do you ship outside of the US?",
    a: "We currently only ship within the United States. Apologies for any inconvenience.",
  },
  {
    q: "Do you provide Certificate of Analysis (CoA)'s with your products?",
    a: "Yes, Certificates of Analysis (COAs) are available for all of our products. They can be requested by contacting our support team at support@machqlabs.com. We do not display these on individual product pages to protect our proprietary materials and reduce the risk of unauthorised replication.",
  },
];

export default async function Home() {
  const bestSellers = await getBestSellers();

  return (
    <div>
      <section className="bg-[#123c4a] px-4 py-24 text-center text-white">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#7fd4e8]">
          For Research Purposes Only
        </p>
        <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
          A trusted supplier of premium peptides for scientific research and development
        </h1>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/products"
            className="rounded bg-[#1b6b80] px-6 py-3 font-semibold text-white hover:bg-[#164f5f]"
          >
            Shop Now
          </Link>
          <Link
            href="/products"
            className="rounded border border-white/40 px-6 py-3 font-semibold hover:border-white"
          >
            Popular Peptides
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-[#1b6b80]">Best Sellers</h2>
        <p className="mt-1 text-sm text-neutral-500">For research purposes only</p>
        <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {bestSellers.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <section>
        <Image
          src="/images/banner.png"
          alt="MachQ Labs — Research compounds for in vitro applications"
          width={1024}
          height={1024}
          className="mx-auto w-full max-w-3xl"
        />
      </section>

      <section className="border-y border-neutral-100 bg-white px-4 py-16">
        <div className="mx-auto grid max-w-6xl gap-8 text-center sm:grid-cols-3">
          {valueProps.map((item) => (
            <div key={item.title}>
              <h3 className="font-semibold text-[#1b6b80]">{item.title}</h3>
              <p className="mt-2 text-sm text-neutral-600">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <Reviews limit={6} />

      <section className="bg-[#1b6b80] px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-white">FAQs</h2>
          <div className="mt-8">
            <FaqAccordion faqs={faqs} />
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-12 text-center">
        <Image
          src="/images/third-party-testing.webp"
          alt="Third Party Testing"
          width={300}
          height={78}
          className="mx-auto"
        />
        <p className="mt-2 text-sm text-neutral-500">Third Party Testing</p>
      </section>
    </div>
  );
}
