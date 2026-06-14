"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function createNewDrop(formData: FormData) {
  try {
    // 1. Extract the basic product data
    const name = formData.get("name") as string;
    const price = parseFloat(formData.get("price") as string);
    const stock = parseInt(formData.get("stock") as string);
    const category = formData.get("category") as string;
    const description = (formData.get("description") as string) || "Premium Monvera Drop";
    
    // --> NEW: Extract the gallery string from the form
    const gallery = formData.get("gallery") as string; 
    
    // 2. Generate a unique slug to prevent "Unique constraint" errors
    const baseSlug = name.toLowerCase().trim().replace(/[\s\W-]+/g, '-');
    const randomHash = Math.random().toString(36).substring(2, 7);
    const slug = `${baseSlug}-${randomHash}`;

    // 3. Extract the image URLs
    const imageFront = formData.get("frontImageUrl") as string;
    const imageBack = formData.get("backImageUrl") as string;

    if (!imageFront || !imageBack) {
      throw new Error("Both front and back images are required to drop a product.");
    }

    console.log("Saving new product:", { name, category, slug });

    // 4. Save to Database
    await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        stock,
        category,
        imageFront,
        imageBack,
        gallery, // --> NEW: Save the gallery string to the database
      },
    });

    // 5. THE FIX: Force Next.js to refresh the homepage snapshot
    revalidatePath("/"); 
    revalidatePath("/shop", "layout");
    revalidatePath("/admin/products");

    return { success: true };
  } catch (error) {
    console.error("Failed to create product:", error);
    return { success: false, message: (error as Error).message };
  }
}

export async function updateProductStock(id: string, newStock: number) {
  try {
    await prisma.product.update({
      where: { id },
      data: { stock: newStock },
    });
    
    revalidatePath("/admin/products"); 
    revalidatePath("/shop");
    
    return { success: true };
  } catch (error) {
    console.error("Failed to update stock:", error);
    return { success: false };
  }
}