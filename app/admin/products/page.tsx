import prisma from "@/lib/prisma";
import { Package } from "lucide-react";
import AddProductForm from "../AddProductForm";
import StockManager from "@/components/admin/StockManager";

export const dynamic = "force-dynamic";

export default async function AdminProducts() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <Package size={24} className="text-[#1A1A1A]" />
        <h2 className="text-2xl font-bold text-[#1A1A1A]">Inventory Management</h2>
      </div>

      <AddProductForm />

      <div className="bg-[#FFFFFF] border border-[#E5E5E5] shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F5F5F5] border-b border-[#E5E5E5] text-sm tracking-widest uppercase text-[#1A1A1A]/70">
              <th className="p-4 font-bold">Image</th>
              <th className="p-4 font-bold">Product Name</th>
              <th className="p-4 font-bold">Price</th>
              <th className="p-4 font-bold">Adjust Stock</th>
              <th className="p-4 font-bold">Date Added</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-[#1A1A1A]/50">
                  No products in inventory.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-[#E5E5E5] hover:bg-[#F9F9F9] transition-colors"
                >
                  <td className="p-4">
                    <img
                      src={product.imageFront}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-md border border-[#E5E5E5]"
                    />
                  </td>
                  <td className="p-4 font-medium">{product.name}</td>
                  <td className="p-4 font-bold">
                    ₦{product.price.toLocaleString()}
                  </td>
                  <td className="p-4">
                    {/* The interactive Stock Manager component */}
                    <StockManager 
                      productId={product.id} 
                      currentStock={product.stock} 
                    />
                  </td>
                  <td className="p-4 text-[#1A1A1A]/70">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}