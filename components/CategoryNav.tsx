"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

const categories = [
  { name: "All Drops", href: "/" },
  { name: "Tees", href: "/?category=tees" },
  { name: "Hoodies", href: "/?category=hoodies" },
  { name: "Sweatpants / Joggers", href: "/?category=sweatpants" },
  { name: "Mesh Shorts", href: "/?category=shorts" },
  { name: "Cargos / Pants", href: "/?category=cargos" },
  { name: "Outerwear / Jackets", href: "/?category=outerwear" },
  { name: "Headwear / Hats", href: "/?category=headwear" },
  { name: "Accessories", href: "/?category=accessories" },
  { name: "Gym Wears", href: "/?category=gym-wears" }, 
  { name: "The Archive", href: "/?category=archive" },
];

export default function CategoryNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside className="w-full md:w-48 flex-shrink-0 pt-2 mb-6 md:mb-0 relative z-30">
      
      {/* Desktop Title */}
      <h3 className="hidden md:block text-xs font-bold tracking-widest text-[#1A1A1A] mb-6 uppercase">
        Categories
      </h3>

      {/* Mobile Dropdown Button (Hidden on Desktop) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full md:hidden flex items-center justify-between bg-[#F9F9F9] border border-[#E5E5E5] px-4 py-3 text-sm font-bold uppercase tracking-widest text-[#1A1A1A]"
      >
        <span>Shop by Category</span>
        <ChevronDown size={18} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* 1. MOBILE LIST (Dropdown - Only shows when open on mobile) */}
      {isOpen && (
        <ul className="md:hidden absolute top-full left-0 w-full bg-white border border-[#E5E5E5] mt-1 shadow-xl max-h-[60vh] overflow-y-auto z-40">
          {categories.map((category) => (
            <li key={category.name} className="border-b border-[#F5F5F5] last:border-none">
              <Link
                href={category.href}
                onClick={() => setIsOpen(false)} // Auto-close menu when a category is selected
                className="block px-4 py-3 text-sm text-gray-500 hover:text-black font-medium transition-colors duration-200 uppercase tracking-wider"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* 2. DESKTOP LIST (Always visible on medium screens and larger) */}
      <ul className="hidden md:flex flex-col space-y-4">
        {categories.map((category) => (
          <li key={category.name}>
            <Link
              href={category.href}
              className="block text-sm text-gray-500 hover:text-black font-medium transition-colors duration-200 uppercase tracking-wider"
            >
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
      
    </aside>
  );
}