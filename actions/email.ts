"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderNotification(orderData: any) {
  console.log("DEBUG: Email function triggered.");
  
  if (!process.env.RESEND_API_KEY) {
    console.error("DEBUG: RESEND_API_KEY is missing!");
    return { success: false, message: "Missing API Key" };
  }

  try {
    const { reference, email, amount, items, shippingMethod, shippingDetails } = orderData;

    // 1. Send Admin Email
    const adminEmail = await resend.emails.send({
  from: "Monvera <orders@contact.monveraclothing.store>", 
  to: ["julnanv@gmail.com"], 
  subject: `New Order: ${reference}`,
  html: `...`
});

    // 2. Send Customer Receipt
    const customerEmail = await resend.emails.send({
      from: "Monvera <onboarding@resend.dev>",
      to: [email], 
      subject: `Your Monvera Receipt: ${reference}`,
      html: `<h1>Order Confirmed</h1><p>Thank you for your order!</p>`
    });

    // 3. Final safety check (Return success: true only if no errors occurred)
    if (adminEmail.error || customerEmail.error) {
      console.error("Resend API Error:", adminEmail.error, customerEmail.error);
      return { success: false, message: "Email API error" };
    }

    return { success: true };

  } catch (error: any) {
    console.error("DEBUG: CRITICAL EMAIL ERROR:", error.stack);
    return { success: false, message: "Internal Email Error" };
  }
}