"use client";

import Link from "next/link";
import { Search, User, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/store/CartContext";

export default function Header() {
const { openCart, cartCount } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#F5F5F5] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Left: Logo */}
        <div className="flex-1">
          <Link href="/" className="text-xl font-bold tracking-widest text-[#1A1A1A]">
            MONVERA.
          </Link>
        </div>

        {/* Center: Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
  <Link href="/#shop" className="text-sm font-bold uppercase tracking-widest hover:text-[#000000] text-[#1A1A1A]/70 transition-colors">
    Shop
  </Link>
  <Link href="/about" className="text-sm font-bold uppercase tracking-widest hover:text-[#000000] text-[#1A1A1A]/70 transition-colors">
    About
  </Link>
  <Link href="/contact" className="text-sm font-bold uppercase tracking-widest hover:text-[#000000] text-[#1A1A1A]/70 transition-colors">
    Contact
  </Link>
</nav>

        {/* Right: Icons */}
        <div className="flex-1 flex justify-end items-center space-x-6">
          <button aria-label="Search" className="text-[#1A1A1A] hover:text-[#000000] transition-colors">
            <Search size={20} strokeWidth={1.5} />
          </button>
          <Link href="/account" aria-label="Account" className="text-[#1A1A1A] hover:text-[#000000] transition-colors hidden sm:block">
            <User size={20} strokeWidth={1.5} />
          </Link>
          <button onClick={openCart} aria-label="Cart" className="text-[#1A1A1A] hover:text-[#000000] transition-colors relative">
            <ShoppingBag size={20} strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-[#000000] text-[8px] text-[#FFFFFF]">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}