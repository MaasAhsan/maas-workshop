import nodemailer from "nodemailer";

const OTP_TEXT = (code: string) =>
  `Your login code is: ${code}\n\nThis code expires in 10 minutes. If you did not request this, ignore this email.`;

const OTP_HTML = (code: string) => `
  <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#0a0a0f;color:#f0f0f5;border-radius:16px;">
    <h2 style="margin:0 0 8px;font-size:18px;">Your login code</h2>
    <p style="margin:0 0 20px;color:#9a9ab0;font-size:14px;">Use this code to sign in to MAAS Workshop. It expires in 10 minutes.</p>
    <div style="background:#14141c;border:1px solid #2a2a3a;border-radius:12px;padding:20px;text-align:center;margin-bottom:20px;">
      <span style="font-size:32px;font-weight:700;letter-spacing:8px;color:#f0f0f5;">${code}</span>
    </div>
    <p style="margin:0;color:#9a9ab0;font-size:12px;">If you did not request this code, you can safely ignore this email.</p>
  </div>
`;

// Resend's free "sandbox" tier only delivers to the account owner's email and
// only from the onboarding@resend.dev identity (until you verify a real domain).
// The OTP recipient IS the owner (OWNER_EMAIL), so this works as-is.
async function sendViaResend(apiKey: string, to: string, code: string): Promise<boolean> {
  const from =
    process.env.EMAIL_FROM && process.env.EMAIL_FROM.includes("resend.dev")
      ? process.env.EMAIL_FROM
      : "MAAS Workshop <onboarding@resend.dev>";

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject: "Your MAAS Workshop login code",
        text: OTP_TEXT(code),
        html: OTP_HTML(code),
      }),
    });

    if (!res.ok) {
      console.error("[MAAS Workshop] Resend send failed:", await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("[MAAS Workshop] Resend send error:", err);
    return false;
  }
}

export async function sendOtpEmail(to: string, code: string): Promise<boolean> {
  // Option B: Resend — used when Gmail app passwords are unavailable. Takes
  // priority when the API key is set; otherwise falls through to SMTP below.
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    return sendViaResend(resendKey, to, code);
  }

  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  // No SMTP creds -> log to console (dev fallback). Keep this clearly visible so
  // it's obvious the code was NOT emailed in production.
  if (!smtpUser || !smtpPass) {
    console.log(`\n[MAAS Workshop] OTP for ${to}: ${code} (expires in 10 min)\n`);
    return false;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    secure: false,
    auth: { user: smtpUser, pass: smtpPass },
  });

  // Default the sender to the authenticated Gmail account when EMAIL_FROM is unset,
  // since Gmail SMTP requires the From address to match the authenticated user.
  const from = process.env.EMAIL_FROM || `MAAS Workshop <${smtpUser}>`;

  await transporter.sendMail({
    from,
    to,
    subject: "Your MAAS Workshop login code",
    text: OTP_TEXT(code),
    html: OTP_HTML(code),
  });

  return true;
}