"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/store/CartContext";
import { nigerianStates } from "@/lib/locations";
import { saveOrderToDatabase } from "@/app/actions/order";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import { sendOrderNotification } from "@/actions/email";
const PaystackWrapper = dynamic(() => import("@/components/store/PaystackWrapper"), { ssr: false });

const shippingOptions = [
  { id: 'pickup_atbu', name: 'Pickup (ATBU Yelwa)', price: 0 },
  { id: 'within_bauchi', name: 'Within Bauchi 24hrs', price: 1500 },
  { id: 'outside_bauchi', name: 'Outside Bauchi 5 working days', price: 5000 }
];

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
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
  const [isFormValid, setIsFormValid] = useState(false);

  const availableLGAs = selectedState ? nigerianStates[selectedState as keyof typeof nigerianStates] : [];
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const activeShipping = shippingOptions.find(opt => opt.id === shippingMethodId);
  const shippingCost = activeShipping ? activeShipping.price : 0;
  const total = subtotal + shippingCost;

  const formatNaira = (amount: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
  };

  const validateAndProceed = () => {
    if (!email || !email.includes('@')) {
      toast.error("Please enter a valid email");
      return;
    }
    if (!firstName || !lastName || !phone) {
      toast.error("Please fill in contact details");
      return;
    }
    // Conditional Validation
    if (shippingMethodId !== 'pickup_atbu') {
      if (!address || !selectedLGA || (!selectedState && shippingMethodId !== 'within_bauchi')) {
        toast.error("Please fill out full shipping details");
        return;
      }
    }
    setIsFormValid(true);
  };

  const paystackConfig = {
    reference: (new Date()).getTime().toString(),
    email: email.trim() || "customer@monvera.com", 
    amount: Math.round(total * 100), 
    publicKey: "pk_test_2d10a6be710a17bc73423bbbc8c068d4d28ce196", 
  };

  const handlePaystackSuccess = async (reference: any) => {
    const rawOrderDetails = {
      reference: reference.reference,
      email,
      amount: total * 100,
      items: cartItems,
      shippingMethod: shippingMethodId,
      shippingDetails: { firstName, lastName, address, apartment, phone, state: shippingMethodId === 'within_bauchi' ? 'Bauchi' : selectedState, lga: selectedLGA }
    };

    const cleanOrderDetails = JSON.parse(JSON.stringify(rawOrderDetails));
    const toastId = toast.loading("Finalizing order...");

    try {
      const dbResult = await saveOrderToDatabase(cleanOrderDetails);
      if (!dbResult?.success) throw new Error("Database failed");
      await sendOrderNotification(cleanOrderDetails);
      clearCart();
      toast.success("Order secured!");
      window.location.assign(`/success?reference=${reference.reference}`);
    } catch (error: any) {
      toast.error("Checkout finalized, but email failed.");
      window.location.assign(`/success?reference=${reference.reference}`);
    }
  };

  const inputClass = "w-full p-4 border border-[#E5E5E5] bg-white outline-none focus:border-[#1A1A1A] transition-colors text-sm placeholder:text-gray-400";

  return (
    <div className="min-h-screen flex flex-col-reverse lg:flex-row bg-white">
      <div className="w-full lg:w-[55%] p-6 lg:p-12 xl:p-20">
        <div className="max-w-xl ml-auto">
          <h2 className="text-lg font-bold uppercase tracking-widest text-[#1A1A1A] mb-4">Contact</h2>
          <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setIsFormValid(false); }} placeholder="Email address" className={`${inputClass} mb-8`} />

          <h2 className="text-lg font-bold uppercase tracking-widest text-[#1A1A1A] mb-4">Shipping Method</h2>
          <div className="border border-[#E5E5E5] rounded-sm divide-y divide-[#E5E5E5] mb-8">
            {shippingOptions.map((option) => (
              <label key={option.id} className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <input type="radio" name="shippingMethod" value={option.id} checked={shippingMethodId === option.id} onChange={(e) => { setShippingMethodId(e.target.value); setIsFormValid(false); }} className="accent-black w-4 h-4" />
                  <span className="text-sm font-medium text-[#1A1A1A]">{option.name}</span>
                </div>
                <span className="text-sm font-bold text-[#1A1A1A]">{option.price === 0 ? "Free" : formatNaira(option.price)}</span>
              </label>
            ))}
          </div>

          <h2 className="text-lg font-bold uppercase tracking-widest text-[#1A1A1A] mb-4">Shipping Details</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input type="text" value={firstName} onChange={(e) => { setFirstName(e.target.value); setIsFormValid(false); }} placeholder="First name" className={inputClass} />
            <input type="text" value={lastName} onChange={(e) => { setLastName(e.target.value); setIsFormValid(false); }} placeholder="Last name" className={inputClass} />
          </div>

          {shippingMethodId !== 'pickup_atbu' && (
            <>
              <input type="text" value={address} onChange={(e) => { setAddress(e.target.value); setIsFormValid(false); }} placeholder="Address" className={`${inputClass} mb-4`} />
              <input type="text" value={apartment} onChange={(e) => setApartment(e.target.value)} placeholder="Apartment, suite, etc. (optional)" className={`${inputClass} mb-4`} />
              <div className="grid grid-cols-2 gap-4 mb-4">
                {shippingMethodId === 'within_bauchi' ? (
                  <input type="text" value="Bauchi" disabled className={`${inputClass} bg-gray-50 text-gray-500`} />
                ) : (
                  <select value={selectedState} onChange={(e) => { setSelectedState(e.target.value); setSelectedLGA(""); setIsFormValid(false); }} className={inputClass}>
                    <option value="" disabled>Select State</option>
                    {Object.keys(nigerianStates).map(state => <option key={state} value={state}>{state}</option>)}
                  </select>
                )}
                <select value={selectedLGA} onChange={(e) => { setSelectedLGA(e.target.value); setIsFormValid(false); }} className={inputClass} disabled={!selectedState && shippingMethodId !== 'within_bauchi'}>
                  <option value="" disabled>Select LGA</option>
                  {(shippingMethodId === 'within_bauchi' ? nigerianStates["Bauchi"] : availableLGAs).map((lga: string) => <option key={lga} value={lga}>{lga}</option>)}
                </select>
              </div>
            </>
          )}

          <input type="tel" value={phone} onChange={(e) => { setPhone(e.target.value); setIsFormValid(false); }} placeholder="Phone" className={`${inputClass} mb-8`} />

          <div className="pt-6 border-t border-[#E5E5E5]">
            {!isFormValid ? (
              <button onClick={validateAndProceed} className="w-full bg-[#1A1A1A] text-white py-4 text-sm font-bold uppercase tracking-widest hover:bg-[#333333] transition-colors">
                Continue to Payment
              </button>
            ) : (
              <div className="animate-in fade-in duration-300">
                <div className="p-4 mb-4 bg-green-50 text-green-800 border border-green-200 text-sm font-medium flex justify-between items-center">
                  <span>Details confirmed.</span>
                  <button onClick={() => setIsFormValid(false)} className="underline text-xs font-bold hover:text-black">Edit</button>
                </div>
                <PaystackWrapper config={paystackConfig} onSuccess={handlePaystackSuccess} onClose={() => console.log("Closed")} total={total} formatNaira={formatNaira} />
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Sidebar remains the same */}
    </div>
  );
}