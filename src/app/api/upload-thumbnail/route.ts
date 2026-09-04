import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getSession } from "@/lib/auth";
import { randomUUID } from "crypto";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

// Only these types are allowed so a stored thumbnail can never be an SVG
// (which could carry embedded scripts) or any other executable-ish content.
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

const EXT_MAP: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
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

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: "File must be a JPG, PNG, WebP, GIF, or AVIF image" }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
  }

  const ext = EXT_MAP[file.type] ?? ".png";
  const filename = `thumbnails/${randomUUID()}${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  // Blob returns a permanent public URL that we store on the project. Requires
  // BLOB_READ_WRITE_TOKEN (auto-injected on Vercel; a store token for local dev).
  const blob = await put(filename, buffer, {
    access: "public",
    contentType: file.type,
  });

  return NextResponse.json({ url: blob.url });
}
