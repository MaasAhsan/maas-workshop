import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session.isOwner) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { ids } = body as { ids: unknown };

  if (!Array.isArray(ids) || !ids.every((id) => typeof id === "string")) {
    return NextResponse.json({ error: "Invalid ids" }, { status: 400 });
  }

  await prisma.$transaction(
    ids.map((id, index) =>
      prisma.project.update({
        where: { id },
        data: { order: index },
      })
    )
  );

  return NextResponse.json({ ok: true });
}
