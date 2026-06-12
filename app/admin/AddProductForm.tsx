"use client";

import { useRef, useTransition } from "react";
import { addProduct } from "@/actions/product"; // Or whatever path clears the red line!
import toast from "react-hot-toast";

export default function AddProductForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const res = await addProduct(formData);
      
      if (res.success) {
        toast.success("Product and images uploaded!");
        formRef.current?.reset(); 
      } else {
        toast.error("Failed to upload product");
      }
    });
  };

  return (
    <form ref={formRef} action={handleSubmit} className="bg-[#FFFFFF] p-6 border border-[#E5E5E5] shadow-sm mb-8">
      <h3 className="text-sm font-bold text-[#1A1A1A]/70 uppercase tracking-widest mb-4">Add New Drop</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-bold text-[#1A1A1A] mb-2 uppercase">Product Name</label>
          <input type="text" name="name" required placeholder="Heavyweight Hoodie" className="w-full p-3 border outline-none focus:border-[#1A1A1A] transition-colors" />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#1A1A1A] mb-2 uppercase">Price (₦)</label>
          <input type="number" name="price" required min="0" placeholder="25000" className="w-full p-3 border outline-none focus:border-[#1A1A1A] transition-colors" />
        </div>
      </div>

      {/* NEW FILE UPLOADERS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs font-bold text-[#1A1A1A] mb-2 uppercase">Front Image</label>
          <input type="file" name="frontImage" accept="image/*" required className="w-full p-2 border text-sm" />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#1A1A1A] mb-2 uppercase">Back Image</label>
          <input type="file" name="backImage" accept="image/*" required className="w-full p-2 border text-sm" />
        </div>
      </div>
    <div>
    <label className="block text-xs font-bold text-[#1A1A1A] mb-2 uppercase">Initial Stock</label>
    <input type="number" name="stock" required min="0" defaultValue={0} className="w-full p-3 border" />
  </div><br />
      
      <button type="submit" disabled={isPending} className="bg-[#1A1A1A] text-white px-6 py-3 text-sm font-bold uppercase tracking-wider hover:bg-[#333333] transition-colors disabled:opacity-50">
        {isPending ? "Uploading..." : "Publish Product"}
      </button>
    </form>
  );
}