"use client";
import { saveOrderToDatabase } from "@/app/actions/order";import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CreditCard, Trash2, Plus, Minus } from "lucide-react";
import { useCart } from "@/components/store/CartContext";
import { nigerianStates } from "@/lib/locations";
import { usePaystackPayment } from "react-paystack";
import { sendOrderNotification } from "@/actions/email";
import toast from "react-hot-toast";

const shippingOptions = [
  { id: 'pickup_atbu', name: 'Pickup (ATBU Yelwa)', price: 0 },
  { id: 'within_bauchi', name: 'Within Bauchi 24hrs', price: 1500 },
  { id: 'outside_bauchi', name: 'Outside Bauchi 5 working days', price: 5000 }
];

export default function CheckoutPage() {
  // 1. Destructured clearCart here
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

  const initializePayment = usePaystackPayment(paystackConfig);

 const handlePaystackSuccess = async (reference: any) => {
    console.log("Payment Confirmed!", reference);
    
    const orderDetails = {
      reference: reference.reference,
      email: email,
      amount: total * 100, // kobo
      items: cartItems,
      shippingMethod: shippingMethodId,
      shippingDetails: {
        firstName,
        lastName,
        address,
        apartment,
        phone,
        state: selectedState,
        lga: selectedLGA
      }
    };

    // 1. Send the email receipt
    const emailResult = await sendOrderNotification(orderDetails);
    
    // 2. Save to the database
    const dbResult = await saveOrderToDatabase(orderDetails);

    // 3. Clear the cart
    clearCart();

    if (emailResult?.success && dbResult?.success) {
      toast.success("Payment secured and order recorded!");
    } else if (dbResult?.success) {
      toast.error("Order recorded, but receipt email failed.");
    } else {
      toast.error("Payment secured, but there was a system error recording the order.");
    }
    
    router.push(`/success?reference=${reference.reference}`);
  };

  const handlePaystackClose = () => {
    console.log("User closed the payment window.");
  };

  const processOrder = () => {
    // 3. Added selectedLGA to make sure LGA is selected before paying
    if (!email || !firstName || !lastName || !address || !phone || !selectedState || !selectedLGA) {
      toast.error("Please fill in all required shipping details.");
      return;
    }
    initializePayment({ onSuccess: handlePaystackSuccess, onClose: handlePaystackClose });
  };

  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
    toast.success("Item removed from cart");
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#FFFFFF] px-6">
        <h2 className="text-2xl font-bold tracking-tight text-[#1A1A1A] mb-4">Your bag is empty</h2>
        <Link href="/shop" className="px-10 py-4 bg-[#000000] text-[#FFFFFF] text-sm font-bold uppercase tracking-widest hover:bg-[#1A1A1A]">Return to Shop</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto w-full min-h-screen bg-[#FFFFFF] flex flex-col lg:flex-row">
      <div className="w-full lg:w-[55%] xl:w-[60%] px-6 py-12 lg:pr-16 lg:pl-12 border-r border-[#E5E5E5]">
        
        <form className="space-y-12">
          {/* Contact Section */}
          <section>
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">Contact</h2>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" required className="w-full p-4 border border-[#E5E5E5] bg-[#F5F5F5] focus:border-[#000000] focus:bg-[#FFFFFF] outline-none transition-all" />
          </section>

          {/* Shipping Address */}
          <section>
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">Shipping Address</h2>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" required className="w-full p-4 border border-[#E5E5E5] bg-[#F5F5F5] focus:border-[#000000] focus:bg-[#FFFFFF] outline-none" />
              <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" required className="w-full p-4 border border-[#E5E5E5] bg-[#F5F5F5] focus:border-[#000000] focus:bg-[#FFFFFF] outline-none" />
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street Address" required className="col-span-2 w-full p-4 border border-[#E5E5E5] bg-[#F5F5F5] focus:border-[#000000] focus:bg-[#FFFFFF] outline-none" />
              <input type="text" value={apartment} onChange={(e) => setApartment(e.target.value)} placeholder="Apartment, suite, etc. (optional)" className="col-span-2 w-full p-4 border border-[#E5E5E5] bg-[#F5F5F5] focus:border-[#000000] focus:bg-[#FFFFFF] outline-none" />
              
              <select value={selectedState} onChange={(e) => { setSelectedState(e.target.value); setSelectedLGA(""); }} required className="w-full p-4 border border-[#E5E5E5] bg-[#F5F5F5] focus:border-[#000000] focus:bg-[#FFFFFF] outline-none">
                <option value="" disabled>Select State</option>
                {Object.keys(nigerianStates).map(state => <option key={state} value={state}>{state}</option>)}
              </select>

              <select value={selectedLGA} onChange={(e) => setSelectedLGA(e.target.value)} required disabled={!selectedState} className="w-full p-4 border border-[#E5E5E5] bg-[#F5F5F5] focus:border-[#000000] focus:bg-[#FFFFFF] outline-none disabled:opacity-50">
                <option value="" disabled>Select LGA</option>
                {availableLGAs?.map(lga => <option key={lga} value={lga}>{lga}</option>)}
              </select>

              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number" required className="col-span-2 w-full p-4 border border-[#E5E5E5] bg-[#F5F5F5] focus:border-[#000000] focus:bg-[#FFFFFF] outline-none" />
            </div>
          </section>

          {/* Delivery Section */}
          <section>
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">Delivery Method</h2>
            <div className="flex flex-col space-y-4">
              {shippingOptions.map((option) => (
                <label key={option.id} className={`flex items-start justify-between p-4 border rounded-md cursor-pointer transition-colors ${shippingMethodId === option.id ? 'border-[#000000] bg-[#F5F5F5]' : 'border-[#E5E5E5]'}`}>
                  <div className="flex items-center gap-4">
                    <input type="radio" name="shippingMethod" value={option.id} checked={shippingMethodId === option.id} onChange={() => setShippingMethodId(option.id)} className="w-5 h-5 accent-[#000000]" />
                    <h3 className="font-bold text-[#1A1A1A] uppercase text-sm tracking-widest">{option.name}</h3>
                  </div>
                  <span className="font-bold text-[#1A1A1A]">{option.price === 0 ? "FREE" : formatNaira(option.price)}</span>
                </label>
              ))}
            </div>
          </section>

          <button type="button" onClick={processOrder} className="w-full py-5 bg-[#000000] text-[#FFFFFF] text-sm font-bold uppercase tracking-widest hover:bg-[#1A1A1A] transition-colors flex justify-center gap-2">
            <CreditCard size={18} /> Pay {formatNaira(total)}
          </button>
        </form>
      </div>

      {/* Right Column Summary */}
      <div className="w-full lg:w-[45%] xl:w-[40%] bg-[#F5F5F5] px-6 py-12 lg:pl-12 border-t lg:border-t-0 border-[#E5E5E5] h-full lg:min-h-screen sticky top-0">
        <h2 className="text-xl font-bold text-[#1A1A1A] mb-8">Order Summary</h2>
        <div className="space-y-6 mb-8">
          {cartItems.map((item) => (
            <div key={item.id} className="flex flex-col gap-4 group">
              <div className="flex gap-4 items-center">
                <div className="relative w-16 h-20 bg-[#FFFFFF] border border-[#E5E5E5] flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-[#1A1A1A]">{item.name}</h3>
                  <p className="text-xs font-medium text-[#1A1A1A]/70 mt-1">Size: {item.size}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <p className="text-sm font-bold text-[#1A1A1A]">{formatNaira(item.price * item.quantity)}</p>
                </div>
              </div>
              
              {/* Quantity Adjusters and Remove Icon inside Checkout Summary */}
              <div className="flex justify-between items-center bg-[#FFFFFF] p-2 border border-[#E5E5E5]">
                <div className="flex items-center">
                  <button 
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="p-1 hover:bg-[#F5F5F5] disabled:opacity-50 transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                  <button 
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 hover:bg-[#F5F5F5] transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                
                <button
                  type="button"
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-red-500 hover:text-red-700 transition-colors p-1"
                  title="Remove item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Subtotal & Total display below items */}
        <div className="border-t border-[#E5E5E5] pt-6 space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-[#1A1A1A]/70">Subtotal</span>
            <span className="font-bold text-[#1A1A1A]">{formatNaira(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#1A1A1A]/70">Shipping</span>
            <span className="font-bold text-[#1A1A1A]">{activeShipping?.price === 0 ? "FREE" : formatNaira(shippingCost)}</span>
          </div>
          <div className="flex justify-between text-lg pt-4 border-t border-[#1A1A1A]">
            <span className="font-bold text-[#1A1A1A]">Total</span>
            <span className="font-bold text-[#1A1A1A]">{formatNaira(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}