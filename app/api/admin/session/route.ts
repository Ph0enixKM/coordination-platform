import { NextResponse } from "next/server";
import { adminRoute } from "@/lib/admin-auth";

/** Lets the login screen check a code before keeping it. */
export const POST = adminRoute(async () => NextResponse.json({ ok: true }));
