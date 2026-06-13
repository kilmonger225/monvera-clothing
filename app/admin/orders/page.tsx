import prisma from "@/lib/prisma";
import { ShoppingBag, Printer } from "lucide-react"; // 1. Added Printer icon
import StatusSelect from "@/components/admin/StatusSelect"; 
import Link from "next/link"; // 1. Added Link for navigation

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
              {/* 2. NEW: Empty header for the print button column */}
              <th className="p-4 font-bold text-right"></th> 
            </tr>
          </thead>
          <tbody className="text-sm">
            {orders.length === 0 ? (
              <tr>
                {/* Updated colSpan from 6 to 7 to account for the new column */}
                <td colSpan={7} className="p-8 text-center text-[#1A1A1A]/50">No orders found.</td>
              </tr>
            ) : (
                  orders.map((order: any) => (                <tr key={order.id} className="border-b border-[#E5E5E5] hover:bg-[#F9F9F9] transition-colors">
                  <td className="p-4 font-medium">{order.reference}</td>
                  <td className="p-4">{order.email}</td>
                  <td className="p-4 font-bold">₦{order.amount.toLocaleString()}</td>
                  <td className="p-4 capitalize">{order.shippingMethod.replace('_', ' ')}</td>
                  
                  <td className="p-4">
                    <StatusSelect order={order} />
                  </td>

                  <td className="p-4 text-[#1A1A1A]/70">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>

                  {/* 3. NEW: The Print Button Cell */}
                  <td className="p-4 text-right">
                    <Link
                      href={`/admin/orders/${order.id}/print`}
                      target="_blank"
                      className="inline-flex items-center justify-center p-2 text-[#1A1A1A] hover:bg-[#E5E5E5] border border-transparent hover:border-[#1A1A1A]/20 transition-all rounded"
                      title="Print Packing Slip"
                    >
                      <Printer size={18} />
                    </Link>
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