import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { generateOtp } from "@/lib/auth";
import { checkOtpRateLimit } from "@/lib/rate-limit";
import { sendOtpEmail } from "@/lib/email";

const OWNER_EMAIL = process.env.OWNER_EMAIL || "makarimsusanto19@gmail.com";

const schema = z.object({ email: z.string().email() });

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const email = parsed.data.email.toLowerCase();

    if (email !== OWNER_EMAIL.toLowerCase()) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const limit = await checkOtpRateLimit(email);
    if (!limit.allowed) {
      const retryAfter = Math.ceil((limit.resetAt.getTime() - Date.now()) / 1000);
      return NextResponse.json(
        { error: "Too many requests", retryAfter, resetAt: limit.resetAt.toISOString() },
        { status: 429, headers: { "Retry-After": String(Math.max(retryAfter, 1)) } }
      );
    }

    const code = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.otpCode.create({
      data: { email, code, expiresAt },
    });

    let emailed = false;
    try {
      emailed = await sendOtpEmail(email, code);
    } catch (e) {
      console.error("send-otp email failure", e);
      // OTP row already stored, but we could not deliver it. Do not claim success.
      return NextResponse.json(
        { error: "Code was generated but the email could not be sent. Check SMTP configuration." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: emailed ? "Code sent" : "Code generated (email not configured — see server console)",
    });
  } catch (e) {
    console.error("send-otp error", e);
    return NextResponse.json({ error: "Failed to send code" }, { status: 500 });
  }
}
