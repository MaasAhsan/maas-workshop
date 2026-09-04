import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/auth";

export async function GET() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  return NextResponse.json({ isOwner: !!session.isOwner, email: session.email || null });
}
