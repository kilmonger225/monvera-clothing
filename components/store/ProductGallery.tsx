"use client";

import { useState } from "react";

export default function ProductGallery({ allImages }: { allImages: string[] }) {
  // Keep track of which image is currently selected
  const [activeImage, setActiveImage] = useState(allImages[0]);

  return (
    <div className="flex flex-col gap-4">
      {/* Main Large Image */}
      <div className="w-full aspect-square bg-[#F5F5F5] overflow-hidden">
        <img 
          src={activeImage} 
          alt="Product Detail" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnail Strip */}
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {allImages.map((image, idx) => (
          <button 
            key={idx}
            onClick={() => setActiveImage(image)}
            className={`w-20 h-20 flex-shrink-0 border-2 transition-all duration-200 ${
              activeImage === image ? "border-[#1A1A1A]" : "border-transparent opacity-60 hover:opacity-100"
            }`}
          >
            <img src={image} className="w-full h-full object-cover" alt={`Thumbnail ${idx}`} />
          </button>
        ))}
      </div>
    </div>
  );
}