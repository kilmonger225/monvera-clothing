"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Minus } from "lucide-react";
import { useCart } from "@/components/store/CartContext";
import { nigerianStates } from "@/lib/locations";
import { saveOrderToDatabase } from "@/app/actions/order";
import { sendOrderNotification } from "@/actions/email";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";

// Dynamically import Paystack wrapper to avoid SSR 'window' errors
const PaystackWrapper = dynamic(() => import("@/components/store/PaystackWrapper"), {
  ssr: false,
});

const shippingOptions = [
  { id: 'pickup_atbu', name: 'Pickup (ATBU Yelwa)', price: 0 },
  { id: 'within_bauchi', name: 'Within Bauchi 24hrs', price: 1500 },
  { id: 'outside_bauchi', name: 'Outside Bauchi 5 working days', price: 5000 }
];

export default function CheckoutPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [apartment, setApartment] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedLGA, setSelectedLGA] = useState("");
  const [shippingMethodId, setShippingMethodId] = useState("pickup_atbu");

  const availableLGAs = selectedState ? nigerianStates[selectedState] : [];
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const activeShipping = shippingOptions.find(opt => opt.id === shippingMethodId);
  const shippingCost = activeShipping ? activeShipping.price : 0;
  const total = subtotal + shippingCost;

  const formatNaira = (amount: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
  };

  const paystackConfig = {
    reference: (new Date()).getTime().toString(),
    email: email,
    amount: total * 100, 
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "", 
  };

  const handlePaystackSuccess = async (reference: any) => {
    const orderDetails = {
      reference: reference.reference,
      email,
      amount: total * 100,
      items: cartItems,
      shippingMethod: shippingMethodId,
      shippingDetails: { firstName, lastName, address, apartment, phone, state: selectedState, lga: selectedLGA }
    };

    const [emailResult, dbResult] = await Promise.all([
      sendOrderNotification(orderDetails),
      saveOrderToDatabase(orderDetails)
    ]);

    clearCart();

    if (dbResult?.success) {
      toast.success("Order secured!");
      router.push(`/success?reference=${reference.reference}`);
    } else {
      toast.error("Order recording failed. Please contact support.");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#FFFFFF] px-6">
        <h2 className="text-2xl font-bold mb-4">Your bag is empty</h2>
        <Link href="/shop" className="px-10 py-4 bg-black text-white font-bold uppercase">Return to Shop</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row">
      <div className="w-full lg:w-[60%] p-12 border-r">
        {/* Form content remains the same */}
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full p-4 border mb-4" />
        {/* ... Include your existing address/shipping inputs here ... */}
        
        {/* Replace your old button with the dynamic wrapper */}
        <PaystackWrapper 
          config={paystackConfig} 
          onSuccess={handlePaystackSuccess} 
          onClose={() => console.log("Closed")} 
          total={total} 
          formatNaira={formatNaira} 
        />
      </div>
      {/* Summary side remains the same */}
    </div>
  );
}