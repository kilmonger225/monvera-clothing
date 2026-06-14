"use client";

import { useCart } from "@/components/store/CartContext";
import { X, Trash2 } from "lucide-react";
import Image from "next/image";

export default function CartDrawer() {
  const { isOpen, closeCart, cartItems, removeFromCart } = useCart();

  // Calculate total price
  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className={`fixed inset-0 z-[100] transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeCart} />
      
      <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl transition-transform duration-300 transform ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex flex-col h-full p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-sm font-bold uppercase tracking-widest">Cart ({cartItems.length})</h2>
            <button onClick={closeCart} className="hover:text-gray-500"><X size={20} /></button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-6">
            {cartItems.length === 0 ? (
              <p className="text-sm text-gray-500">Your cart is empty.</p>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-20 h-20 bg-gray-100 relative">
                    {/* Assuming item.image is available */}
                    {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold">{item.name}</h3>
                    <p className="text-xs text-gray-500">Size: {item.size}</p>
                    <p className="text-sm font-bold mt-1">₦{item.price.toLocaleString()}</p>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-black">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="pt-6 border-t border-gray-100">
              <div className="flex justify-between mb-4">
                <span className="text-sm font-bold uppercase">Total</span>
                <span className="text-sm font-bold">₦{total.toLocaleString()}</span>
              </div>
              <button 
                className="w-full bg-[#1A1A1A] text-white py-4 font-bold uppercase tracking-widest text-xs hover:bg-black transition"
                onClick={() => { /* Add your Paystack redirect logic here */ }}
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}