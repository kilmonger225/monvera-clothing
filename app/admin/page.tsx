import prisma from "@/lib/prisma";
import { Package, ShoppingCart, DollarSign, ArrowRight } from "lucide-react";
import LogoutButton from "@/components/admin/LogoutButton";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminOverview() {
  // 1. Fetch total products
  const productsCount = await prisma.product.count();
  
  // 2. Fetch total orders 
  const ordersCount = await prisma.order.count();
  
  // 3. Calculate total revenue using your exact schema field: 'amount'
  const revenueResult = await prisma.order.aggregate({
    _sum: {
      amount: true, 
    },
  });
  const totalRevenue = revenueResult._sum.amount || 0;

  return (
    <div className="p-8">
      {/* Header section with your title and the new Logout button */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl font-bold text-[#1A1A1A] uppercase tracking-widest">Dashboard</h2>
          <p className="text-gray-500 mt-2 text-sm">Overview of your Monvera store performance.</p>
        </div>
        <LogoutButton />
      </div>

      {/* Dashboard Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Products Card */}
        <div className="bg-[#FAFAFA] border border-[#E5E5E5] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A]/70">Total Products</h3>
            <Package size={20} className="text-[#1A1A1A]/50" />
          </div>
          <p className="text-4xl font-bold text-[#1A1A1A]">{productsCount}</p>
        </div>

        {/* Orders Card */}
        <div className="bg-[#FAFAFA] border border-[#E5E5E5] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A]/70">Total Orders</h3>
            <ShoppingCart size={20} className="text-[#1A1A1A]/50" />
          </div>
          <p className="text-4xl font-bold text-[#1A1A1A]">{ordersCount}</p>
        </div>

        {/* Revenue Card (Inverted colors for emphasis) */}
        <div className="bg-[#1A1A1A] border border-[#1A1A1A] p-6 shadow-sm text-[#FFFFFF]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#FFFFFF]/70">Total Revenue</h3>
            <DollarSign size={20} className="text-[#FFFFFF]/50" />
          </div>
          <p className="text-4xl font-bold">₦{totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex gap-4">
        <Link 
          href="/admin/products"
          className="flex items-center gap-2 bg-[#FAFAFA] border border-[#E5E5E5] px-6 py-4 text-sm font-bold uppercase tracking-widest hover:bg-[#F5F5F5] transition-colors"
        >
          Manage Inventory <ArrowRight size={16} />
        </Link>
        <Link 
          href="/admin/orders"
          className="flex items-center gap-2 bg-[#FAFAFA] border border-[#E5E5E5] px-6 py-4 text-sm font-bold uppercase tracking-widest hover:bg-[#F5F5F5] transition-colors"
        >
          View Orders <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}