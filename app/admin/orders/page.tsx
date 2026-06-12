import prisma from "@/lib/prisma";
import { ShoppingBag } from "lucide-react";
// 1. We import the interactive dropdown here
import StatusSelect from "@/components/admin/StatusSelect"; 

export const dynamic = "force-dynamic"; 

export default async function AdminOrders() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <ShoppingBag size={24} className="text-[#1A1A1A]" />
        <h2 className="text-2xl font-bold text-[#1A1A1A]">Orders Management</h2>
      </div>
      
      <div className="bg-[#FFFFFF] border border-[#E5E5E5] shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F5F5F5] border-b border-[#E5E5E5] text-sm tracking-widest uppercase text-[#1A1A1A]/70">
              <th className="p-4 font-bold">Order Ref</th>
              <th className="p-4 font-bold">Customer Email</th>
              <th className="p-4 font-bold">Amount</th>
              <th className="p-4 font-bold">Delivery</th>
              <th className="p-4 font-bold">Status</th>
              <th className="p-4 font-bold">Date</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-[#1A1A1A]/50">No orders found.</td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="border-b border-[#E5E5E5] hover:bg-[#F9F9F9] transition-colors">
                  <td className="p-4 font-medium">{order.reference}</td>
                  <td className="p-4">{order.email}</td>
                  <td className="p-4 font-bold">₦{order.amount.toLocaleString()}</td>
                  <td className="p-4 capitalize">{order.shippingMethod.replace('_', ' ')}</td>
                  
                  {/* 2. THE STATIC SPAN WAS REPLACED RIGHT HERE */}
                  <td className="p-4">
                    <StatusSelect order={order} />
                  </td>

                  <td className="p-4 text-[#1A1A1A]/70">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}