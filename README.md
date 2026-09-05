# Coordination - Next.js

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

## Struktura projektu

- `app/page.tsx` - układ sekcji strony głównej dostępnej pod `/`;
- `app/layout.tsx` - główny layout i metadane;
- `app/globals.css` - reset, tokeny i lokalne fonty;
- `app/api/contact/route.ts` - obsługa formularza kontaktowego;
- `components/` - sekcje strony i komponenty współdzielone; każdy komponent ma swój katalog ze stylami CSS Modules;
- `public/assets/` - grafiki i modele 3D;
- `public/fonts/` - lokalne fonty;
- `.env.example` - przykładowa konfiguracja formularza kontaktowego.
