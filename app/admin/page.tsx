// app/admin/page.tsx
import { DollarSign, ShoppingBag, Package, Users } from "lucide-react";
import prisma from "@/lib/prisma"; 

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
    
  // 1. Fetch real data from your database concurrently
  const [totalOrders, totalProducts, revenueQuery] = await Promise.all([
    prisma.order.count(),
    prisma.product.count(),
    prisma.order.aggregate({ _sum: { amount: true } }) // Fetching the actual revenue!
  ]);

  // Safely extract the revenue (if there are no orders yet, it defaults to 0)
  const totalRevenue = revenueQuery._sum.amount || 0;

  // 2. Inject the dynamic data into your stats array

  const stats = [
  { 
    title: "Total Revenue", 
    value: `₦${totalRevenue.toLocaleString()}`, 
    icon: DollarSign 
  }, 
  { 
    title: "Active Orders", 
    value: totalOrders.toString(), 
    icon: ShoppingBag 
  },
  { 
    title: "Products Listed", 
    value: totalProducts.toString(), 
    icon: Package 
  },
];
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-[#1A1A1A] mb-8">Dashboard Overview</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-[#FFFFFF] p-6 border border-[#E5E5E5] shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-[#1A1A1A]/70 uppercase tracking-widest">{stat.title}</h3>
                <Icon size={20} className="text-[#1A1A1A]" />
              </div>
              <p className="text-3xl font-bold text-[#1A1A1A]">{stat.value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}