"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();

  return (
    <button 
      onClick={() => router.back()} 
      className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#1A1A1A] hover:text-[#1A1A1A]/60 transition-colors mb-8 lg:mb-12 group"
    >
      <ArrowLeft size={20} className="transform transition-transform group-hover:-translate-x-1" />
      Back
    </button>
  );
}