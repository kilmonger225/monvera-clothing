'use client';

import React, { useState } from 'react';
import { products } from "@/lib/data";
import { useCart } from "@/components/store/CartContext";

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  
  const product = products.find((p) => String(p.id) === String(id));
  const sizes = ["S", "M", "L", "XL", "XXL"];

  if (!product) return <div className="p-10 text-center">Product not found!</div>;

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size first!");
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
    alert(`Added ${product.name} (${selectedSize}) to cart!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-6">{product.name}</h1>
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
        Add to Cart
      </button>
    </div>
  );
}