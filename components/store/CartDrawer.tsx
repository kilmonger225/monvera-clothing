"use client";

import { useCart } from "@/components/store/CartContext";
import { X, Trash2, Plus, Minus } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function CartDrawer() {
  // Destructuring exact values from your existing CartContext
  const { isOpen, closeCart, cartItems, removeFromCart, updateQuantity } = useCart();

  const handleRemove = (id: string) => {
    removeFromCart(id);
    toast.success("Item removed from cart");
  };

  const formatNaira = (amount: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Background Overlay */}
      <div className="fixed inset-0 bg-[#000000]/50 z-40 transition-opacity" onClick={closeCart} />
      
      {/* Drawer Panel */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-[#FFFFFF] z-50 shadow-2xl flex flex-col transform transition-transform duration-300">
        <div className="flex items-center justify-between p-6 border-b border-[#E5E5E5]">
          <h2 className="text-xl font-bold uppercase tracking-widest text-[#1A1A1A]">Your Bag</h2>
          <button onClick={closeCart} className="text-[#1A1A1A] hover:text-[#1A1A1A]/70 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cartItems.length === 0 ? (
            <p className="text-center text-[#1A1A1A]/70 mt-10">Your cart is currently empty.</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 border-b border-[#E5E5E5] pb-6 last:border-0">
                <img src={item.image} alt={item.name} className="w-20 h-24 object-cover border border-[#E5E5E5]" />
                
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-[#1A1A1A]">{item.name}</h3>
                    <p className="text-xs text-[#1A1A1A]/70 mt-1">Size: {item.size}</p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    {/* QUANTITY CONTROLS */}
                    <div className="flex items-center border border-[#E5E5E5]">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="p-2 hover:bg-[#F5F5F5] disabled:opacity-50 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-[#F5F5F5] transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <p className="text-sm font-bold">{formatNaira(item.price * item.quantity)}</p>
                      <button 
                        onClick={() => handleRemove(item.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-6 border-t border-[#E5E5E5] bg-[#F5F5F5]">
            <Link 
              href="/checkout" 
              onClick={closeCart}
              className="w-full flex items-center justify-center py-4 bg-[#000000] text-[#FFFFFF] text-sm font-bold uppercase tracking-widest hover:bg-[#1A1A1A] transition-colors"
            >
              Go To Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}