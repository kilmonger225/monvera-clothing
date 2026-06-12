"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-200">
        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <h1 className="text-3xl font-bold uppercase tracking-widest text-[#1A1A1A] mb-4">
        Order Secured
      </h1>
      
      <p className="text-gray-600 mb-8">
        Your payment was successful and your order has been received. 
        We are preparing your Monvera heavyweight essentials for shipping.
      </p>

      <div className="bg-[#FAFAFA] border border-[#E5E5E5] p-6 mb-10 inline-block text-left min-w-[300px]">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Order Reference</p>
        <p className="text-lg font-mono font-bold text-[#1A1A1A]">
          {reference || "Processing..."}
        </p>
      </div>

      <div>
        <Link 
          href="/shop" 
          className="inline-block bg-[#1A1A1A] text-white px-10 py-4 text-sm font-bold uppercase tracking-widest hover:bg-[#333333] transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-white px-6 py-20">
      {/* Suspense is required by Next.js when using useSearchParams */}
      <Suspense fallback={<div className="text-sm font-bold uppercase tracking-widest animate-pulse">Loading Order Details...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}