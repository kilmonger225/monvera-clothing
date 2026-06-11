"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import ProductCard from "@/components/store/ProductCard";
import { products as featuredProducts } from "@/lib/data";

export default function Home() {
  return (
    <div className="w-full">
      {/* 1. HERO SECTION */}
      <section className="relative w-full h-[calc(100vh-80px)] flex flex-col items-center justify-center overflow-hidden bg-[#FFFFFF]">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#F5F5F5]/40 z-0" />
        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="uppercase tracking-[0.3em] text-xs font-bold mb-6 text-[#1A1A1A]/60">
            Crafted for Everyday Excellence
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2, ease: "easeOut" }} className="text-5xl md:text-7xl font-bold tracking-tight leading-tight mb-8">
            Premium Streetwear <br className="hidden md:block" /> Designed for Life.
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.4, ease: "easeOut" }} className="text-lg md:text-xl font-medium text-[#1A1A1A]/80 mb-12 max-w-2xl mx-auto">
            Heavyweight 285gsm essentials crafted for comfort, quality, and a timeless silhouette.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }} className="flex flex-col sm:flex-row items-center gap-6">
            <Link href="/shop" className="group relative px-10 py-4 bg-[#000000] text-[#FFFFFF] text-sm font-bold uppercase tracking-widest overflow-hidden transition-all duration-300 hover:bg-[#1A1A1A]">
              Shop Collection
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. FEATURED COLLECTION */}
      <section className="w-full py-24 px-6 bg-[#FFFFFF]">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-[#1A1A1A]">New Arrivals</h2>
            <Link href="/shop" className="text-sm font-bold underline underline-offset-8 hover:text-[#1A1A1A]/70 transition-colors">
              View All
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* 3. WHY MONVERA */}
      <section className="w-full py-24 bg-[#F5F5F5] px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-[#1A1A1A] mb-4">The Monvera Standard</h2>
            <p className="text-[#1A1A1A]/70 max-w-2xl mx-auto font-medium">No shortcuts. We engineer every garment to withstand the test of time, blending luxury craftsmanship with everyday utility.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "Premium Fabric", desc: "Heavyweight 285gsm cotton built for lasting durability and a structured drape." },
              { title: "Luxury Fit", desc: "A perfectly engineered relaxed, oversized silhouette that flatters any form." },
              { title: "Everyday Versatility", desc: "Minimalist aesthetics designed for seamless daily styling and transitions." }
            ].map((pillar, idx) => (
              <div key={idx} className="flex flex-col items-center text-center p-6 border border-[#E5E5E5] bg-[#FFFFFF]">
                <div className="w-12 h-12 bg-[#000000] text-[#FFFFFF] flex items-center justify-center rounded-full mb-6 font-bold">{idx + 1}</div>
                <h3 className="text-lg font-bold mb-3 text-[#1A1A1A]">{pillar.title}</h3>
                <p className="text-sm font-medium text-[#1A1A1A]/70 leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}