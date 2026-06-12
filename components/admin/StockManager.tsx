"use client";

import { useState } from "react";
import { updateProductStock } from "@/app/actions/product"; 

export default function StockManager({ productId, currentStock }: { productId: string, currentStock: number }) {
  const [stock, setStock] = useState(currentStock);

  const adjustStock = async (amount: number) => {
    const newStock = Math.max(0, stock + amount);
    setStock(newStock);
    await updateProductStock(productId, newStock);
  };

  return (
    <div className="flex items-center gap-2">
      <button onClick={() => adjustStock(-1)} className="px-2 py-1 bg-gray-200">-</button>
      <span className="font-bold w-8 text-center">{stock}</span>
      <button onClick={() => adjustStock(1)} className="px-2 py-1 bg-gray-200">+</button>
    </div>
  );
}