import { createClient } from "@/lib/supabase/server";

export type ProductSpec = {
  label: string;
  value: string;
};

export type ProductVariant = {
  size: string;
  price: number;
};

export type Product = {
  id: string;
  slug: string;
  title: string;
  variants: ProductVariant[];
  form: string;
  image300: string;
  image600: string;
  bestSeller: boolean;
  specs: ProductSpec[];
};

export function priceRange(variants: ProductVariant[]) {
  const prices = variants.map((v) => v.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max ? `$${min.toFixed(2)}` : `$${min.toFixed(2)} – $${max.toFixed(2)}`;
}

export const storageText =
  "Storage (Lyophilized): Store at -20°C in a dry, desiccated environment. – After Reconstitution: Store reconstituted peptide at 2–8°C and use within 30 days. For long-term storage, aliquot and freeze at -20°C. Avoid repeated freeze-thaw cycles. – Reconstitution: Reconstitute in sterile bacteriostatic water or appropriate buffer depending on experimental needs.";

export const disclaimerText =
  "This product is sold strictly for in vitro research and laboratory use only. It is not for human or veterinary use. By purchasing or using this product, the buyer agrees they have read, understood and accept the Terms & Conditions of MachQlabs.";

type ProductRow = {
  id: string;
  slug: string;
  title: string;
  variants: ProductVariant[];
  form: string;
  image300: string;
  image600: string;
  best_seller: boolean;
  specs: ProductSpec[];
};

function mapRow(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    variants: row.variants,
    form: row.form,
    image300: row.image300,
    image600: row.image600,
    bestSeller: row.best_seller,
    specs: row.specs,
  };
}

export async function getProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data as ProductRow[]).map(mapRow);
}

export async function getProduct(slug: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").select("*").eq("slug", slug).maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return mapRow(data as ProductRow);
}

export async function getBestSellers(): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((p) => p.bestSeller);
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").select("*").eq("id", id).maybeSingle();

  if (error) throw error;
  return data ? mapRow(data as ProductRow) : null;
}
