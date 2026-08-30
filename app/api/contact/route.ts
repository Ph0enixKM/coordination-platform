import { NextResponse } from "next/server";
import { Resend } from "resend";

/** Anything longer than this is a paste accident, not a question for us. */
const MAX_MESSAGE = 4000;
const MAX_EMAIL = 254;
const MAX_PHONE = 32;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readFlag(payload: unknown, key: string) {
  if (typeof payload !== "object" || payload === null) return false;

  return (payload as Record<string, unknown>)[key] === true;
}

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
      "Formularz kontaktowy: brak RESEND_API_KEY, RESEND_FROM_EMAIL lub CONTACT_EMAIL",
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
    return NextResponse.json({ error: "Nie udało się odczytać wiadomości." }, { status: 400 });
  }

  const email = readField(payload, "email");
  const phone = readField(payload, "phone");
  const message = readField(payload, "message");
  const consent = readFlag(payload, "consent");
  const newsletter = readFlag(payload, "newsletter");

  if (!EMAIL.test(email) || email.length > MAX_EMAIL) {
    return NextResponse.json({ error: "Podaj poprawny adres e-mail." }, { status: 400 });
  }

  if (!phone) {
    return NextResponse.json({ error: "Podaj numer telefonu." }, { status: 400 });
  }

  if (phone.length > MAX_PHONE) {
    return NextResponse.json({ error: "Podaj krótszy numer telefonu." }, { status: 400 });
  }

  // Without the data-processing consent there is nothing we may do with any of
  // this, so it never leaves the route.
  if (!consent) {
    return NextResponse.json(
      { error: "Potrzebujemy zgody na przetwarzanie danych." },
      { status: 400 },
    );
  }

  if (!message) {
    return NextResponse.json({ error: "Napisz treść wiadomości." }, { status: 400 });
  }

  if (message.length > MAX_MESSAGE) {
    return NextResponse.json(
      { error: "Wiadomość jest za długa. Zmieść się w 4000 znaków." },
      { status: 400 },
    );
  }

  const header = [
    `Nadawca: ${email}`,
    `Telefon: ${phone}`,
    `Zgoda na przetwarzanie danych: ${consent ? "tak" : "nie"}`,
    `Newsletter: ${newsletter ? "tak" : "nie"}`,
  ];

  const resend = new Resend(apiKey);

  // The sender's address is the reply-to, so answering the notification answers
  // the person: `from` has to stay on our own verified domain.
  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: email,
    subject: `Porozmawiajmy: wiadomość od ${email}`,
    text: `${header.join("\n")}\n\n${message}\n`,
  });

  if (error) {
    console.error("Formularz kontaktowy: Resend odrzucił wysyłkę", error);

    return NextResponse.json(
      { error: "Nie udało się wysłać wiadomości. Spróbuj ponownie za chwilę." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
