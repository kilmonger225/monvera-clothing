import prisma from "@/lib/prisma";
import ProductCard from "@/components/store/ProductCard";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;

  // 1. Define your valid categories to prevent broken links
  const validCategories = ["tees", "hoodies", "accessories"];
  
  if (!validCategories.includes(category.toLowerCase())) {
    notFound(); // Triggers a 404 if someone types /shop/shoes
  }

  // 2. Fetch only products that match this specific category
  const products = await prisma.product.findMany({
    where: { 
      category: {
        equals: category,
        mode: "insensitive" // Makes it ignore uppercase/lowercase differences
      }
    },
    orderBy: { createdAt: "desc" },
  });

  // 3. Format the title nicely (e.g., "tees" becomes "Tees")
  const pageTitle = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <div className="min-h-screen bg-[#FFFFFF] px-6 py-12 lg:px-12 xl:px-20">
      <div className="max-w-7xl mx-auto">
        
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-[#1A1A1A] mb-2">
          {pageTitle}
        </h1>
        <p className="text-[#1A1A1A]/70 mb-12 uppercase tracking-widest text-sm font-bold">
          Monvera Collection
        </p>

        {products.length === 0 ? (
          <div className="py-20 text-center border border-[#E5E5E5] bg-[#F5F5F5]">
            <p className="text-[#1A1A1A]/60 font-medium uppercase tracking-widest text-sm">
              No {category} currently available. Check back later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
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
        )}
      </div>
    </div>
  );
}