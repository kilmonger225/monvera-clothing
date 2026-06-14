import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, message } = await req.json();

    // 1. Set up the transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 2. Send the email
    await transporter.sendMail({
      from: process.env.EMAIL_USER, // MUST be your email to pass Gmail security
      replyTo: email, // When you hit 'Reply' in Gmail, it goes to the customer
      to: process.env.EMAIL_USER, // Sending it to your own inbox
      subject: `Monvera Contact: ${firstName} ${lastName}`,
      text: message,
      html: `<p><strong>Name:</strong> ${firstName} ${lastName}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong> ${message}</p>`,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json({ success: false, message: "Failed to send email" }, { status: 500 });
  }
}