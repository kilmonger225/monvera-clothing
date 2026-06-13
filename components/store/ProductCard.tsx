"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, X } from "lucide-react";
import { useCart } from "./CartContext";

interface ProductProps {
  id: string;
  name: string;
  price: number;
  imageFront: string;
  imageBack: string;
  stock: number; // Added stock
}

export default function ProductCard({ id, name, price, imageFront, imageBack, stock }: ProductProps) {
  const [showSizes, setShowSizes] = useState(false);
  const { addToCart } = useCart();
  const sizes = ["S", "M", "L", "XL", "XXL"];
  
  const isOutOfStock = stock === 0;

  const handleQuickAddClick = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();
    if (!isOutOfStock) setShowSizes(true);
  };

  const handleSizeSelect = (e: React.MouseEvent, size: string) => {
    e.preventDefault();
    e.stopPropagation();
    setShowSizes(false);
    
    addToCart({
      productId: id,
      name,
      price,
      image: imageFront,
      size,
      quantity: 1,
    });
  };

  return (
    <div className="group flex flex-col">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F5F5F5] mb-4 cursor-pointer">
        
        <Link href={`/product/${id}`} className="absolute inset-0 z-0">
          <img
            src={imageBack}
            alt={`${name} Back`}
            className="absolute inset-0 object-cover w-full h-full transition-opacity duration-700 ease-in-out opacity-100 group-hover:opacity-0"
          />
          <img
            src={imageFront}
            alt={`${name} Front`}
            className="absolute inset-0 object-cover w-full h-full transition-opacity duration-700 ease-in-out opacity-0 group-hover:opacity-100 group-hover:scale-105 transform"
          />
        </Link>
        
        {/* Dynamic Overlay */}
        {showSizes ? (
          <div className="absolute inset-x-0 bottom-0 p-4 bg-[#FFFFFF]/95 backdrop-blur-sm transform transition-all duration-300 z-20 flex flex-col border-t border-[#E5E5E5]">
            <div className="flex justify-between items-center mb-3 px-1">
              <span className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A]">Select Size</span>
              <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowSizes(false); }} className="text-[#1A1A1A] hover:text-[#000000]">
                <X size={14} />
              </button>
            </div>
            <div className="flex justify-between gap-1">
              {sizes.map(size => (
                <button 
                  key={size}
                  onClick={(e) => handleSizeSelect(e, size)}
                  className="flex-1 py-2 text-xs font-bold bg-[#F5F5F5] text-[#1A1A1A] hover:bg-[#000000] hover:text-[#FFFFFF] transition-colors"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* REMOVED: opacity-0, translate-y-4, group-hover:opacity-100, group-hover:translate-y-0 */
          <div className="absolute inset-x-0 bottom-0 p-4 flex gap-2 z-10">
            <Link 
              href={`/product/${id}`} 
              className="flex-1 bg-[#FFFFFF] text-[#1A1A1A] border border-[#E5E5E5] text-xs font-bold py-3 flex items-center justify-center uppercase tracking-wider hover:bg-[#1A1A1A] hover:text-[#FFFFFF] transition-colors"
            >
              View Details
            </Link>
            <button 
              onClick={handleQuickAddClick} 
              disabled={isOutOfStock}
              className={`p-3 border border-[#E5E5E5] flex items-center justify-center transition-colors ${isOutOfStock ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-[#FFFFFF] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#FFFFFF]"}`}
            >
              <ShoppingBag size={16} />
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col space-y-1">
        <Link href={`/product/${id}`} className="text-sm font-bold text-[#1A1A1A] hover:underline underline-offset-4">
          {name}
        </Link>
        <span className="text-sm font-medium text-[#1A1A1A]/80">
          {isOutOfStock ? "SOLD OUT" : `₦${price.toFixed(2)}`}
        </span>
      </div>
    </div>
  );
}