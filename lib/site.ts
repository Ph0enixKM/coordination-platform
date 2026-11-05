const PRODUCTION_URL = "https://coordination.pl";

// Dopóki coordination.pl nie jest przepięte na Workera, domena wciąż serwuje
// starą stronę, więc bezwzględne URL-e z metadanych - m.in. OG image -
// kończyłyby się tam 404. Wtedy NEXT_PUBLIC_SITE_URL ustawiamy przy buildzie
// na adres *.workers.dev. Strony są prerenderowane, więc liczy się wartość z
// czasu buildu, nie zmienna ustawiona później w Workerze.
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || PRODUCTION_URL;
