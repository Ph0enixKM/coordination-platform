import { NextResponse } from "next/server";

/**
 * The admin panel has a single shared code, `ADMIN_CODE`. The browser keeps it
 * after a successful login and sends it as `Authorization: Bearer <code>`.
 */
export async function isAdmin(request: Request) {
  const code = process.env.ADMIN_CODE;
  const match = /^Bearer\s+(.+)$/i.exec(request.headers.get("authorization") ?? "");

  if (!code || !match) return false;

  // Comparing digests keeps the time taken independent of where the guess goes wrong.
  const [given, expected] = await Promise.all([digest(match[1].trim()), digest(code)]);
  let difference = 0;

  for (let index = 0; index < expected.length; index++) difference |= given[index] ^ expected[index];

  return difference === 0;
}

async function digest(text: string) {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)));
}

export function unauthorized() {
  return NextResponse.json({ error: "Nieprawidłowy kod dostępu." }, { status: 401 });
}

/** Wraps an admin route handler so it only runs for a valid code. */
export function adminRoute<Context>(handler: (request: Request, context: Context) => Promise<Response>) {
  return async (request: Request, context: Context) => {
    if (!(await isAdmin(request))) {
      // Slows down guessing the code; a real visitor only waits once.
      await new Promise((resolve) => setTimeout(resolve, 600));

      return unauthorized();
    }

    try {
      return await handler(request, context);
    } catch (error) {
      console.error("Panel administracyjny:", error);

      return NextResponse.json({ error: "Coś poszło nie tak po stronie serwera." }, { status: 500 });
    }
  };
}
