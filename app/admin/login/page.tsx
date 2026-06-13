"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
  e.preventDefault();
  
  if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
    // 1. Set the cookie
    document.cookie = "isAdmin=true; path=/; max-age=86400"; 
    
    // 2. Force a HARD navigation so the proxy.ts file runs and sees the cookie
    window.location.href = "/admin"; 
  } else {
    // 3. Use a native browser alert just in case your toast notifications are hidden
    alert("Invalid password! Check your .env.local file.");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFFFF]">
      <form onSubmit={handleLogin} className="p-8 border border-[#E5E5E5] shadow-sm w-full max-w-md">
        <h2 className="text-xl font-bold uppercase tracking-widest mb-6 text-[#1A1A1A] text-center">
          Admin Access
        </h2>
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Enter password" 
          className="w-full p-4 border border-[#E5E5E5] mb-4 focus:outline-none focus:border-[#1A1A1A] transition-colors"
        />
        <button 
          type="submit" 
          className="w-full bg-[#1A1A1A] text-[#FFFFFF] py-4 font-bold uppercase tracking-widest hover:bg-black transition-colors"
        >
          Login
        </button>
      </form>
    </div>
  );
}