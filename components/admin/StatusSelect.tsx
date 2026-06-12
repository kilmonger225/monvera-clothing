"use client";

import { useTransition } from "react";
import { updateOrderStatus } from "@/app/actions/order";import toast from "react-hot-toast";

export default function StatusSelect({ order }: { order: any }) {
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    
    startTransition(async () => {
      // Calls the server action we just perfected
      const res = await updateOrderStatus(order.id, newStatus, order.email, order.reference);
      
      if (res?.success) {
        toast.success(`Order moved to ${newStatus}`);
      } else {
        toast.error("Failed to update order");
      }
    });
  };

  return (
    <select
      defaultValue={order.status}
      onChange={handleChange}
      disabled={isPending}
      className={`p-2 text-xs font-bold uppercase tracking-wider rounded-md border outline-none cursor-pointer transition-all ${
        isPending ? "opacity-50 cursor-not-allowed" : "hover:bg-[#F5F5F5]"
      } ${
        order.status === "Pending" ? "border-yellow-200 bg-yellow-50 text-yellow-800" :
        order.status === "Processing" ? "border-blue-200 bg-blue-50 text-blue-800" :
        order.status === "Shipped" ? "border-purple-200 bg-purple-50 text-purple-800" :
        "border-green-200 bg-green-50 text-green-800"
      }`}
    >
      <option value="Pending">Pending</option>
      <option value="Processing">Processing</option>
      <option value="Shipped">Shipped</option>
    </select>
  );
}