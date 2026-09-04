import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { prisma } from "@/lib/prisma";
import { sessionOptions, type SessionData } from "@/lib/auth";
import { z } from "zod";

const createSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  shortDesc: z.string().optional(),
  thumbnail: z.string().optional(),
  version: z.string().optional(),
  tags: z.union([z.array(z.string()), z.string()]).optional(),
  downloadUrl: httpUrl(),
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

export async function GET() {
  const projects = await prisma.project.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(projects.map(parseTags));
}

export async function POST(req: NextRequest) {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  if (!session.isOwner) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = createSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const maxOrder = await prisma.project.aggregate({ _max: { order: true } });
  const nextOrder = (maxOrder._max.order ?? -1) + 1;

  const data: Record<string, unknown> = {
    ...parsed.data,
    order: nextOrder,
  };

  if (data.tags !== undefined) {
    data.tags = normalizeTags(data.tags);
  }

  // Normalize empty repoUrl to null so Prisma optional field stays clean
  if (data.repoUrl === "") {
    data.repoUrl = null;
  }

  const created = await prisma.project.create({ data: data as any });

  return NextResponse.json(parseTags(created), { status: 201 });
}
