"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addProduct(formData: FormData) {
  try {
    // 1. Extract the text data
    const name = formData.get("name") as string;
    const price = parseFloat(formData.get("price") as string);
    const stock = parseInt(formData.get("stock") as string) || 0;
    
    // Auto-generate fields
    const slug = name.toLowerCase().trim().replace(/[\s\W-]+/g, '-');
    const description = "Heavyweight Monvera essential.";

    // 2. Extract the Cloudinary URL strings from the frontend
    const frontImageUrl = formData.get("frontImage") as string;
    const backImageUrl = formData.get("backImage") as string;

    if (!frontImageUrl || !backImageUrl) {
        throw new Error("Both front and back images are required");
    }

    // 3. Command Prisma to save the URLs directly using your exact database column names
    await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        stock,
        imageFront: frontImageUrl, // Mapped to the Cloudinary string
        imageBack: backImageUrl,   // Mapped to the Cloudinary string
      },
    });

    // 4. Instantly refresh the storefront and dashboard
    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath("/"); 
    
    return { success: true };
  } catch (error: any) {
    console.error("🔥 FATAL DATABASE ERROR 🔥:", error);
    return { success: false, message: error.message || "Failed to upload product" };
  }
}