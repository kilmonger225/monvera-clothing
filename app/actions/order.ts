"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
// Import the email function we will use for notifications
import { sendStatusUpdateEmail } from "@/actions/email";
import StatusSelect from "@/components/admin/StatusSelect";
export async function saveOrderToDatabase(orderDetails: any) {
  try {
    // We use a transaction so the order is saved AND the stock is reduced together
    const result = await prisma.$transaction(async (tx) => {
      
      // 1. Save the order record
      const newOrder = await tx.order.create({
        data: {
          reference: orderDetails.reference,
          email: orderDetails.email,
          amount: orderDetails.amount / 100,
          shippingMethod: orderDetails.shippingMethod,
          status: "Pending",
        },
      });

      // 2. THIS IS THE LOOP THAT UPDATES YOUR STOCK
      // Check if your cart items use 'id' or 'productId'
      for (const item of orderDetails.items) {
        await tx.product.update({
          where: { id: item.productId || item.id }, // Uses whichever property your item has
          data: {
            stock: { decrement: item.quantity },
          },
        });
      }

      return newOrder;
    });

    revalidatePath("/admin");
    revalidatePath("/admin/orders");
    revalidatePath("/");
    revalidatePath("/shop");

    return { success: true, order: result };
  } catch (error) {
    console.error("Database Save Error:", error);
    return { success: false, error: "Failed to save order and update stock" };
  }
}

// NEW FUNCTION: Updates the database and triggers the email
export async function updateOrderStatus(orderId: string, newStatus: string, email: string, reference: string) {
  try {
    // 1. Update the database record
    await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
    });

    // 2. Fire off the email notification to the customer
    await sendStatusUpdateEmail(email, reference, newStatus);

    // 3. Refresh the admin dashboard caches
    revalidatePath("/admin");
    revalidatePath("/admin/orders");
    
    return { success: true };
  } catch (error) {
    console.error("Status Update Error:", error);
    return { success: false, error: "Failed to update status" };
  }
}
