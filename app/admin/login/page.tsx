"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password check (In production, use a secure API route/env variable)
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
  // This sets the cookie that the proxy is looking for
  document.cookie = "isAdmin=true; path=/; max-age=86400"; 
  router.push("/admin/products");
} else {
  toast.error("Invalid password")}
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <form onSubmit={handleLogin} className="p-8 border border-gray-200">
        <h2 className="text-xl font-bold uppercase tracking-widest mb-6">Admin Access</h2>
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Enter password" 
          className="w-full p-4 border border-[#E5E5E5] mb-4"
        />
        <button type="submit" className="w-full bg-[#1A1A1A] text-white py-4 font-bold uppercase tracking-widest">
          Login
        </button>
      </form>
    </div>
  );
}