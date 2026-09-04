import { prisma } from "./prisma";

export async function checkRateLimit(
  key: string,
  max: number,
  windowMs: number
): Promise<{ allowed: boolean; remaining: number; resetAt: Date }> {
  const windowStart = new Date(Date.now() - windowMs);
  // Cleanup old entries lazily
  try {
    await prisma.rateLimitEntry.deleteMany({ where: { key, createdAt: { lt: windowStart } } });
  } catch { /* ignore */ }

  let count = 0;
  try {
    count = await prisma.rateLimitEntry.count({ where: { key, createdAt: { gt: windowStart } } });
  } catch {
    // DB unavailable, allow
    return { allowed: true, remaining: max, resetAt: new Date(Date.now() + windowMs) };
  }

  if (count >= max) {
    // Find oldest entry in window to compute reset
    const oldest = await prisma.rateLimitEntry.findFirst({
      where: { key, createdAt: { gt: windowStart } },
      orderBy: { createdAt: "asc" },
    });
    const resetAt = oldest ? new Date(oldest.createdAt.getTime() + windowMs) : new Date(Date.now() + windowMs);
    return { allowed: false, remaining: 0, resetAt };
  }

  try {
    await prisma.rateLimitEntry.create({ data: { key } });
  } catch { /* ignore */ }

  return { allowed: true, remaining: max - count - 1, resetAt: new Date(Date.now() + windowMs) };
}

export function checkOtpRateLimit(email: string) {
  return checkRateLimit(`otp:${email}`, 5, 60 * 60 * 1000); // 5 per hour
}

// Limit OTP verification attempts to blunt brute-forcing of the 6-digit code.
export function checkVerifyRateLimit(email: string) {
  return checkRateLimit(`verify:${email}`, 10, 15 * 60 * 1000); // 10 per 15 minutes
}
