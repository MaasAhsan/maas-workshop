import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { z } from "zod";
import { OWNER_EMAIL, SessionData, sessionOptions, verifyOtp, invalidateAllOtps } from "@/lib/auth";
import { checkVerifyRateLimit } from "@/lib/rate-limit";

const schema = z.object({ email: z.string().email(), code: z.string().length(6) });

export async function POST(req: Request) {
  try {
    const body = schema.safeParse(await req.json());
    if (!body.success) return NextResponse.json({ error: "Invalid code" }, { status: 400 });

    const { email, code } = body.data;
    if (email.toLowerCase() !== OWNER_EMAIL.toLowerCase()) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // Throttle verification attempts to prevent brute-forcing the 6-digit code.
    const limit = await checkVerifyRateLimit(email.toLowerCase());
    if (!limit.allowed) {
      const retryAfter = Math.ceil((limit.resetAt.getTime() - Date.now()) / 1000);
      return NextResponse.json(
        { error: "Too many attempts, please try again later", retryAfter },
        { status: 429, headers: { "Retry-After": String(Math.max(retryAfter, 1)) } }
      );
    }

    const ok = await verifyOtp(email.toLowerCase(), code);
    if (!ok) return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });

    await invalidateAllOtps(email.toLowerCase());

    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    session.email = email.toLowerCase();
    session.isOwner = true;
    await session.save();

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("verify-otp error", e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
