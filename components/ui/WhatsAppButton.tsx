"use client";

import { MessageCircle } from "lucide-react"; // Make sure you have lucide-react installed

export default function WhatsAppButton() {
  const phoneNumber = "2347042528244"; // Replace with your actual number (e.g., 234...)

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=Hi!%20I'm%20interested%20in%20Monvera%20Clothing.`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:bg-[#128C7E] transition-all transform hover:scale-110"
    >
      <MessageCircle size={32} />
    </a>
  );
}