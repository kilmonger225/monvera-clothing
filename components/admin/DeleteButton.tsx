"use client";

import { deleteProduct } from "@/app/actions/order"; // Verify this path!
import toast from "react-hot-toast";
import { useTransition } from "react";

export default function DeleteButton({ productId }: { productId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm("Permanently delete this product?")) return;

    startTransition(async () => {
      const res = await deleteProduct(productId);
      if (res?.success) {
        toast.success("Product deleted");
      } else {
        toast.error(res?.message || "Failed to delete product");
      }
    });
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isPending}
      className="text-red-600 font-bold uppercase text-xs hover:underline disabled:opacity-50"
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}