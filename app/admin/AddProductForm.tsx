"use client";

import { useRef, useState, useTransition } from "react";
import { createNewDrop } from "@/app/shopActions";
import { CldUploadWidget } from "next-cloudinary";
import toast from "react-hot-toast";

export default function AddProductForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  const [frontImage, setFrontImage] = useState("");
  const [backImage, setBackImage] = useState("");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  const handleSubmit = (formData: FormData) => {
    if (!frontImage || !backImage) {
      toast.error("Please upload both front and back images first.");
      return;
    }

    formData.append("frontImageUrl", frontImage);
    formData.append("backImageUrl", backImage);
    formData.append("gallery", galleryImages.join(","));

    startTransition(async () => {
      const res = await createNewDrop(formData);
      
      if (res.success) {
        toast.success("Product and images uploaded!");
        formRef.current?.reset(); 
        setFrontImage(""); 
        setBackImage("");
        setGalleryImages([]);
      } else {
        toast.error(`Error: ${(res as any).message || "Failed to upload product"}`); 
      }
    });
  };

  return (
    <form ref={formRef} action={handleSubmit} className="bg-[#FFFFFF] p-6 border border-[#E5E5E5] shadow-sm mb-8">
      <h3 className="text-sm font-bold text-[#1A1A1A]/70 uppercase tracking-widest mb-4">Add New Drop</h3>
      
      {/* 1. Name and Price */}
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

      {/* 2. Front and Back Main Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs font-bold text-[#1A1A1A] mb-2 uppercase">Front Image</label>
          <CldUploadWidget 
            uploadPreset="monvera_drops" 
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

        <div>
          <label className="block text-xs font-bold text-[#1A1A1A] mb-2 uppercase">Back Image</label>
          <CldUploadWidget 
            uploadPreset="monvera_drops" 
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

      {/* 3. Category, Stock, and Description */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs font-bold text-[#1A1A1A] mb-2 uppercase">Category</label>
          <select 
            name="category" 
            required 
            defaultValue="tees"
            className="w-full p-3 border bg-[#FFFFFF] outline-none focus:border-[#1A1A1A] transition-colors cursor-pointer text-sm"
          >
            <option value="tees">Tees</option>
            <option value="hoodies">Hoodies</option>
            <option value="sweatpants">Sweatpants / Joggers</option>
            <option value="shorts">Mesh Shorts</option>
            <option value="cargos">Cargos / Pants</option>
            <option value="outerwear">Outerwear / Jackets</option>
            <option value="gym-wears">Gym Wears</option>
            <option value="headwear">Headwear / Hats</option>
            <option value="accessories">Accessories</option>
            <option value="archive">The Archive</option>
          </select>
        </div>
        
        <div>
          <label className="block text-xs font-bold text-[#1A1A1A] mb-2 uppercase">Initial Stock</label>
          <input type="number" name="stock" required min="0" className="w-full p-3 border outline-none focus:border-[#1A1A1A] transition-colors" />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-xs font-bold text-[#1A1A1A] mb-2 uppercase">Description & Details</label>
        <textarea 
          name="description" 
          rows={3} 
          placeholder="Heavyweight construction. True to size. Designed in Lagos." 
          className="w-full p-3 border outline-none focus:border-[#1A1A1A] transition-colors text-sm"
        />
      </div>

      {/* 4. The Detail Shots (Gallery) */}
      <div className="mb-6 pt-4 border-t border-gray-100">
        <label className="block text-xs font-bold text-[#1A1A1A] mb-2 uppercase">Detail Shots (Gallery)</label>
        <p className="text-xs text-gray-500 mb-3">Upload detail shots like tags, embroidery, or models. You can select multiple images at once.</p>
        
        <CldUploadWidget 
          uploadPreset="monvera_drops" 
          options={{ multiple: true }}
          onSuccess={(result: any) => {
            setGalleryImages((prev) => [...prev, result.info.secure_url]);
          }}
        >
          {({ open }) => (
            <button type="button" onClick={() => open()} className="w-full p-3 border border-dashed border-gray-300 text-sm font-bold text-gray-600 bg-[#FAFAFA] hover:bg-[#F0F0F0] transition-colors">
              + Add Detail Shots
            </button>
          )}
        </CldUploadWidget>

        {galleryImages.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {galleryImages.map((url, index) => (
              <img key={index} src={url} alt={`Gallery shot ${index + 1}`} className="h-16 w-16 object-cover border border-gray-200" />
            ))}
          </div>
        )}
      </div>

      {/* 5. Submit Button */}
      <button type="submit" disabled={isPending} className="bg-[#1A1A1A] text-white px-6 py-3 text-sm font-bold uppercase tracking-wider hover:bg-[#333333] transition-colors disabled:opacity-50 w-full">
        {isPending ? "Publishing..." : "Publish Product"}
      </button>
    </form>
  );
}