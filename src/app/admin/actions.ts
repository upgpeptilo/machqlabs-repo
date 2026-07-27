"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const FIXED_SPEC_FIELDS: [string, string][] = [
  ["specCas", "CAS Number"],
  ["specFormula", "Molecular Formula"],
  ["specWeight", "Molecular Weight"],
  ["specPurity", "Purity"],
  ["specSequence", "Peptide Sequence"],
];

function buildSpecs(formData: FormData) {
  const specs = FIXED_SPEC_FIELDS.map(([field, label]) => ({
    label,
    value: String(formData.get(field) ?? "").trim(),
  })).filter((s) => s.value);

  const extraLabels = formData.getAll("extraSpecLabel").map(String);
  const extraValues = formData.getAll("extraSpecValue").map(String);
  extraLabels.forEach((rawLabel, i) => {
    const label = rawLabel.trim();
    const value = (extraValues[i] ?? "").trim();
    if (label && value) specs.push({ label, value });
  });

  return specs;
}

function buildVariants(formData: FormData) {
  const sizes = formData.getAll("variantSize").map(String);
  const prices = formData.getAll("variantPrice").map(String);
  return sizes
    .map((rawSize, i) => ({ size: rawSize.trim(), price: parseFloat(prices[i] ?? "") }))
    .filter((v) => v.size && Number.isFinite(v.price) && v.price > 0);
}

function readProductFields(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const variants = buildVariants(formData);
  const form = String(formData.get("form") ?? "Lyophilized Powder").trim();
  const bestSeller = formData.get("bestSeller") === "on";
  const specs = buildSpecs(formData);
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();

  return { title, variants, form, bestSeller, specs, imageUrl };
}

export async function createProduct(formData: FormData) {
  const { title, variants, form, bestSeller, specs, imageUrl } = readProductFields(formData);
  const supabase = await createClient();

  const { error } = await supabase.from("products").insert({
    slug: slugify(title),
    title,
    variants,
    form,
    best_seller: bestSeller,
    specs,
    image300: imageUrl,
    image600: imageUrl,
  });

  if (error) throw error;

  revalidatePath("/admin");
  revalidatePath("/products");
  revalidatePath("/");
  redirect("/admin");
}

export async function updateProduct(id: string, formData: FormData) {
  const { title, variants, form, bestSeller, specs, imageUrl } = readProductFields(formData);
  const supabase = await createClient();

  const update: Record<string, unknown> = {
    title,
    variants,
    form,
    best_seller: bestSeller,
    specs,
  };
  if (imageUrl) {
    update.image300 = imageUrl;
    update.image600 = imageUrl;
  }

  const { error } = await supabase.from("products").update(update).eq("id", id);
  if (error) throw error;

  revalidatePath("/admin");
  revalidatePath("/products");
  revalidatePath("/");
  redirect("/admin");
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;

  revalidatePath("/admin");
  revalidatePath("/products");
  revalidatePath("/");
}

export async function updateOrderStatus(id: string, status: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("orders").update({ status }).eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/orders");
}

export async function deleteOrder(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("orders").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/orders");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
