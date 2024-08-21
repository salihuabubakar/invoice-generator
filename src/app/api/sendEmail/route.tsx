import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const { to, subject, html } = await req.json();

    // Create a transporter object with the SMTP server details
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.ethereal.email",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.NEXT_PUBLIC_G_USER, // Your email
        pass: process.env.NEXT_PUBLIC_G_KEY, // Your email password or app-specific password
      },
    });

    const mailOptions = {
      from: 'MeekElite Cleaning Services <onboarding@resend.dev>', // Sender address
      to: to, // List of receivers (can be an array)
      subject: subject, // Subject line
      html: html, // HTML body content
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Email sent successfully!', info }, { status: 201 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Error sending email', details: (error as Error).message }, { status: 500 });
  }
}

