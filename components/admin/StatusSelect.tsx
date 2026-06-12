"use client";

import { useTransition } from "react";
import { updateOrderStatus } from "@/app/actions/order";
import toast from "react-hot-toast";

export default function StatusSelect({ order }: { order: any }) {
  const [isPending, startTransition] = useTransition();

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault(); // Prevent default browser behavior
    const newStatus = e.target.value;
    
    startTransition(async () => {
      // Ensure we are passing exactly what the action expects
      const res = await updateOrderStatus(order.id, newStatus, order.email, order.reference);
      
      if (res?.success) {
        toast.success(`Order moved to ${newStatus}`);
      } else {
        toast.error(res?.message || "Update failed");
      }
    });
  };

  return (
    <select
      defaultValue={order.status}
      onChange={handleChange}
      disabled={isPending}
      className={`p-2 text-xs font-bold uppercase tracking-wider rounded-md border outline-none cursor-pointer ${
        isPending ? "opacity-50" : ""
      }`}
    >
      <option value="Pending">Pending</option>
      <option value="Processing">Processing</option>
      <option value="Shipped">Shipped</option>
    </select>
  );
}