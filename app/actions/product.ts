"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function addProduct(formData: FormData) {
  try {
    // 1. Extract the text data
    const name = formData.get("name") as string;
    const slug = name.toLowerCase().trim().replace(/[\s\W-]+/g, '-');
    
    // Adding a fallback in case your form doesn't have a description input yet
    const description = (formData.get("description") as string) || "Premium Monvera Drop"; 
    
    const price = parseFloat(formData.get("price") as string);
    const stock = parseInt(formData.get("stock") as string); 

    // 2. Extract the Cloudinary URL strings (No physical files here!)
    const imageFront = formData.get("frontImageUrl") as string;
    const imageBack = formData.get("backImageUrl") as string;

    if (!imageFront || !imageBack) {
      throw new Error("Both front and back images are required to drop a product.");
    }

    // 3. Command Prisma to save the complete garment profile to the Neon database
    await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        stock,
        imageFront,
        imageBack,
      },
    });

    // 4. Instantly refresh the storefront and admin panel
    revalidatePath("/shop");
    revalidatePath("/admin/products");
    
    return { success: true };
  } catch (error) {
    console.error("Failed to create product:", error);
    return { success: false };
  }
}

// --------------------------------------------------------
// Your existing stock update function remains unchanged!
// --------------------------------------------------------
export async function updateProductStock(id: string, newStock: number) {
  try {
    await prisma.product.update({
      where: { id },
      data: { stock: newStock },
    });
    
    // Refresh the pages so the new stock number shows up immediately
    revalidatePath("/admin/products"); 
    revalidatePath("/shop");
    
    return { success: true };
  } catch (error) {
    console.error("Failed to update stock:", error);
    return { success: false };
  }
}