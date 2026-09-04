import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

async function handleDownload(id: string) {
  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.project.update({
    where: { id },
    data: { downloadCount: { increment: 1 } },
  });

  return NextResponse.json({ downloadUrl: project.downloadUrl });
}

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  return handleDownload(params.id);
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  return handleDownload(params.id);
}
