import { cookies } from "next/headers";
import { getIronSession, IronSession } from "iron-session";
import { prisma } from "./prisma";

export const OWNER_EMAIL = process.env.OWNER_EMAIL || "makarimsusanto19@gmail.com";

export interface SessionData {
  email?: string;
  isOwner?: boolean;
}

export const sessionOptions = {
  password: process.env.SESSION_PASSWORD!,
  cookieName: "maas_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};

export async function getSession(): Promise<SessionData> {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  return { email: session.email, isOwner: session.isOwner };
}

export async function requireOwner(): Promise<SessionData> {
  const session = await getSession();
  if (!session.isOwner || session.email !== OWNER_EMAIL) {
    throw new Error("Unauthorized");
  }
  return session;
}

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function storeOtp(email: string, code: string): Promise<void> {
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  await prisma.otpCode.create({ data: { email, code, expiresAt } });
}

export async function verifyOtp(email: string, code: string): Promise<boolean> {
  const otp = await prisma.otpCode.findFirst({
    where: { email, code, used: false, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });
  if (!otp) return false;
  await prisma.otpCode.update({ where: { id: otp.id }, data: { used: true } });
  return true;
}

export async function invalidateAllOtps(email: string): Promise<void> {
  await prisma.otpCode.updateMany({ where: { email, used: false }, data: { used: true } });
}
