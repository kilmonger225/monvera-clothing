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
    if (!email || !email.includes('@') || !email.includes('.')) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!firstName || !lastName || !address || !phone || !selectedState || !selectedLGA) {
      toast.error("Please fill out all required shipping details");
      return;
    }
    setIsFormValid(true);
  };

  const paystackConfig = {
    reference: (new Date()).getTime().toString(),
    email: email ? email.trim() : "customer@monvera.com", 
    amount: total && total > 0 ? Math.round(total * 100) : 10000, 
    publicKey: "pk_test_2d10a6be710a17bc73423bbbc8c068d4d28ce196", 
  };

 const handlePaystackSuccess = async (reference: any) => {
    const rawOrderDetails = {
      reference: reference.reference,
      email,
      amount: total * 100,
      items: cartItems,
      shippingMethod: shippingMethodId,
      shippingDetails: { firstName, lastName, address, apartment, phone, state: selectedState, lga: selectedLGA }
    };

    const cleanOrderDetails = JSON.parse(JSON.stringify(rawOrderDetails));
    const toastId = toast.loading("Finalizing order...");

    try {
      // 1. Database Save
      const dbResult = await saveOrderToDatabase(cleanOrderDetails);
      if (!dbResult?.success) throw new Error("Database failed");

      // 2. Explicitly wait for the email
      console.log("Attempting to send email...");
      const emailResult = await sendOrderNotification(cleanOrderDetails);
      console.log("Email result:", emailResult);

      // 3. Clear cart
      clearCart();

      // 4. Force hard redirect to ensure the browser leaves the current page
      toast.success("Order secured!");
      window.location.assign(`/success?reference=${reference.reference}`);

    } catch (error: any) {
      console.error("DEBUG:", error);
      toast.error("Checkout finalized, but email failed.");
      window.location.assign(`/success?reference=${reference.reference}`);
    }
    
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#FFFFFF] px-6">
        <h2 className="text-2xl font-bold mb-4 tracking-widest uppercase text-[#1A1A1A]">Your bag is empty</h2>
        <Link href="/shop" className="px-10 py-4 bg-[#1A1A1A] text-white text-sm font-bold uppercase tracking-wider hover:bg-[#333333] transition-colors">
          Return to Shop
        </Link>
      </div>
    );
  }

  const inputClass = "w-full p-4 border border-[#E5E5E5] bg-white outline-none focus:border-[#1A1A1A] transition-colors text-sm placeholder:text-gray-400";

  return (
    <div className="min-h-screen flex flex-col-reverse lg:flex-row bg-white">
      <div className="w-full lg:w-[55%] p-6 lg:p-12 xl:p-20">
        <div className="max-w-xl ml-auto">
          <h2 className="text-lg font-bold uppercase tracking-widest text-[#1A1A1A] mb-4">Contact</h2>
          <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setIsFormValid(false); }} placeholder="Email address" className={`${inputClass} mb-8`} />

          <h2 className="text-lg font-bold uppercase tracking-widest text-[#1A1A1A] mb-4">Shipping</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input type="text" value={firstName} onChange={(e) => { setFirstName(e.target.value); setIsFormValid(false); }} placeholder="First name" className={inputClass} />
            <input type="text" value={lastName} onChange={(e) => { setLastName(e.target.value); setIsFormValid(false); }} placeholder="Last name" className={inputClass} />
          </div>
          <input type="text" value={address} onChange={(e) => { setAddress(e.target.value); setIsFormValid(false); }} placeholder="Address" className={`${inputClass} mb-4`} />
          <input type="text" value={apartment} onChange={(e) => setApartment(e.target.value)} placeholder="Apartment, suite, etc. (optional)" className={`${inputClass} mb-4`} />
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <select value={selectedState} onChange={(e) => { setSelectedState(e.target.value); setSelectedLGA(""); setIsFormValid(false); }} className={inputClass}>
              <option value="" disabled>Select State</option>
              {Object.keys(nigerianStates).map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            <select value={selectedLGA} onChange={(e) => { setSelectedLGA(e.target.value); setIsFormValid(false); }} className={inputClass} disabled={!selectedState}>
              <option value="" disabled>Select LGA</option>
              {availableLGAs.map((lga: string) => (
                <option key={lga} value={lga}>{lga}</option>
              ))}
            </select>
          </div>
          <input type="tel" value={phone} onChange={(e) => { setPhone(e.target.value); setIsFormValid(false); }} placeholder="Phone" className={`${inputClass} mb-8`} />

          <h2 className="text-lg font-bold uppercase tracking-widest text-[#1A1A1A] mb-4">Shipping Method</h2>
          <div className="border border-[#E5E5E5] rounded-sm divide-y divide-[#E5E5E5] mb-12">
            {shippingOptions.map((option) => (
              <label key={option.id} className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <input type="radio" name="shippingMethod" value={option.id} checked={shippingMethodId === option.id} onChange={(e) => setShippingMethodId(e.target.value)} className="accent-black w-4 h-4" />
                  <span className="text-sm font-medium text-[#1A1A1A]">{option.name}</span>
                </div>
                <span className="text-sm font-bold text-[#1A1A1A]">
                  {option.price === 0 ? "Free" : formatNaira(option.price)}
                </span>
              </label>
            ))}
          </div>

          <div className="pt-6 border-t border-[#E5E5E5]">
            {!isFormValid ? (
              <button onClick={validateAndProceed} className="w-full bg-[#1A1A1A] text-white py-4 text-sm font-bold uppercase tracking-widest hover:bg-[#333333] transition-colors">
                Continue to Payment
              </button>
            ) : (
              <div className="animate-in fade-in duration-300">
                <div className="p-4 mb-4 bg-green-50 text-green-800 border border-green-200 text-sm font-medium flex justify-between items-center">
                  <span>Shipping details confirmed.</span>
                  <button onClick={() => setIsFormValid(false)} className="underline text-xs font-bold hover:text-black">Edit</button>
                </div>
                <PaystackWrapper config={paystackConfig} onSuccess={handlePaystackSuccess} onClose={() => console.log("Payment modal closed")} total={total} formatNaira={formatNaira} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[45%] p-6 lg:p-12 xl:p-20 bg-[#FAFAFA] border-b lg:border-b-0 lg:border-l border-[#E5E5E5]">
        <div className="max-w-md mr-auto">
          <div className="flex flex-col gap-4 mb-8 max-h-[50vh] overflow-y-auto pr-2">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="relative w-16 h-16 bg-[#E5E5E5] border border-gray-200 rounded-sm overflow-hidden flex-shrink-0">
                  <img src={(item as any).imageFront || (item as any).image || "/placeholder.jpg"} alt={item.name} className="object-cover w-full h-full" />
                  <div className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full z-10">
                    {item.quantity}
                  </div>
                </div>
                <div className="flex-grow">
                  <h4 className="text-sm font-bold text-[#1A1A1A]">{item.name}</h4>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-medium text-[#1A1A1A]">
                  {formatNaira(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-[#E5E5E5] pt-4 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium text-[#1A1A1A]">{formatNaira(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium text-[#1A1A1A]">{shippingCost === 0 ? "Free" : formatNaira(shippingCost)}</span>
            </div>
          </div>
          
          <div className="border-t border-[#E5E5E5] mt-4 pt-4">
            <div className="flex justify-between items-end">
              <span className="text-base font-bold uppercase tracking-widest text-[#1A1A1A]">Total</span>
              <span className="text-2xl font-bold text-[#1A1A1A]">{formatNaira(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}