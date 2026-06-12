"use client";

import { usePaystackPayment } from "react-paystack";
import { CreditCard } from "lucide-react";

export default function PaystackWrapper({ config, onSuccess, onClose, total, formatNaira }: any) {
  const initializePayment = usePaystackPayment(config);

  return (
    <button 
      type="button" 
      onClick={() => initializePayment({ onSuccess, onClose })} 
      className="w-full py-5 bg-[#000000] text-[#FFFFFF] text-sm font-bold uppercase tracking-widest hover:bg-[#1A1A1A] transition-colors flex justify-center gap-2"
    >
      <CreditCard size={18} /> Pay {formatNaira(total)}
    </button>
  );
}