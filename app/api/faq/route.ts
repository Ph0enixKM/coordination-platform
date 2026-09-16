import { NextResponse } from "next/server";
import { Resend } from "resend";

/** Anything longer than this is a paste accident, not a question for us. */
const MAX_QUESTION = 4000;
const MAX_NAME = 120;
const MAX_EMAIL = 254;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readField(payload: unknown, key: string) {
  if (typeof payload !== "object" || payload === null) return "";

  const value = (payload as Record<string, unknown>)[key];

  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.CONTACT_EMAIL;

  // A missing key is our problem, not the sender's, so it never reaches them.
  if (!apiKey || !from || !to) {
    console.error(
      "Formularz FAQ: brak RESEND_API_KEY, RESEND_FROM_EMAIL lub CONTACT_EMAIL",
    );

    return NextResponse.json(
      { error: "Formularz jest chwilowo niedostępny. Napisz na kontakt@coordination.pl." },
      { status: 500 },
    );
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Nie udało się odczytać pytania." }, { status: 400 });
  }

  const name = readField(payload, "name");
  const email = readField(payload, "email");
  const question = readField(payload, "question");

  // The point of the FAQ form is anonymity, so a name is optional; an e-mail is
  // only needed when the sender wants the reply notification.
  if (email && (!EMAIL.test(email) || email.length > MAX_EMAIL)) {
    return NextResponse.json({ error: "Podaj poprawny adres e-mail." }, { status: 400 });
  }

  if (name.length > MAX_NAME) {
    return NextResponse.json({ error: "Imię jest za długie." }, { status: 400 });
  }

  if (!question) {
    return NextResponse.json({ error: "Opisz swój problem lub pytanie." }, { status: 400 });
  }

  if (question.length > MAX_QUESTION) {
    return NextResponse.json(
      { error: "Pytanie jest za długie. Zmieść się w 4000 znaków." },
      { status: 400 },
    );
  }

  const header = [
    `Imię: ${name || "(anonimowo)"}`,
    email ? `E-mail: ${email}` : "E-mail: (nie podano)",
  ];

  const resend = new Resend(apiKey);

  // The sender's address is the reply-to, so answering the notification answers
  // the person: `from` has to stay on our own verified domain.
  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: email || undefined,
    subject: `FAQ: nowe pytanie${name ? ` od ${name}` : " (anonimowe)"}`,
    text: `${header.join("\n")}\n\n${question}\n`,
  });

  if (error) {
    console.error("Formularz FAQ: Resend odrzucił wysyłkę", error);

    return NextResponse.json(
      { error: "Nie udało się wysłać pytania. Spróbuj ponownie za chwilę." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
