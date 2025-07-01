import ProductForm from "../_components/product-form";
import AdminSidebar from "@/components/layout/AdminSidebar";

export const metadata = {
  title: "Add New Product",
  description: "Create a new product in your store",
};

export default function AddProductPage() {
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 container mx-auto px-4 py-8">
        <ProductForm />
      </div>
    </div>
  );
}
