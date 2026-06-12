import prisma from "@/lib/prisma";
import ProductCard from "@/components/store/ProductCard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main>
      {/* 1. HERO SECTION */}
      <section className="relative h-[70vh] flex items-center justify-center bg-gray-900">
        {/* Replace with your own hero image path */}
        <img 
          src="/images/hero-banner.jpeg"
          className="absolute inset-0 w-full h-full object-cover opacity-70" 
          alt="Monvera Hero"
        />
        <div className="relative z-10 text-center text-white p-6">
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-4">Monvera.</h1>
          <p className="text-xl md:text-2xl mb-8 font-medium uppercase tracking-widest">Heavyweight essentials, redefined.</p>
          <a href="/shop" className="bg-white text-black px-10 py-4 font-bold uppercase hover:bg-gray-200 transition">
            Shop The Drop
          </a>
        </div>
      </section>

      {/* 2. PRODUCT GRID */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-2xl font-bold uppercase tracking-widest mb-12 text-center">Latest Arrivals</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard 
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              imageFront={product.imageFront}
              imageBack={product.imageBack}
              stock={product.stock}
            />
          ))}
        </div>
      </div>

      {/* 4. BRAND STORY SECTION */}
      <section className="py-20 px-6 text-center bg-[#F9F9F9]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold uppercase mb-8">Our Philosophy</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            At Monvera, we believe clothing should be more than just fabric. 
            It is an identity. Crafted with precision in Nigeria, our pieces 
            are designed to stand the test of time, blending heavyweight 
            durability with minimalist streetwear aesthetics.
          </p>
        </div>
      </section>
    </main>
  );
}