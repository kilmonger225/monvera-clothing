"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);

    // TODO: Replace this timeout with your actual API call (e.g., Mailchimp or your database)
    // Example: await fetch('/api/subscribe', { method: 'POST', body: JSON.stringify({ email }) })
    
    setTimeout(() => {
      toast.success("You are on the list! Welcome to Monvera.");
      setEmail("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <footer className="w-full flex flex-col mt-20">
      {/* 1. NEWSLETTER SECTION */}
      <div className="bg-[#F5F5F5] py-24 px-6 flex flex-col items-center justify-center text-center">
        <div className="mb-8 select-none">
          <h2 className="text-5xl font-black tracking-tighter text-[#1A1A1A]">
            MONVERA<span className="text-[#1A1A1A]/30">.</span>
          </h2>
        </div>
        
        <h3 className="text-2xl font-bold uppercase tracking-widest text-[#1A1A1A] mb-3">
          Never Miss A Drop
        </h3>
        <p className="text-sm text-[#1A1A1A]/70 max-w-md mb-8">
          Be the first to know about new collections, limited releases, and exclusive offers.
        </p>
        
        <form className="w-full max-w-md flex flex-col gap-3" onSubmit={handleSubscribe}>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email" 
            className="w-full px-4 py-4 border border-[#E5E5E5] bg-[#FFFFFF] text-sm focus:outline-none focus:border-[#1A1A1A] transition-colors"
            required
            disabled={isSubmitting}
          />
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-[#1A1A1A] text-[#FFFFFF] px-4 py-4 text-sm font-bold uppercase tracking-widest hover:bg-black transition-colors disabled:opacity-70"
          >
            {isSubmitting ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
      </div>

      {/* 2. NAVIGATION LINKS SECTION */}
      <div className="bg-[#111111] text-[#FFFFFF] pt-20 pb-10 px-6 lg:px-12 xl:px-20">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-12 mb-20">
          <div className="flex flex-col">
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6">Shop</h4>
            <Link href="/shop" className="text-sm text-[#FFFFFF]/60 hover:text-[#FFFFFF] transition-colors mb-4">New Arrivals</Link>
            <Link href="/shop" className="text-sm text-[#FFFFFF]/60 hover:text-[#FFFFFF] transition-colors mb-4">Best Sellers</Link>
          </div>

          <div className="flex flex-col">
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6">Help</h4>
            <Link href="/privacy" className="text-sm text-[#FFFFFF]/60 hover:text-[#FFFFFF] transition-colors mb-4">Privacy Policy</Link>
            <Link href="/shipping" className="text-sm text-[#FFFFFF]/60 hover:text-[#FFFFFF] transition-colors mb-4">Shipping</Link>
            <Link href="/returns" className="text-sm text-[#FFFFFF]/60 hover:text-[#FFFFFF] transition-colors mb-4">Returns & Refunds</Link>
            <Link href="/terms" className="text-sm text-[#FFFFFF]/60 hover:text-[#FFFFFF] transition-colors mb-4">Terms of Service</Link>
            <Link href="/contact" className="text-sm text-[#FFFFFF]/60 hover:text-[#FFFFFF] transition-colors mb-4">Contact Us</Link>
          </div>

          <div className="flex flex-col">
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6">Products</h4>
            <Link href="/shop/tees" className="text-sm text-[#FFFFFF]/60 hover:text-[#FFFFFF] transition-colors mb-4">Heavyweight Tees</Link>
            <Link href="/shop/hoodies" className="text-sm text-[#FFFFFF]/60 hover:text-[#FFFFFF] transition-colors mb-4">Hoodies</Link>
            <Link href="/shop/accessories" className="text-sm text-[#FFFFFF]/60 hover:text-[#FFFFFF] transition-colors mb-4">Accessories</Link>
          </div>
        </div>

        {/* 3. BOTTOM BRANDING BAR */}
        <div className="max-w-5xl mx-auto border-t border-[#FFFFFF]/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold uppercase tracking-widest">Monvera Collection</span>
          </div>
          
          <p className="text-xs text-[#FFFFFF]/40">
            © 2026 All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-[#FFFFFF]/60 hover:text-[#FFFFFF] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}