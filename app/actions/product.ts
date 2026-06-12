"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

const prisma = new PrismaClient();

export async function createProduct(formData: FormData) {
  try {
    // 1. Extract the text data
    const name = formData.get("name") as string;
    const slug = name.toLowerCase().trim().replace(/[\s\W-]+/g, '-');
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const stock = parseInt(formData.get("stock") as string); // Added your stock counter!

    // 2. Extract the actual FILE objects, not just text strings
    const frontFile = formData.get("imageFront") as File;
    const backFile = formData.get("imageBack") as File;

    if (!frontFile || !backFile) {
      throw new Error("Both front and back images are required to drop a product.");
    }

    // 3. The Engine: Converts physical files to data and saves them to your /public folder
    const saveImage = async (file: File) => {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uniqueName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
      const uploadDir = path.join(process.cwd(), "public/images");
      const filePath = path.join(uploadDir, uniqueName);

      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }

      await writeFile(filePath, buffer);
      
      // Returns the clean local URL that the storefront will use to render the image
      return `/images/${uniqueName}`;
    };

    // Save the physical images and capture their new paths
    const imageFrontPath = await saveImage(frontFile);
    const imageBackPath = await saveImage(backFile);

    // 4. Command Prisma to save the complete garment profile to the database
    await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        stock,
        imageFront: imageFrontPath,
        imageBack: imageBackPath,
      },
    });

    // 5. Instantly refresh the storefront and admin panel
    revalidatePath("/shop");
    revalidatePath("/admin/products");
    
    return { success: true };
  } catch (error) {
    console.error("Failed to create product:", error);
    return { success: false };
  }
}
// Add this below your existing createProduct function
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