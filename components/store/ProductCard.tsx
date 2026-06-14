"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, X } from "lucide-react";
import { useCart } from "./CartContext";
import toast from "react-hot-toast";

interface ProductProps {
  id: string;
  name: string;
  price: number;
  imageFront: string;
  imageBack: string;
  stock: number;
}

export default function ProductCard({ id, name, price, imageFront, imageBack, stock }: ProductProps) {
  const [showSizes, setShowSizes] = useState(false);
  const { addToCart, cartItems } = useCart(); 
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
    
    const currentCartQuantity = cartItems
      .filter((item) => item.productId === id)
      .reduce((sum, item) => sum + item.quantity, 0);

    if (currentCartQuantity >= stock) {
      toast.error(`Only ${stock} available in stock!`, {
        style: { background: '#ef4444', color: '#fff' }
      });
      setShowSizes(false); 
      return; 
    }

    setShowSizes(false);
    
    addToCart({
      productId: id,
      name,
      price,
      image: imageFront,
      size,
      quantity: 1,
      maxStock: stock, 
    });

    toast.success(`${name} added to your bag! 🛍️`, {
      position: 'top-center',
      duration: 3000,
      style: {
        background: '#1A1A1A',
        color: '#fff',
        borderRadius: '8px',
      }
    });
  };

  return (
    <div className="group flex flex-col">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F5F5F5] mb-4 cursor-pointer rounded-lg">
        
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
          <div className="absolute inset-x-0 bottom-0 p-2 md:p-4 bg-[#FFFFFF]/95 backdrop-blur-sm transform transition-all duration-300 z-20 flex flex-col border-t border-[#E5E5E5]">
            <div className="flex justify-between items-center mb-2 md:mb-3 px-1">
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#1A1A1A]">Select Size</span>
              <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowSizes(false); }} className="text-[#1A1A1A] hover:text-[#000000]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex justify-between gap-1">
              {sizes.map(size => (
                <button 
                  key={size}
                  onClick={(e) => handleSizeSelect(e, size)}
                  className="flex-1 py-1.5 md:py-2 text-[10px] md:text-xs font-bold bg-[#F5F5F5] rounded-md text-[#1A1A1A] hover:bg-[#000000] hover:text-[#FFFFFF] transition-colors"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="absolute inset-x-0 bottom-0 p-2 md:p-4 flex gap-1.5 md:gap-2 z-10">
            <Link 
              href={`/product/${id}`} 
              className="flex-1 bg-[#FFFFFF] text-[#1A1A1A] border border-[#E5E5E5] text-[9px] md:text-xs font-bold py-1.5 md:py-3 rounded-lg flex items-center justify-center uppercase tracking-wider hover:bg-[#1A1A1A] hover:text-[#FFFFFF] transition-colors"
            >
              View Details
            </Link>
            <button 
              onClick={handleQuickAddClick} 
              disabled={isOutOfStock}
              className={`p-1.5 md:p-3 rounded-lg border border-[#E5E5E5] flex items-center justify-center transition-colors ${isOutOfStock ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-[#FFFFFF] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#FFFFFF]"}`}
            >
              <ShoppingBag className="w-3.5 h-3.5 md:w-5 md:h-5" />
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col space-y-1">
        <Link href={`/product/${id}`} className="text-sm font-bold text-[#1A1A1A] hover:underline underline-offset-4">
          {name}
        </Link>
        <span className="text-sm font-medium text-[#1A1A1A]/80">
          {isOutOfStock ? "SOLD OUT" : `₦${price.toLocaleString()}`}
        </span>
      </div>
    </div>
  );
}