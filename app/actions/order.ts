"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { sendStatusUpdateEmail } from "@/actions/email"; // Restored email import

export async function saveOrderToDatabase(orderDetails: any) {
  try {
    await prisma.$transaction(async (tx) => {
      await tx.order.create({
        data: {
          reference: orderDetails.reference,
          email: orderDetails.email,
          amount: orderDetails.amount / 100,
          shippingMethod: orderDetails.shippingMethod,
          status: "Pending",
        },
      });

      for (const item of orderDetails.items) {
        await tx.product.update({
          where: { id: item.productId || item.id },
          data: { stock: { decrement: item.quantity } },
        });
      }
    });

    return { success: true };
  } catch (error: any) {
    console.error("CRITICAL_BACKEND_FAILURE:", error);
    return { success: false, message: error.toString() };
  }
}

export async function deleteProduct(productId: string) {
  try {
    await prisma.product.delete({
      where: { id: productId },
    });
    
    // Update the path where your products are listed
    revalidatePath("/admin/products"); 
    return { success: true };
  } catch (error) {
    console.error("Failed to delete product:", error);
    return { success: false, message: "Could not delete product." };
  }}

export async function updateOrderStatus(orderId: string, newStatus: string, email: string, reference: string) {
  try {
    // 1. Update the database
    await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
    });

    // 2. Trigger the status update email
    await sendStatusUpdateEmail(email, newStatus, reference);

    revalidatePath("/admin");
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error: any) {
    console.error("Status update error:", error);
    return { success: false, message: "Status update failed" };
  }
}