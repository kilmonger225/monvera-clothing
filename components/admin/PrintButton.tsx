"use client";
import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="flex items-center gap-2 bg-[#1A1A1A] text-white px-6 py-3 font-bold uppercase tracking-widest hover:bg-black transition-colors print:hidden mb-8"
    >
      <Printer size={20} />
      Print Packing Slip
    </button>
  );
}