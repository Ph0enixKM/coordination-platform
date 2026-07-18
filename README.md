# Coordination — Next.js

Nowa, niezależna od WordPressa wersja strony głównej Coordination. Projekt używa Next.js App Router, TypeScript i CSS Modules. Wszystkie obrazy oraz fonty używane przez stronę są przechowywane lokalnie w `public/`.

## Uruchomienie

```bash
npm install
npm run dev
```

Strona będzie dostępna pod adresem [http://localhost:3000](http://localhost:3000).

## Weryfikacja produkcyjna

```bash
npm run lint
npm run build
npm start
```

Najważniejsze pliki:

- `app/page.tsx` — struktura i treść strony;
- `app/page.module.css` — cały layout i breakpointy;
- `app/globals.css` — reset, tokeny i lokalne fonty;
- `public/assets/` — materiały pobrane z obecnej strony.
