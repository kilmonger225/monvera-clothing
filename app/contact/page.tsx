"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { MessageCircle } from "lucide-react";
import { Smartphone } from "lucide-react"; // Using Smartphone to represent the TikTok/Social link
export default function ContactPage() {
  const [isPending, setIsPending] = useState(false);

 async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setIsPending(true);
  
  // 1. Capture the form
  const form = e.currentTarget;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    // 2. Check for successful send
    if (res.ok) {
      toast.success("Message sent successfully!");
      form.reset(); // This clears the inputs
    } else {
      // 3. This only fires if the API returns an error (like 500)
      toast.error("Failed to send message. Please try again.");
    }
  } catch (error) {
    // 4. This only fires if the network request fails completely
    toast.error("Connection error. Check your internet.");
  } finally {
    setIsPending(false); // Button text returns to "SEND"
  }
}

  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-black uppercase tracking-tight mb-12">Contact Us</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input name="firstName" required placeholder="First Name" className="p-4 border border-gray-200 focus:border-black outline-none transition" />
          <input name="lastName" required placeholder="Last Name" className="p-4 border border-gray-200 focus:border-black outline-none transition" />
        </div>
        <input name="email" type="email" required placeholder="Enter your email" className="w-full p-4 border border-gray-200 focus:border-black outline-none transition" />
        <textarea name="message" required rows={8} placeholder="Enter your message" className="w-full p-4 border border-gray-200 focus:border-black outline-none transition" />
        
        <button disabled={isPending} className="w-full bg-black text-white py-4 font-bold uppercase tracking-widest hover:bg-gray-800 transition">
          {isPending ? "Sending..." : "Send"}
        </button>
      </form>


<div className="mt-20 pt-10 border-t border-gray-100 flex justify-center gap-8">
  {/* Instagram */}
  <a href="https://instagram.com/monvera" target="_blank" className="hover:text-gray-500 transition">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  </a>
  
  {/* TikTok (Represented by a Music icon) */}
  <a href="https://tiktok.com/@monveraclothing_" target="_blank" className="hover:text-gray-500 transition">
   <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.128-4.695V9.036a6.338 6.338 0 0 0-4.015 11.233 6.338 6.338 0 0 0 9.071-5.594v-5.23a4.793 4.793 0 0 0 4.258 3.77z"/>
  </svg>
  </a>

  {/* WhatsApp */}
  <a href="https://wa.me/2347042528244" target="_blank" className="hover:text-gray-500 transition">
    <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
  </a>
</div>
    </div>
  );
}