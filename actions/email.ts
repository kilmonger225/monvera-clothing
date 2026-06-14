"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
export async function sendStatusUpdateEmail(email: string, status: string, reference: string) {
  try {
    await resend.emails.send({
      from: "Monvera <orders@contact.monveraclothing.store>",
      to: [email],
      subject: `Order Update: ${reference} - ${status}`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h1>Order Update</h1>
          <p>Hello,</p>
          <p>Your order <strong>${reference}</strong> has been updated to: <strong>${status}</strong>.</p>
          <p>Thank you for shopping with Monvera!</p>
        </div>
      `
    });
    return { success: true };
  } catch (error) {
    console.error("Error sending status update:", error);
    return { success: false };
  }
}
export async function sendOrderNotification(orderData: any) {
  console.log("DEBUG: Email function triggered.");

  if (!process.env.RESEND_API_KEY) {
    console.error("DEBUG: RESEND_API_KEY is missing in environment variables!");
    return { success: false, message: "Missing API Key" };
  }

  try {
    const { reference, email, amount, items, shippingMethod, shippingDetails } = orderData;

    // 1. Send Admin Email (Styled like image_69fbf6.png)
    const adminEmail = await resend.emails.send({
      from: "Monvera <orders@contact.monveraclothing.store>",
      to: ["monveraclothingstore@gmail.com"],
      subject: `New Monvera Order Secured: ${reference}`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h1>NEW ORDER SECURED 🚀</h1>
          <hr />
          <h3>Customer Details:</h3>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Name:</strong> ${shippingDetails.firstName} ${shippingDetails.lastName}</p>
          <p><strong>Phone:</strong> ${shippingDetails.phone}</p>
          
          <h3>Logistics:</h3>
          <p><strong>Delivery Route:</strong> ${shippingMethod}</p>
          <p><strong>Address:</strong> ${shippingDetails.address}${shippingDetails.apartment ? `, ${shippingDetails.apartment}` : ""}</p>
          <p><strong>Location:</strong> ${shippingDetails.lga}, ${shippingDetails.state} State</p>

          <h3>Order Summary:</h3>
          ${items.map((item: any) => `
            <p><strong>${item.quantity}x ${item.name}</strong><br />
            Size: ${item.size || "N/A"}</p>
          `).join('')}
          <hr />
          <h2>Total Paid: ₦${amount}</h2>
        </div>
      `
    });

    // 2. Send Customer Receipt (Styled like image_699622.png)
    const customerEmail = await resend.emails.send({
      from: "Monvera <orders@contact.monveraclothing.store>",
      to: [email],
      subject: `Your Monvera Order Receipt: ${reference}`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h1 style="text-transform: uppercase;">ORDER CONFIRMED🛒</h1>
          <hr />
          <p>Hello ${shippingDetails.firstName},</p>
          <p>We have received your order and are getting it ready for dispatch. We will send you another update once it ships.</p>
          
          <h3>Order Summary (${reference}):</h3>
          ${items.map((item: any) => `
            <p><strong>${item.quantity}x ${item.name}</strong> (Size: ${item.size || "N/A"})</p>
          `).join('')}
          <hr />
          <h2>Total Paid: ₦${amount}</h2>
          <p>Thank you for shopping with Monvera.</p>
        </div>
      `
    });

    if (adminEmail.error || customerEmail.error) {
      console.error("Resend API Error:", adminEmail.error, customerEmail.error);
      return { success: false, message: "Email delivery failed" };
    }

    return { success: true };

  } catch (error: any) {
    console.error("CRITICAL EMAIL ERROR:", error);
    return { success: false, message: "Internal server error" };
  }
}