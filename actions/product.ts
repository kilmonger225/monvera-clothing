"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export async function addProduct(formData: FormData) {
  try {
    // 1. Extract the text data from your dashboard form
    const name = formData.get("name") as string;
    const price = parseFloat(formData.get("price") as string);
    const stock = parseInt(formData.get("stock") as string) || 0; // Grabs your new stock counter!
    
    // Auto-generate the fields your database now requires
    const slug = name.toLowerCase().trim().replace(/[\s\W-]+/g, '-');
    const description = "Heavyweight Monvera essential."; // Default description until we add a text box for it!

    // 2. Extract the actual physical files from the form
    // Note: Your form inputs are named 'frontImage' and 'backImage'
    const frontFile = formData.get("frontImage") as File;
    const backFile = formData.get("backImage") as File;

    if (!frontFile || !backFile) throw new Error("Both images are required");

    // 3. The Engine: Converts physical files to data and saves them locally
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
      
      return `/images/${uniqueName}`;
    };

    // Save the files to the hard drive
    const frontImagePath = await saveImage(frontFile);
    const backImagePath = await saveImage(backFile);

    // 4. Command Prisma to save EVERYTHING using the exact names your new database requires
    await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        stock,
        imageFront: frontImagePath, // Mapped correctly to the new database column!
        imageBack: backImagePath,   // Mapped correctly to the new database column!
      },
    });

    // 5. Instantly refresh the storefront and dashboard
    revalidatePath("/admin/products");
    revalidatePath("/"); 
    
    return { success: true };
  } catch (error) {
    console.error("Upload Error:", error);
    return { success: false, error: "Failed to upload product" };
  }
}