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
    title: "Secure Worldwide Fulfilment",
    body: "UK-based service with carefully packaged orders and worldwide shipping.",
  },
];

const faqs = [
  {
    q: "What happens when I order?",
    a: "Complete checkout and send the prepared order email to our team. We will confirm availability, payment arrangements and delivery details for your destination. Your order request does not confirm payment or dispatch. Please check your inbox and junk folder for our reply.",
  },
  {
    q: "My bottle doesn't look the same as the website?",
    a: "Packaging may differ between batches. The contents of each bottle are verified through independent third-party testing to ensure quality standards are met.",
  },
  {
    q: "Where is MachQ Labs based?",
    a: "MachQ Labs is based in the United Kingdom and serves research customers in the UK and worldwide.",
  },
  {
    q: "Do you ship worldwide from your UK-based business?",
    a: "Yes. We offer UK and worldwide shipping. Availability for a particular destination depends on the product, courier service and applicable import requirements. Contact our team before ordering if you need confirmation for your country.",
  },
  {
    q: "How long will delivery take?",
    a: "Delivery times depend on your destination, the selected service and customs clearance. Our team will confirm the estimated delivery time and any shipping charges before your order is finalised. International deliveries may take longer than UK deliveries.",
  },
  {
    q: "Will international orders have customs charges?",
    a: "International orders may be subject to customs duties, local taxes or import restrictions in the destination country. Check the requirements that apply to your order and contact our team for available shipping information before payment.",
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
          UK-based supplier of peptides for scientific research and development
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-white/85">
          Based in the United Kingdom. Shipping to research customers across the UK and worldwide.
        </p>
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
