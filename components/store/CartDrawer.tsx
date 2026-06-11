"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "./CartContext";
import Link from "next/link";

export default function CartDrawer() {
  const { isOpen, closeCart, cartItems, removeFromCart, updateQuantity, cartCount } = useCart();

  // Calculate actual subtotal
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-[#000000]/40 backdrop-blur-sm z-[60]"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4, ease: "easeInOut" }}
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-[#FFFFFF] z-[70] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#E5E5E5]">
              <h2 className="text-lg font-bold tracking-widest uppercase text-[#1A1A1A]">Your Bag ({cartCount})</h2>
              <button onClick={closeCart} className="text-[#1A1A1A] hover:text-[#000000] transition-colors">
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            {/* Cart Items Loop */}
            <div className="flex-1 overflow-y-auto p-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-[#1A1A1A]/50 space-y-4">
                  <ShoppingBag size={48} strokeWidth={1} />
                  <p className="text-sm font-medium">Your bag is currently empty.</p>
                </div>
              ) : (
                <div className="flex flex-col space-y-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-24 h-32 bg-[#F5F5F5] flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-sm font-bold text-[#1A1A1A]">{item.name}</h3>
                            <p className="text-xs font-medium text-[#1A1A1A]/80 mt-1">Size: {item.size}</p>
                          </div>
                          <p className="text-sm font-bold text-[#1A1A1A]">₦{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                        
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center border border-[#E5E5E5] px-2 py-1">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 text-[#1A1A1A] hover:text-[#000000]">
                              <Minus size={14} />
                            </button>
                            <span className="text-xs font-bold px-3 text-[#1A1A1A]">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 text-[#1A1A1A] hover:text-[#000000]">
                              <Plus size={14} />
                            </button>
                          </div>
                          <button onClick={() => removeFromCart(item.id)} className="text-xs text-[#1A1A1A]/80 underline hover:text-[#000000] font-medium">
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-[#E5E5E5] bg-[#F5F5F5]">
                <div className="flex justify-between items-center mb-4 text-sm">
                  <span className="font-bold text-[#1A1A1A]">Subtotal</span>
                  <span className="font-bold text-[#1A1A1A]">₦{subtotal.toFixed(2)}</span>
                </div>
                <p className="text-xs font-medium text-[#1A1A1A]/70 mb-6">Shipping & taxes calculated at checkout.</p>
                <Link href="/checkout" onClick={closeCart} className="block w-full bg-[#000000] text-[#FFFFFF] text-center py-4 text-sm font-bold uppercase tracking-widest hover:bg-[#1A1A1A] transition-colors">
                  Secure Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}