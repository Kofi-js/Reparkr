import { Resend } from "resend";
import * as React from "react";
import EmailTemplate from "@/components/email-template";

const resend = new Resend(process.env.NEXT_RESEND_API);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, plate } = body;

    // Validate input
    if (!email || !plate) {
      return Response.json(
        { error: "Email and plate are required" },
        { status: 400 }
      );
    }

    // Send email to admin inbox
    const { data, error } = await resend.emails.send({
      from: "Reparkr <onboarding@resend.dev>",
      to: ["vwegbakofi@gmail.com"],
      subject: "ReParkr Notification",
      react: EmailTemplate({
        username: email.split("@")[0],
        plate,
      }) as React.ReactElement,
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json({
      success: true,
      message: "Email sent successfully",
      data,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}