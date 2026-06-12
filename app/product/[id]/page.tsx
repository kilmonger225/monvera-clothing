import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import ProductDetailClient from "@/components/store/ProductDetailClient"; // We'll create this to handle the client-side state

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Fetch the specific product from the database
  const product = await prisma.product.findUnique({
    where: { id: id },
  });

  if (!product) {
    notFound(); // This will trigger the Next.js not-found page
  }

  // Pass the database product to a Client Component
  return <ProductDetailClient product={product} />;
}