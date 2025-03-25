import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const POST = async (req) => {
  try {
    const body = await req.json();

    const { sender, subject, message } = body;
    console.log(sender, subject, message);
    const nodemailerConfig = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GAMIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: sender,
      subject: subject,
      text: message,
    };

    await nodemailerConfig.sendMail(mailOptions);
    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Email not sent" }, { status: 500 });
  }
};
