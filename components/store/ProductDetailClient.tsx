"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useCart } from "@/components/store/CartContext";
import { useSwipeable } from "react-swipeable";

export default function ProductDetailClient({ product }: { product: any }) {
  const { addToCart } = useCart();

  const galleryArray = product.gallery ? product.gallery.split(",") : [];
  const allImages = [product.imageFront, product.imageBack, ...galleryArray].filter(Boolean);

  const isAccessory = product.category === "accessories" || product.category === "headwear";
  const availableSizes = isAccessory ? ["One Size"] : ["S", "M", "L", "XL", "XXL"];
  
  const isOutOfStock = product.stock <= 0;

  const [activeImage, setActiveImage] = useState(allImages[0] || "");
  const [quantity, setQuantity] = useState(isOutOfStock ? 0 : 1);
  const [selectedSize, setSelectedSize] = useState<string | null>(availableSizes[0]);
  const [openSection, setOpenSection] = useState<string | null>("description");

  const handleNextImage = () => {
    const currentIndex = allImages.indexOf(activeImage);
    setActiveImage(currentIndex < allImages.length - 1 ? allImages[currentIndex + 1] : allImages[0]);
  };

  const handlePrevImage = () => {
    const currentIndex = allImages.indexOf(activeImage);
    setActiveImage(currentIndex > 0 ? allImages[currentIndex - 1] : allImages[allImages.length - 1]);
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNextImage,
    onSwipedRight: handlePrevImage,
    trackMouse: true,
  });

  const toggleSection = (section: string) => setOpenSection(openSection === section ? null : section);

  const handleIncreaseQuantity = () => {
    if (quantity < product.stock) setQuantity(quantity + 1);
    else toast.error(`Only ${product.stock} left in stock!`);
  };

  const handleDecreaseQuantity = () => { if (quantity > 1) setQuantity(quantity - 1); };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: allImages[0] || "",
      quantity: quantity,
      size: selectedSize || "One Size",
      maxStock: product.stock, 
    });
    toast.success(`${quantity}x ${product.name} (Size: ${selectedSize}) added to cart!`);
  };

  const activeIndex = Math.max(0, allImages.indexOf(activeImage));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mt-8 max-w-7xl mx-auto">
      
      {/* LEFT COLUMN: THE GALLERY */}
      <div className="flex flex-col gap-4">
        <div {...swipeHandlers} className="w-full aspect-square bg-[#F9F9F9] overflow-hidden border border-[#E5E5E5] relative group cursor-grab active:cursor-grabbing">
          {isOutOfStock && <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold uppercase tracking-widest px-4 py-2 z-20">Sold Out</div>}
          <div className="flex w-full h-full transition-transform duration-500 ease-out" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
            {allImages.length > 0 ? allImages.map((imgUrl, idx) => (
              <div key={idx} className="w-full h-full flex-shrink-0 flex items-center justify-center relative">
                <img src={imgUrl} alt={`${product.name} - View ${idx + 1}`} className={`w-full h-full object-contain ${isOutOfStock ? "opacity-75 grayscale" : ""}`} />
              </div>
            )) : <div className="w-full h-full flex-shrink-0 flex items-center justify-center text-gray-400">No Image Available</div>}
          </div>
          {allImages.length > 1 && (
            <>
              <button onClick={handlePrevImage} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-[#E5E5E5] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-[#F5F5F5] shadow-sm hidden md:flex"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg></button>
              <button onClick={handleNextImage} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-[#E5E5E5] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-[#F5F5F5] shadow-sm hidden md:flex"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg></button>
            </>
          )}
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {allImages.map((imgUrl, idx) => (
            <button key={idx} onClick={() => setActiveImage(imgUrl)} className={`w-20 h-20 flex-shrink-0 bg-[#F9F9F9] border-2 transition-all duration-200 ${activeImage === imgUrl ? "border-[#1A1A1A]" : "border-transparent opacity-60 hover:opacity-100"}`}>
              <img src={imgUrl} className={`w-full h-full object-cover ${isOutOfStock ? "grayscale" : ""}`} alt={`Thumbnail ${idx + 1}`} />
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT COLUMN: PRODUCT DETAILS */}
      <div className="flex flex-col">
        <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tight text-[#1A1A1A] mb-4">{product.name}</h1>
        <p className="text-xl font-medium text-gray-500 mb-8">₦{product.price.toLocaleString()}</p>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#1A1A1A]">{isAccessory ? "Accessory Size" : "Select Size"}</h3>
            <span className="text-sm text-gray-400">({selectedSize})</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {availableSizes.map((size) => (
              <button key={size} onClick={() => setSelectedSize(size)} disabled={isOutOfStock} className={`px-6 py-3 border text-sm font-medium transition-colors ${selectedSize === size && !isOutOfStock ? "border-[#1A1A1A] bg-[#1A1A1A] text-white" : "border-[#E5E5E5] text-[#1A1A1A] hover:border-[#1A1A1A]"} ${isOutOfStock ? "opacity-50 cursor-not-allowed bg-gray-100" : ""}`}>{size}</button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[#1A1A1A] mb-3">Quantity</h3>
          <div className={`flex items-center border border-[#E5E5E5] w-fit ${isOutOfStock ? "opacity-50 bg-gray-100" : ""}`}>
            <button onClick={handleDecreaseQuantity} disabled={isOutOfStock} className="px-4 py-3 text-lg hover:bg-[#F5F5F5] transition-colors disabled:cursor-not-allowed">−</button>
            <span className="w-12 text-center font-medium text-sm">{quantity}</span>
            <button onClick={handleIncreaseQuantity} disabled={isOutOfStock} className="px-4 py-3 text-lg hover:bg-[#F5F5F5] transition-colors disabled:cursor-not-allowed">+</button>
          </div>
        </div>

        <button onClick={handleAddToCart} disabled={isOutOfStock} className={`w-full py-4 font-bold uppercase tracking-widest transition-colors mb-4 shadow-sm ${isOutOfStock ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-[#1A1A1A] text-white hover:bg-[#333333]"}`}>
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </button>

        <a href={`https://wa.me/2347042528244?text=${encodeURIComponent(`Hi Monvera, I'm interested in a custom design for the ${product.name}. Could you help me with that?`)}`} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 py-4 border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-all font-bold uppercase tracking-widest text-xs mb-12">
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a5.494 5.494 0 0 1-2.801-.768l-.201-.118-2.08.546.555-2.028-.131-.21a5.498 5.498 0 0 1-.84-2.887c0-3.036 2.47-5.506 5.506-5.506s5.506 2.47 5.506 5.506-2.469 5.506-5.505 5.506z"/></svg>
          Request Custom Design
        </a>

        <div className="border-t border-[#E5E5E5]">
          <div className="border-b border-[#E5E5E5]"><button onClick={() => toggleSection("description")} className="w-full py-5 flex justify-between items-center text-left"><h3 className="text-sm font-bold uppercase tracking-widest text-[#1A1A1A]">Description</h3><span className="text-xl leading-none">{openSection === "description" ? "−" : "+"}</span></button>{openSection === "description" && <div className="pb-5 text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{product.description || "A structured piece built for movement and designed for presence."}</div>}</div>
          <div className="border-b border-[#E5E5E5]"><button onClick={() => toggleSection("shipping")} className="w-full py-5 flex justify-between items-center text-left"><h3 className="text-sm font-bold uppercase tracking-widest text-[#1A1A1A]">Shipping</h3><span className="text-xl leading-none">{openSection === "shipping" ? "−" : "+"}</span></button>{openSection === "shipping" && <div className="pb-5 text-sm text-gray-600 leading-relaxed flex items-center gap-4 bg-[#F9F9F9] p-4 rounded-md"><div className="text-2xl">📦</div><div><p className="font-bold text-[#1A1A1A]">Regular Package</p><p>Within Bauchi: 24hrs, Outside Bauchi: 5-7 Days</p></div></div>}</div>
          <div className="border-b border-[#E5E5E5]"><button onClick={() => toggleSection("details")} className="w-full py-5 flex justify-between items-center text-left"><h3 className="text-sm font-bold uppercase tracking-widest text-[#1A1A1A]">Product Details</h3><span className="text-xl leading-none">{openSection === "details" ? "−" : "+"}</span></button>{openSection === "details" && <div className="pb-5 text-sm text-gray-600 leading-relaxed"><ul className="list-disc pl-4 space-y-2"><li>Heavyweight construction</li><li>Custom Monvera hardware</li><li>Designed in Bauchi</li></ul></div>}</div>
        </div>
      </div>
    </div>
  );
}