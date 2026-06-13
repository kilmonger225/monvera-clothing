import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import ProductDetailClient from "@/components/store/ProductDetailClient"; 
import BackButton from "@/./components/store/BackButton"; // Import our new client component

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Fetch the specific product from the database
  const product = await prisma.product.findUnique({
    where: { id: id },
  });

  if (!product) {
    notFound(); // This will trigger the Next.js not-found page
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF] p-6 lg:p-12 xl:p-20">
      <BackButton />
      {/* Pass the database product to a Client Component */}
      <ProductDetailClient product={product} />
    </div>
  );
}