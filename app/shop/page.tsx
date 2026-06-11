"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import ProductCard from "@/components/store/ProductCard";
import { products } from "@/lib/data";

export default function ShopPage() {
  const [activeColor, setActiveColor] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("newest");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const colors = ["Black", "White", "Cream", "Brown", "Blue", "Red"];
  const sizes = ["S", "M", "L", "XL", "XXL"];

  // Active Filtering & Sorting Logic
  let displayedProducts = [...products];
  
  if (activeColor) {
    // We filter by checking if the product name contains the color string
    displayedProducts = displayedProducts.filter(p => p.name.includes(activeColor));
  }

  if (sortBy === "price-low") {
    displayedProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    displayedProducts.sort((a, b) => b.price - a.price);
  }

  return (
    <div className="w-full bg-[#FFFFFF] min-h-screen pb-24">
      {/* Premium Header Banner */}
      <div className="w-full bg-[#F5F5F5] py-16 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1A1A1A] mb-4">The Collection</h1>
        <p className="text-[#1A1A1A]/70 font-medium max-w-xl mx-auto">
          Heavyweight essentials engineered for the modern wardrobe. Uncompromising quality in every thread.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 flex flex-col md:flex-row gap-12">
        
        {/* Mobile Filter Toggle */}
        <div className="md:hidden flex justify-between items-center border-b border-[#E5E5E5] pb-4">
          <button 
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#1A1A1A]"
          >
            <SlidersHorizontal size={16} />
            Filters
          </button>
          <span className="text-sm font-medium text-[#1A1A1A]/70">{displayedProducts.length} Products</span>
        </div>

        {/* Sidebar: Filters (Hidden on mobile unless toggled) */}
        <aside className={`₦{showMobileFilters ? "block" : "hidden"} md:block w-full md:w-64 flex-shrink-0 space-y-10`}>
          
          {/* Color Filter */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A] mb-4">Color</h3>
            <div className="flex flex-col space-y-3">
              <button 
                onClick={() => setActiveColor(null)}
                className={`text-left text-sm font-medium transition-colors ₦{activeColor === null ? "text-[#000000] font-bold" : "text-[#1A1A1A]/60 hover:text-[#000000]"}`}
              >
                All Colors
              </button>
              {colors.map(color => (
                <button 
                  key={color}
                  onClick={() => setActiveColor(color)}
                  className={`text-left text-sm font-medium transition-colors ₦{activeColor === color ? "text-[#000000] font-bold" : "text-[#1A1A1A]/60 hover:text-[#000000]"}`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Size Filter (Visual only for now, as all shirts carry all sizes) */}
          <div className="pt-8 border-t border-[#E5E5E5]">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A] mb-4">Size</h3>
            <div className="grid grid-cols-3 gap-2">
              {sizes.map(size => (
                <button key={size} className="py-2 border border-[#E5E5E5] text-xs font-bold text-[#1A1A1A] hover:border-[#000000] transition-colors">
                  {size}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Product Grid */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="hidden md:flex justify-between items-center mb-8 pb-4 border-b border-[#E5E5E5]">
            <span className="text-sm font-medium text-[#1A1A1A]/70">{displayedProducts.length} Products</span>
            
            <div className="relative group">
              <button className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#1A1A1A]">
                Sort By <ChevronDown size={14} />
              </button>
              {/* Simple dropdown hover hack for the prototype */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-[#FFFFFF] border border-[#E5E5E5] shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 flex flex-col">
                <button onClick={() => setSortBy("newest")} className="text-left px-4 py-3 text-sm font-medium hover:bg-[#F5F5F5]">Newest</button>
                <button onClick={() => setSortBy("price-low")} className="text-left px-4 py-3 text-sm font-medium hover:bg-[#F5F5F5]">Price: Low to High</button>
                <button onClick={() => setSortBy("price-high")} className="text-left px-4 py-3 text-sm font-medium hover:bg-[#F5F5F5]">Price: High to Low</button>
              </div>
            </div>
          </div>

          {/* Grid */}
          {displayedProducts.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12"
            >
              {displayedProducts.map((product) => (
                <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={product.id}>
                  <ProductCard {...product} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="py-24 text-center">
              <h2 className="text-xl font-bold text-[#1A1A1A] mb-2">No products found</h2>
              <p className="text-[#1A1A1A]/70 font-medium">Try adjusting your filters to find what you're looking for.</p>
              <button onClick={() => setActiveColor(null)} className="mt-6 px-6 py-3 bg-[#000000] text-[#FFFFFF] text-xs font-bold uppercase tracking-widest hover:bg-[#1A1A1A]">
                Clear Filters
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}