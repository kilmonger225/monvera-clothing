"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { sendStatusUpdateEmail } from "@/actions/email";

export async function saveOrderToDatabase(orderDetails: any) {
  try {
    await prisma.$transaction(async (tx) => {
      // 1. Create the Order and link the OrderItems
      await (tx.order as any).create({
        data: {
          reference: orderDetails.reference,
          email: orderDetails.email,
          name: orderDetails.name,
          phone: orderDetails.phone,
          amount: orderDetails.amount,
          shippingMethod: orderDetails.shippingMethod,
          status: "Pending",
          shippingDetails: orderDetails.shippingDetails, 
          items: {
            create: orderDetails.items.map((item: any) => ({
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              size: item.size || "N/A", // Added size mapping here
            })),
          },
        },
      });

      // 2. Update stock levels
      for (const item of orderDetails.items) {
        await tx.product.update({
          where: { id: item.productId || item.id },
          data: { stock: { decrement: item.quantity } },
        });
      }
    }, 
    // ADDED: Timeout options to prevent the Neon database P2028 crash
    {
      maxWait: 15000, // 15 seconds max wait to connect
      timeout: 20000, // 20 seconds for the entire transaction to finish
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
    revalidatePath("/admin/products"); 
    return { success: true };
  } catch (error: any) {
    console.error("DETAILED DELETE ERROR:", error);
    return { success: false, message: error.message || "Database error" };
  }
}

export async function updateOrderStatus(orderId: string, newStatus: string, email: string, reference: string) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
    });

    await sendStatusUpdateEmail(email, newStatus, reference);

    revalidatePath("/admin");
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error: any) {
    console.error("Status update error:", error);
    return { success: false, message: "Status update failed" };
  }
}