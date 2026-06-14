"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, User, ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/components/store/CartContext";

export default function Header() {
  const { openCart, cartCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#F5F5F5] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Left: Mobile Menu Toggle & Logo */}
        <div className="flex-1 flex items-center gap-4">
          <button 
            className="md:hidden text-[#1A1A1A] hover:text-[#000000] transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
          </button>
          
          <Link href="/" className="text-xl font-bold tracking-widest text-[#1A1A1A]" onClick={closeMobileMenu}>
            MONVERA.
          </Link>
        </div>

        {/* Center: Desktop Navigation */}
        <nav className="hidden md:flex items-center justify-center gap-8 flex-1">
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
        <div className="flex-1 flex justify-end items-center space-x-5">
          <button aria-label="Search" className="text-[#1A1A1A] hover:text-[#000000] transition-colors hidden sm:block">
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

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-[80px] left-0 w-full bg-[#FFFFFF] border-b border-[#F5F5F5] shadow-xl flex flex-col px-6 py-8 gap-6 z-50 transition-all">
          <Link href="/#shop" onClick={closeMobileMenu} className="text-base font-bold uppercase tracking-widest text-[#1A1A1A] hover:text-[#000000]">
            Shop
          </Link>
          <Link href="/about" onClick={closeMobileMenu} className="text-base font-bold uppercase tracking-widest text-[#1A1A1A] hover:text-[#000000]">
            About
          </Link>
          <Link href="/contact" onClick={closeMobileMenu} className="text-base font-bold uppercase tracking-widest text-[#1A1A1A] hover:text-[#000000]">
            Contact
          </Link>
        </div>
      )}
    </header>
  );
}