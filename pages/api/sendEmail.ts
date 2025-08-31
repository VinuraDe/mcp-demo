import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import sgMail from "@sendgrid/mail";

const SENDGRID_KEY = process.env.SENDGRID_API_KEY;

interface EmailRequestBody {
  to: string;
  subject: string;
  body: string;
}

interface ApiResponse {
  ok?: boolean;
  provider?: "sendgrid" | "smtp";
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { to, subject, body } = req.body as Partial<EmailRequestBody>;
  if (!to || !subject || !body) {
    return res.status(400).json({ error: "to, subject and body are required" });
  }

  try {
    if (SENDGRID_KEY) {
      sgMail.setApiKey(SENDGRID_KEY);
      await sgMail.send({
        to,
        from: process.env.SMTP_USER || "no-reply@example.com",
        subject,
        text: body,
      });
      return res.json({ ok: true, provider: "sendgrid" });
    }

    // --- SMTP branch ---
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
      return res.status(500).json({
        error:
          "SMTP not configured (set SMTP_HOST, SMTP_USER, SMTP_PASS) or set SENDGRID_API_KEY",
      });
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    await transporter.sendMail({ from: user, to, subject, text: body });
    return res.json({ ok: true, provider: "smtp" });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message || "Send failed" });
  }
}
