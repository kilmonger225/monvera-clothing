"use client";
import toast from "react-hot-toast";
import React, { useState } from 'react';
import { useCart } from "@/components/store/CartContext";

export default function ProductDetailClient({ product }: { product: any }) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const sizes = ["S", "M", "L", "XL", "XXL"];

  const handleAddToCart = () => {
    // 1. Replaced the alert with a sleek toast error
    if (!selectedSize) {
      toast.error("Please select a size first!");
      return;
    }
    
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.imageFront,
      size: selectedSize,
      quantity: 1,
    });

    // 2. Replaced the success alert with a styled toast notification!
    toast.success(`${product.name} added to your bag! 🛍️`, {
      position: 'top-center',
      duration: 3000,
      style: {
        background: '#1A1A1A',
        color: '#fff',
        borderRadius: '4px', // Matches your Monvera aesthetic
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-6 uppercase">{product.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <img src={product.imageFront} alt="Front" className="w-full rounded-lg" />
        <img src={product.imageBack} alt="Back" className="w-full rounded-lg" />
      </div>

      <div className="mt-8">
        <p className="mb-2 font-bold uppercase text-sm">Select Size</p>
        <div className="flex gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`px-6 py-3 border ${
                selectedSize === size 
                  ? 'bg-black text-white border-black' 
                  : 'bg-white text-black border-[#E5E5E5] hover:border-black'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <button 
        onClick={handleAddToCart}
        className="mt-8 bg-[#1A1A1A] text-white px-10 py-4 font-bold uppercase tracking-widest hover:bg-black transition w-full md:w-auto"
      >
        Add to Cart - ₦{product.price.toLocaleString()}
      </button>
    </div>
  );
}