import dbConnect from "@/config/db";
import Order from "@/models/Order";
import User from "@/models/User";
import Product from "@/models/Product";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CreditCard,
  Package,
  ShoppingBag,
  Users,
} from "lucide-react";

export const metadata = {
  title: "Admin Dashboard | Analytics",
  description: "Comprehensive overview of sales, orders, users, and products",
};

export default async function AnalyticsPage() {
  await dbConnect();

  // Get current date for calculations
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  // Date 30 days ago for monthly comparisons
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Date 60 days ago for previous period comparison
  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  // Gather analytics data with more detailed metrics
  // Current period sales (last 30 days)
  const currentPeriodSalesResult = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: thirtyDaysAgo },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$totalPrice" },
        count: { $sum: 1 },
      },
    },
  ]);

  // Previous period sales (30-60 days ago) for comparison
  const prevPeriodSalesResult = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: sixtyDaysAgo,
          $lt: thirtyDaysAgo,
        },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$totalPrice" },
        count: { $sum: 1 },
      },
    },
  ]);

  // This month's sales
  const thisMonthSalesResult = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startOfMonth,
          $lte: endOfMonth,
        },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$totalPrice" },
      },
    },
  ]);

  // Basic metrics
  const totalSalesResult = await Order.aggregate([
    { $group: { _id: null, total: { $sum: "$totalPrice" } } },
  ]);

  const totalSales = totalSalesResult[0]?.total || 0;
  const totalOrders = await Order.countDocuments();
  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments();

  // Recently registered users (last 30 days)
  const newUsers = await User.countDocuments({
    createdAt: { $gte: thirtyDaysAgo },
  });

  // Calculate growth percentages
  const currentPeriodSales = currentPeriodSalesResult[0]?.total || 0;
  const prevPeriodSales = prevPeriodSalesResult[0]?.total || 0;
  const salesGrowth =
    prevPeriodSales > 0
      ? (
          ((currentPeriodSales - prevPeriodSales) / prevPeriodSales) *
          100
        ).toFixed(1)
      : 100;

  const currentPeriodOrders = currentPeriodSalesResult[0]?.count || 0;
  const prevPeriodOrders = prevPeriodSalesResult[0]?.count || 0;
  const ordersGrowth =
    prevPeriodOrders > 0
      ? (
          ((currentPeriodOrders - prevPeriodOrders) / prevPeriodOrders) *
          100
        ).toFixed(1)
      : 100;

  // Recent orders with status breakdown
  const pendingOrders = await Order.countDocuments({ status: "pending" });
  const processingOrders = await Order.countDocuments({ status: "processing" });
  const shippedOrders = await Order.countDocuments({ status: "shipped" });
  const deliveredOrders = await Order.countDocuments({ status: "delivered" });

  // Low stock products
  const lowStockCount = await Product.countDocuments({
    stock: { $lt: 10, $gt: 0 },
  });
  const outOfStockCount = await Product.countDocuments({ stock: { $lte: 0 } });

  // This month's sales
  const thisMonthSales = thisMonthSalesResult[0]?.total || 0;

  return (
    <>
      <div className="container mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome to your analytics dashboard
            </p>
          </div>
          <div>
            <span className="px-4 py-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 rounded-full font-medium text-sm">
              {today.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Key metrics with visual indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold mt-1">
                  $
                  {totalSales.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center text-sm">
              <span
                className={`font-medium ${
                  Number(salesGrowth) >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {salesGrowth}%
              </span>
              {Number(salesGrowth) >= 0 ? (
                <ArrowUpIcon className="w-4 h-4 ml-1 text-green-600" />
              ) : (
                <ArrowDownIcon className="w-4 h-4 ml-1 text-red-600" />
              )}
              <span className="ml-2 text-gray-600 dark:text-gray-400">
                vs last period
              </span>
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Orders
                </p>
                <p className="text-2xl font-bold mt-1">
                  {totalOrders.toLocaleString()}
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center text-sm">
              <span
                className={`font-medium ${
                  Number(ordersGrowth) >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {ordersGrowth}%
              </span>
              {Number(ordersGrowth) >= 0 ? (
                <ArrowUpIcon className="w-4 h-4 ml-1 text-green-600" />
              ) : (
                <ArrowDownIcon className="w-4 h-4 ml-1 text-red-600" />
              )}
              <span className="ml-2 text-gray-600 dark:text-gray-400">
                vs last period
              </span>
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Users
                </p>
                <p className="text-2xl font-bold mt-1">
                  {totalUsers.toLocaleString()}
                </p>
              </div>
              <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-amber-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center text-sm">
              <span className="text-green-600 font-medium">+{newUsers}</span>
              <span className="ml-2 text-gray-600 dark:text-gray-400">
                new this month
              </span>
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Products
                </p>
                <p className="text-2xl font-bold mt-1">
                  {totalProducts.toLocaleString()}
                </p>
              </div>
              <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <Package className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center text-sm">
              <span className="text-amber-600 font-medium">
                {lowStockCount}
              </span>
              <span className="ml-2 text-gray-600 dark:text-gray-400">
                low stock
              </span>
              <span className="mx-1 text-gray-400">•</span>
              <span className="text-red-600 font-medium">
                {outOfStockCount}
              </span>
              <span className="ml-2 text-gray-600 dark:text-gray-400">
                out of stock
              </span>
            </div>
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Orders Status
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Pending
                </p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {pendingOrders}
                </p>
              </div>
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Processing
                </p>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {processingOrders}
                </p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Shipped
                </p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {shippedOrders}
                </p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Delivered
                </p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {deliveredOrders}
                </p>
              </div>
            </div>
          </div>

          {/* Monthly Performance */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Monthly Performance
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Monthly Revenue
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    $
                    {thisMonthSales.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${Math.min(
                        (thisMonthSales / (totalSales / 12)) * 100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Monthly Orders
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {currentPeriodOrders} orders
                  </p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{
                      width: `${Math.min(
                        (currentPeriodOrders / (totalOrders / 12)) * 100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
