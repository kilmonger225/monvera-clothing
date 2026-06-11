"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function createProduct(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    // Automatically generate a URL-friendly slug from the product name
    const slug = name.toLowerCase().trim().replace(/[\s\W-]+/g, '-');
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const imageFront = formData.get("imageFront") as string;
    const imageBack = formData.get("imageBack") as string;

    // Command Prisma to save the new garment to your Neon database
    await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        imageFront,
        imageBack,
      },
    });

    // Tell Next.js to instantly refresh the public shop page so the new item appears
    revalidatePath("/shop");
    
    return { success: true };
  } catch (error) {
    console.error("Failed to create product:", error);
    return { success: false };
  }
}