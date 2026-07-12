import ProductForm from "@/components/admin/ProductForm";
import { getUsdRates } from "@/lib/currency";
import { createProduct } from "../../../actions";

export const metadata = { title: "Add Product – Admin" };

export default async function NewProductPage() {
  const rates = await getUsdRates();
  return (
    <div className="max-w-2xl">
      <ProductForm action={createProduct} submitLabel="Create Product" cancelHref="/admin/products" rates={rates} />
    </div>
  );
}
