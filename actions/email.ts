"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderNotification(orderData: any) {
  console.log("DEBUG: Email function triggered with data:", JSON.stringify(orderData));
  
  if (!process.env.RESEND_API_KEY) {
    console.error("DEBUG: RESEND_API_KEY is missing!");
    return { success: false, message: "Missing API Key" };
  }

  try {
    // ... rest of your code
  } catch (error: any) {
    console.error("DEBUG: CRITICAL ERROR:", error.stack); // This prints the full file path of the crash
    return { success: false, message: "Internal Error" };
  }
}

// ... Keep your existing sendStatusUpdateEmail function as is!