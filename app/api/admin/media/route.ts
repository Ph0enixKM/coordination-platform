import { NextResponse } from "next/server";
import { adminRoute } from "@/lib/admin-auth";
import { acceptsType, listMedia, MAX_UPLOAD_BYTES, storeImage } from "@/lib/media";

/** The media library: every stored image, newest first. */
export const GET = adminRoute(async () => NextResponse.json({ media: await listMedia() }));

/** Takes one image as `file` in multipart form data and answers with the stored WebP. */
export const POST = adminRoute(async (request) => {
  const form = await request.formData().catch(() => null);
  const file = form?.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Brak pliku w polu „file”." }, { status: 400 });
  }

  if (!acceptsType(file.type)) {
    return NextResponse.json({ error: "Obsługiwane formaty: PNG, JPG, WebP, GIF, AVIF i SVG." }, { status: 415 });
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: "Plik jest za duży. Limit to 25 MB." }, { status: 413 });
  }

  const alt = typeof form?.get("alt") === "string" ? String(form.get("alt")) : "";
  const image = await storeImage(new Uint8Array(await file.arrayBuffer()), file.name, file.type, alt);

  return NextResponse.json({ image }, { status: 201 });
});
