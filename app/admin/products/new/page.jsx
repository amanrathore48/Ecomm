import ProductForm from "../_components/product-form";

export const metadata = {
  title: "Add New Product",
  description: "Create a new product in your store",
};

export default function AddProductPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ProductForm />
    </div>
  );
}
