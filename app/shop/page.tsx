import prisma from "@/lib/prisma";
import ProductCard from "@/components/store/ProductCard";

// Always fetch fresh data
export const dynamic = "force-dynamic";

export default async function ShopPage() {
  // 1. Fetch live data from the database
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="w-full bg-[#FFFFFF] min-h-screen pb-24">
      {/* Header Banner */}
      <div className="w-full bg-[#F5F5F5] py-16 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1A1A1A] mb-4">The Collection</h1>
        <p className="text-[#1A1A1A]/70 font-medium max-w-xl mx-auto">
          Heavyweight essentials engineered for the modern wardrobe. Uncompromising quality in every thread.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12">
        {/* Product Count */}
        <div className="mb-8 pb-4 border-b border-[#E5E5E5]">
          <span className="text-sm font-medium text-[#1A1A1A]/70">{products.length} Products</span>
        </div>

        {/* Product Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {products.map((product) => (
  <div key={product.id}>
    <ProductCard 
  key={product.id}
  id={product.id}
  name={product.name}
  price={product.price}
  imageFront={product.imageFront}
  imageBack={product.imageBack}
  stock={product.stock} // Pass this here
/>
  </div>
))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-2">No products found</h2>
            <p className="text-[#1A1A1A]/70 font-medium">Check back soon for new drops.</p>
          </div>
        )}
      </div>
    </div>
  );
}