import { FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa6";

import { Trash2 } from "lucide-react"; // Nice icon for the button

export default function ContactPage() {
  const socialLinks = [
    { name: "Instagram", href: "https://instagram.com/yourhandle", icon: <FaInstagram size={20} /> },
    { name: "TikTok", href: "https://tiktok.com/@yourhandle", icon: <FaTiktok size={20} /> },
    { name: "WhatsApp", href: "https://wa.me/+2348145818057", icon: <FaWhatsapp size={20} /> },
  ];

  return (
    <section className="w-full min-h-screen bg-[#1A1A1A] px-6 py-24 flex items-center justify-center">
      <div className="max-w-xl w-full text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 text-[#FFFFFF]">
          Get in Touch
        </h1>
        <p className="text-lg font-medium leading-relaxed text-[#FFFFFF]/70 mb-12">
          Whether it's an inquiry about a bulk order, sizing guidance, or just to say hello—we are always available.
        </p>

        {/* Social Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 py-4 bg-[#FFFFFF] text-[#1A1A1A] font-bold uppercase tracking-widest text-xs hover:bg-[#E5E5E5] transition-all"
            >
              {link.icon}
              {link.name}
            </a>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-[#FFFFFF]/10">
          <p className="text-[#FFFFFF]/50 text-sm">Or send a direct email to:</p>
          <a href="mailto:support@monvera.com" className="text-[#FFFFFF] font-bold text-lg underline underline-offset-8 mt-2 block hover:text-[#FFFFFF]/80">
            support@monvera.com
          </a>
        </div>
      </div>
    </section>
  );
}