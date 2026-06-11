"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderNotification(orderData: any) {
  try {
    const { reference, email, amount, items, shippingMethod, shippingDetails } = orderData;

    const { data, error } = await resend.emails.send({
      from: "Store <onboarding@resend.dev>",
      to: ["julnanv@gmail.com"], // <-- Don't forget your actual email here!
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

    if (error) return { success: false };
    return { success: true, data };
  }
   catch (error) {
  console.error("FULL EMAIL API ERROR:", error); // This will print the specific reason
  return { success: false };
}
}