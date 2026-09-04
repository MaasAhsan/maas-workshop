import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

const EXT_MAP: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/svg+xml": ".svg",
  "image/avif": ".avif",
};

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session.isOwner) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "File must be an image" }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
  }

  const ext =
    EXT_MAP[file.type] ?? path.extname(file.name) ?? ".png";
  const filename = `${randomUUID()}${ext}`;
  const uploadsDir = path.join(process.cwd(), "public", "uploads");

  await mkdir(uploadsDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadsDir, filename), buffer);

  return NextResponse.json({ url: `/uploads/${filename}` });
}
