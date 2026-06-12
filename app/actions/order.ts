"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// 🚨 COMPLETELY REMOVED THE EMAIL IMPORT FOR ISOLATION

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

    // 🔥 KILLING REVALIDATION: If this stops the crash, your shop/admin pages had bad data!
    return { success: true };
 } catch (error: any) {
  console.error("CRITICAL_BACKEND_FAILURE:", error);
  // We return the actual error string so the frontend shows us what is broken
  return { success: false, message: error.toString() };
}
}

export async function updateOrderStatus(orderId: string, newStatus: string, email: string, reference: string) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
    });
    revalidatePath("/admin");
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error: any) {
    return { success: false, message: "Status update failed" };
  }
}