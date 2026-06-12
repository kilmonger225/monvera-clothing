"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderNotification(orderData: any) {
  try {
    const { reference, email, amount, items, shippingMethod, shippingDetails } = orderData;

    // 1. THE ADMIN ALERT (Restored with your full shipping details!)
    const adminEmailPromise = resend.emails.send({
      from: "Monvera <onboarding@resend.dev>",
      to: ["julnanv@gmail.com"], 
      subject: `New Monvera Order Secured: ${reference}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1A1A1A;">
          <h1 style="text-transform: uppercase; letter-spacing: 2px;">New Order Secured 🚀</h1>
          <hr style="border: 1px solid #E5E5E5;" />
          
          <h3>Customer Details:</h3>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Name:</strong> ${shippingDetails.firstName} ${shippingDetails.lastName}</p>
          <p><strong>Phone:</strong> ${shippingDetails.phone}</p>
          
          <h3>Logistics:</h3>
          <p><strong>Delivery Route:</strong> ${shippingMethod}</p>
          <p><strong>Address:</strong> ${shippingDetails.address} ${shippingDetails.apartment ? `, ${shippingDetails.apartment}` : ""}</p>
          <p><strong>Location:</strong> ${shippingDetails.lga}, ${shippingDetails.state} State</p>

          <h3>Order Summary:</h3>
          <ul style="list-style-type: none; padding: 0;">
            ${items.map((item: any) => `
              <li style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #E5E5E5;">
                <strong>${item.quantity}x ${item.name}</strong><br/>
                Size: ${item.size}
              </li>
            `).join('')}
          </ul>
          
          <h2 style="margin-top: 20px;">Total Paid: ₦${amount / 100}</h2>
        </div>
      `,
    });

    // 2. THE CUSTOMER RECEIPT
    const customerReceiptPromise = resend.emails.send({
      from: "Monvera <onboarding@resend.dev>",
      to: [email], 
      subject: `Your Monvera Order Receipt: ${reference}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1A1A1A;">
          <h1 style="text-transform: uppercase; letter-spacing: 2px;">Order Confirmed</h1>
          <hr style="border: 1px solid #E5E5E5;" />
          <p>Hello ${shippingDetails.firstName},</p>
          <p>We have received your order and are getting it ready for dispatch. We will send you another update once it ships.</p>
          
          <h3>Order Summary (${reference}):</h3>
          <ul style="list-style-type: none; padding: 0;">
            ${items.map((item: any) => `
              <li style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #E5E5E5;">
                <strong>${item.quantity}x ${item.name}</strong> (Size: ${item.size})
              </li>
            `).join('')}
          </ul>
          
          <h2 style="margin-top: 20px;">Total Paid: ₦${amount / 100}</h2>
          <p>Thank you for shopping with Monvera.</p>
        </div>
      `,
    });

    // Fire both emails
    const [adminRes, customerRes] = await Promise.all([adminEmailPromise, customerReceiptPromise]);

    if (adminRes.error || customerRes.error) {
      console.error("Partial Email Error:", adminRes.error, customerRes.error);
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    console.error("FULL EMAIL API ERROR:", error);
    return { success: false };
  }
}

// 3. THE STATUS UPDATE
export async function sendStatusUpdateEmail(email: string, reference: string, newStatus: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Monvera <onboarding@resend.dev>",
      to: [email], 
      subject: `Monvera Order Update: ${newStatus}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1A1A1A;">
          <h1 style="text-transform: uppercase; letter-spacing: 2px;">Order Status Update</h1>
          <hr style="border: 1px solid #E5E5E5;" />
          <p>Hello,</p>
          <p>Your order (<strong>${reference}</strong>) has been updated.</p>
          <p>The current status is now: <strong style="text-transform: uppercase; padding: 4px 8px; background: #F5F5F5; border-radius: 4px;">${newStatus}</strong></p>
          <p style="margin-top: 20px;">Thank you for shopping with Monvera.</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend API Error (Status):", error);
      return { success: false };
    }

    console.log(`[EMAIL DISPATCHED] To: ${email} | Status: ${newStatus}`);
    return { success: true, data };
  } catch (error) {
    console.error("Status Email Error:", error);
    return { success: false, error: "Failed to send status email" };
  }
}