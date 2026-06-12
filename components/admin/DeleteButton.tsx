"use client";

import { deleteProduct } from "@/app/actions/order";
import toast from "react-hot-toast";

export default function DeleteButton({ productId }: { productId: string }) {
  const handleDelete = async () => {
    if (!confirm("Permanently delete this product?")) return;

    const res = await deleteProduct(productId);
    if (res.success) {
      toast.success("Product deleted");
    } else {
      toast.error(res.message || "Failed to delete");
    }
  };

  return (
    <button 
      onClick={handleDelete}
      className="text-red-600 font-bold uppercase text-xs hover:underline"
    >
      Delete
    </button>
  );
}