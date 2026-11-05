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

## Cloudflare Workers

Strona jest hostowana na Cloudflare Workers przez adapter [OpenNext](https://opennext.js.org/cloudflare). Konfiguracja Workera jest w `wrangler.jsonc`, adaptera w `open-next.config.ts`.

```bash
npm run preview   # build i podgląd w lokalnym runtime Workers (workerd)
npm run deploy    # build i wdrożenie na Cloudflare
```

- `npm run preview` i `npm run deploy` wywołują `next build` w `.next`, więc nie odpalaj ich obok działającego `npm run dev`, bo nadpiszą mu pliki.
- Klucze Resend ustawia się w Workerze: `npx wrangler secret put RESEND_API_KEY` (tak samo `RESEND_FROM_EMAIL` i `CONTACT_EMAIL`). Zmienne do lokalnego podglądu Workera trzymamy w `.dev.vars`.
- `NEXT_PUBLIC_SITE_URL` musi być ustawione w czasie buildu, bo strony są prerenderowane. Dopóki coordination.pl nie jest przepięte, wpisz adres `*.workers.dev`.
- `next/image` optymalizuje obrazy przez binding Cloudflare Images (`IMAGES`).
- Cache stron trzyma się w statycznych assetach Workera, bez R2. Jeśli dojdzie ISR (`revalidate`), trzeba przejść na cache R2.

## Blog i panel `/admin`

Wpisy bloga leżą w bazie: na Cloudflare w D1 (binding `DB`), a w `npm run dev` w lokalnym pliku SQLite `.data/blog.sqlite` (wbudowany `node:sqlite`, migracje z `migrations/` aplikują się same). Zdjęcia trafiają do Workers KV (binding `MEDIA`), lokalnie do `.data/media/`, i są serwowane pod `/media/...`. KV zamiast R2, bo R2 wymaga podpięcia karty do konta, a KV jest w darmowym planie (do 25 MiB na plik, 1 GB, 1000 zapisów dziennie).

- Opublikowane wpisy są pod `/<slug>`, tak jak w WordPressie (stare adresy z `/` na końcu przekierowują 308), a lista z paginacją pod `/wiedza`. Obie strony i `sitemap.xml` renderują się przy każdym żądaniu z bazy, więc zmiana w panelu jest widoczna od razu. Wpis z datą publikacji w przyszłości pojawi się dopiero wtedy.
- Panel jest pod `/admin`. Logowanie kodem `ADMIN_CODE` z `.env` (lokalnie) albo z sekretu Workera. Po zalogowaniu kod zostaje w `localStorage` i idzie do API jako `Authorization: Bearer <kod>`.
- Edytor układa treść w wiersze z kolumnami (1-4) i bloki tekstu lub zdjęć. Treść zapisuje się jako JSON w `posts.content` (typy w `lib/blog/content.ts`).
- Każde wgrane zdjęcie jest konwertowane do WebP (jakość 80, dłuższy bok najwyżej 1920 px): na Cloudflare przez binding `IMAGES`, lokalnie przez `sharp`. SVG zostają bez zmian.
- Import eksportu z WordPressa (`coordination wpisy/blog/posts`) idzie przez API, więc działa tak samo lokalnie i na produkcji. Ponowne uruchomienie aktualizuje wpisy (po `wp_id`) i nie wgrywa zdjęć drugi raz:

```bash
npm run blog:import                                              # do działającego npm run dev
npm run blog:import -- --url https://<adres-workera> --code <ADMIN_CODE>
```

Pierwsze wdrożenie na Cloudflare:

```bash
npx wrangler d1 create coordination        # database_id wpisz w wrangler.jsonc
npx wrangler kv namespace create coordination-media   # id wpisz w wrangler.jsonc
npm run db:migrate:remote
npx wrangler secret put ADMIN_CODE
```

Do `npm run preview` potrzebne są `npm run db:migrate:local` i `ADMIN_CODE` w `.dev.vars`.

## Struktura projektu

- `app/page.tsx` - układ sekcji strony głównej dostępnej pod `/`;
- `app/layout.tsx` - główny layout i metadane;
- `app/globals.css` - reset, tokeny i lokalne fonty;
- `app/api/contact/route.ts` - obsługa formularza kontaktowego;
- `app/[slug]/` - strona wpisu, `app/admin/` - panel bloga, `app/api/admin/` - jego API, `app/media/` - serwowanie zdjęć;
- `lib/db.ts`, `lib/media.ts`, `lib/blog/` - baza (D1 / SQLite), zdjęcia (KV / dysk) i wpisy;
- `migrations/` - schemat bazy dla D1 i lokalnego SQLite;
- `scripts/import-blog.mts` - import wpisów z eksportu WordPressa;
- `components/` - sekcje strony i komponenty współdzielone; każdy komponent ma swój katalog ze stylami CSS Modules;
- `public/assets/` - grafiki i modele 3D;
- `public/fonts/` - lokalne fonty;
- `.env.example` - przykładowa konfiguracja formularza kontaktowego i kodu do panelu.
