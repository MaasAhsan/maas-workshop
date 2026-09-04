import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const updateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).optional(),
  shortDesc: z.string().optional(),
  thumbnail: z.string().optional(),
  version: z.string().optional(),
  tags: z.union([z.array(z.string()), z.string()]).optional(),
  downloadUrl: httpUrl().optional(),
  repoUrl: httpUrl().optional().or(z.literal("")),
  featured: z.boolean().optional(),
});

// Only allow http/https URLs so a stored project can never point at a
// javascript: (or other executable) scheme that the download button would run.
function httpUrl() {
  return z
    .string()
    .url()
    .refine((u) => /^https?:\/\//i.test(u), "URL must use http or https");
}

function parseTags(project: any) {
  if (typeof project.tags === "string") {
    try {
      project.tags = JSON.parse(project.tags);
    } catch {
      project.tags = [];
    }
  }
  return project;
}

// Accept tags either as an array (API clients) or a JSON-encoded string (legacy form payload)
function normalizeTags(tags: unknown): string {
  let arr: string[] = [];
  if (typeof tags === "string") {
    try {
      const parsed = JSON.parse(tags);
      if (Array.isArray(parsed)) arr = parsed;
    } catch {
      arr = [];
    }
  } else if (Array.isArray(tags)) {
    arr = tags;
  }
  return JSON.stringify(arr);
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const project = await prisma.project.findUnique({
    where: { id: params.id },
  });

  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(parseTags(project));
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session.isOwner) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await prisma.project.findUnique({
    where: { id: params.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  const parsed = updateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data: Record<string, unknown> = { ...parsed.data };
  if (data.tags !== undefined) {
    data.tags = normalizeTags(data.tags);
  }
  if (data.repoUrl === "") {
    data.repoUrl = null;
  }

  const updated = await prisma.project.update({
    where: { id: params.id },
    data,
  });

  return NextResponse.json(parseTags(updated));
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session.isOwner) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await prisma.project.findUnique({
    where: { id: params.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.project.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ ok: true });
}
