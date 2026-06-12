'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle } from 'lucide-react';

function SuccessDetails() {
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference');

  return (
    <div className="text-center">
      <div className="flex justify-center mb-6 text-green-600">
        <CheckCircle size={64} strokeWidth={1.5} />
      </div>
      <h1 className="text-4xl font-bold text-[#1A1A1A] mb-4 uppercase tracking-widest">
        Order Confirmed
      </h1>
      <p className="text-[#1A1A1A]/70 mb-8 max-w-md mx-auto">
        Thank you for shopping with Monvera. Your order has been successfully placed and your receipt has been sent to your email.
      </p>
      
      {reference && (
        <div className="bg-[#F5F5F5] border border-[#E5E5E5] p-4 mb-8 inline-block mx-auto">
          <p className="text-xs uppercase tracking-widest text-[#1A1A1A]/60 font-bold mb-1">Order Reference</p>
          <p className="text-lg font-mono font-bold text-[#1A1A1A]">{reference}</p>
        </div>
      )}

      <div className="mt-8">
        <Link 
          href="/shop" 
          className="bg-[#000000] text-[#FFFFFF] px-10 py-4 text-sm font-bold uppercase tracking-widest hover:bg-[#1A1A1A] transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#FFFFFF] px-6">
      <Suspense fallback={<div className="text-sm font-bold uppercase tracking-widest text-[#1A1A1A]">Loading your receipt...</div>}>
        <SuccessDetails />
      </Suspense>
    </div>
  );
}