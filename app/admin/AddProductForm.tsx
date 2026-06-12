"use client";

import { useRef, useState, useTransition } from "react";
import { addProduct } from "@/actions/product"; 
import { CldUploadWidget } from "next-cloudinary";
import toast from "react-hot-toast";

export default function AddProductForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  // State to hold our Cloudinary URLs
  const [frontImage, setFrontImage] = useState("");
  const [backImage, setBackImage] = useState("");

  const handleSubmit = (formData: FormData) => {
    // 1. Validation check
    if (!frontImage || !backImage) {
      toast.error("Please upload both front and back images first.");
      return;
    }

    // 2. Add the URLs to the form data
    formData.append("frontImageUrl", frontImage);
    formData.append("backImageUrl", backImage);

    // 3. Send to server
    startTransition(async () => {
      const res = await addProduct(formData);
      
      if (res.success) {
        toast.success("Product and images uploaded!");
        formRef.current?.reset(); 
        setFrontImage(""); // Clear images
        setBackImage("");
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* FRONT IMAGE UPLOADER */}
        <div>
          <label className="block text-xs font-bold text-[#1A1A1A] mb-2 uppercase">Front Image</label>
          <CldUploadWidget 
            uploadPreset="YOUR_UPLOAD_PRESET" 
            onSuccess={(result: any) => setFrontImage(result.info.secure_url)}
          >
            {({ open }) => (
              <button type="button" onClick={() => open()} className={`w-full p-3 border text-sm font-bold transition-colors ${frontImage ? "bg-[#F5F5F5] border-green-500 text-green-700" : "bg-[#FFFFFF] hover:bg-[#F5F5F5]"}`}>
                {frontImage ? "✓ Front Image Uploaded" : "Upload Front Image"}
              </button>
            )}
          </CldUploadWidget>
          {frontImage && <img src={frontImage} alt="Front preview" className="mt-2 h-20 w-20 object-cover border" />}
        </div>

        {/* BACK IMAGE UPLOADER */}
        <div>
          <label className="block text-xs font-bold text-[#1A1A1A] mb-2 uppercase">Back Image</label>
          <CldUploadWidget 
            uploadPreset="YOUR_UPLOAD_PRESET" 
            onSuccess={(result: any) => setBackImage(result.info.secure_url)}
          >
            {({ open }) => (
              <button type="button" onClick={() => open()} className={`w-full p-3 border text-sm font-bold transition-colors ${backImage ? "bg-[#F5F5F5] border-green-500 text-green-700" : "bg-[#FFFFFF] hover:bg-[#F5F5F5]"}`}>
                {backImage ? "✓ Back Image Uploaded" : "Upload Back Image"}
              </button>
            )}
          </CldUploadWidget>
          {backImage && <img src={backImage} alt="Back preview" className="mt-2 h-20 w-20 object-cover border" />}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-xs font-bold text-[#1A1A1A] mb-2 uppercase">Initial Stock</label>
        <input type="number" name="stock" required min="0" defaultValue={0} className="w-full p-3 border outline-none focus:border-[#1A1A1A] transition-colors" />
      </div>
      
      <button type="submit" disabled={isPending} className="bg-[#1A1A1A] text-white px-6 py-3 text-sm font-bold uppercase tracking-wider hover:bg-[#333333] transition-colors disabled:opacity-50">
        {isPending ? "Publishing..." : "Publish Product"}
      </button>
    </form>
  );
}