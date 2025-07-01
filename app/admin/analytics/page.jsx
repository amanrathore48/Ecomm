import dbConnect from "@/config/db";
import Order from "@/models/Order";
import User from "@/models/User";
import Product from "@/models/Product";
import AdminSidebar from "@/components/layout/AdminSidebar";

export const metadata = {
  title: "Admin Analytics",
  description: "Overview of sales, orders, users, and products",
};

export default async function AnalyticsPage() {
  await dbConnect();

  // Gather analytics data
  const totalSalesResult = await Order.aggregate([
    { $group: { _id: null, total: { $sum: "$totalPrice" } } },
  ]);
  const totalSales = totalSalesResult[0]?.total || 0;
  const totalOrders = await Order.countDocuments();
  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments();

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 container mx-auto p-8 space-y-6">
        <h1 className="text-3xl font-bold">Admin Analytics</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-4 bg-card rounded-lg shadow">
            <h2 className="text-lg font-medium">Total Sales</h2>
            <p className="text-2xl font-bold">${totalSales.toFixed(2)}</p>
          </div>
          <div className="p-4 bg-card rounded-lg shadow">
            <h2 className="text-lg font-medium">Total Orders</h2>
            <p className="text-2xl font-bold">{totalOrders}</p>
          </div>
          <div className="p-4 bg-card rounded-lg shadow">
            <h2 className="text-lg font-medium">Total Users</h2>
            <p className="text-2xl font-bold">{totalUsers}</p>
          </div>
          <div className="p-4 bg-card rounded-lg shadow">
            <h2 className="text-lg font-medium">Products</h2>
            <p className="text-2xl font-bold">{totalProducts}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
