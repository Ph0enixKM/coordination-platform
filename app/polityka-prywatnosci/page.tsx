import type { Metadata } from "next";
import SubpageHeader from "@/components/SubpageHeader/SubpageHeader";
import Prose from "@/components/Prose/Prose";
import Footer from "@/components/Footer/Footer";

export const metadata: Metadata = {
  title: "Polityka prywatności",
  description:
    "Polityka prywatności serwisu coordination.pl — administrator danych, cele i podstawy prawne przetwarzania, prawa użytkownika oraz pliki cookies.",
  alternates: { canonical: "/polityka-prywatnosci" },
  openGraph: {
    title: "Polityka prywatności | Coordination",
    description:
      "Polityka prywatności serwisu coordination.pl — administrator danych, cele i podstawy prawne przetwarzania, prawa użytkownika oraz pliki cookies.",
    url: "/polityka-prywatnosci",
  },
};

export default function PolitykaPrywatnosciPage() {
  return (
    <>
      <SubpageHeader
        title="Polityka prywatności"
        lead="Informacje o przetwarzaniu danych osobowych w serwisie coordination.pl."
        crumbs={[{ label: "Strona główna", href: "/" }, { label: "Polityka prywatności" }]}
      />

      <Prose>
        <h2>1. Administrator danych osobowych</h2>
        <p>
          Administratorem danych osobowych jest <strong>Szymon Pirko</strong>,
          adres: <strong>Stargard Gubiński 1, 66-620 Gubin</strong>, e-mail:{" "}
          <strong>kontakt@coordination.pl</strong>.
        </p>

        <h2>2. Cel i zakres przetwarzania danych</h2>
        <p>Dane osobowe użytkowników mogą być przetwarzane w związku z:</p>
        <ul>
          <li>wysłaniem wiadomości przez formularz kontaktowy,</li>
          <li>kontaktem za pośrednictwem poczty e-mail,</li>
          <li>udzieleniem odpowiedzi na zapytanie,</li>
          <li>prowadzeniem rozmów dotyczących ewentualnej współpracy,</li>
          <li>ustaleniem, dochodzeniem lub obroną roszczeń,</li>
          <li>zapewnieniem prawidłowego działania strony.</li>
        </ul>
        <p>Przetwarzane mogą być w szczególności takie dane jak:</p>
        <ul>
          <li>imię i nazwisko,</li>
          <li>adres e-mail,</li>
          <li>numer telefonu,</li>
          <li>nazwa firmy, jeśli użytkownik poda ją dobrowolnie,</li>
          <li>treść wiadomości,</li>
          <li>dane techniczne związane z korzystaniem ze strony, w tym adres IP.</li>
        </ul>

        <h2>3. Podstawy prawne przetwarzania</h2>
        <p>Dane osobowe są przetwarzane na podstawie:</p>
        <ul>
          <li>
            <strong>art. 6 ust. 1 lit. b RODO</strong> – gdy przetwarzanie jest
            niezbędne do podjęcia działań przed zawarciem umowy lub do wykonania
            umowy,
          </li>
          <li>
            <strong>art. 6 ust. 1 lit. c RODO</strong> – gdy przetwarzanie jest
            niezbędne do wypełnienia obowiązku prawnego,
          </li>
          <li>
            <strong>art. 6 ust. 1 lit. f RODO</strong> – gdy przetwarzanie jest
            niezbędne do realizacji prawnie uzasadnionego interesu administratora,
            w szczególności kontaktu z użytkownikiem, odpowiedzi na wiadomość,
            ochrony przed roszczeniami oraz zapewnienia bezpieczeństwa strony.
          </li>
        </ul>

        <h2>4. Dobrowolność podania danych</h2>
        <p>
          Podanie danych jest dobrowolne, ale może być niezbędne do uzyskania
          odpowiedzi na wiadomość lub do nawiązania kontaktu.
        </p>

        <h2>5. Odbiorcy danych</h2>
        <p>
          Dane mogą być przekazywane podmiotom wspierającym administratora w
          obsłudze strony, poczty elektronicznej, hostingu lub narzędzi
          technicznych, wyłącznie w zakresie niezbędnym do realizacji wskazanych
          celów. Dane nie są sprzedawane osobom trzecim.
        </p>

        <h2>6. Okres przechowywania danych</h2>
        <p>Dane będą przechowywane przez okres niezbędny do:</p>
        <ul>
          <li>udzielenia odpowiedzi na zapytanie,</li>
          <li>prowadzenia korespondencji,</li>
          <li>realizacji współpracy, jeśli do niej dojdzie,</li>
          <li>zabezpieczenia ewentualnych roszczeń,</li>
          <li>wykonania obowiązków wynikających z przepisów prawa.</li>
        </ul>
        <p>
          RODO wymaga wskazania okresu przechowywania danych albo kryteriów jego
          ustalania.
        </p>

        <h2>7. Prawa użytkownika</h2>
        <p>Osobie, której dane dotyczą, przysługuje prawo do:</p>
        <ul>
          <li>dostępu do danych,</li>
          <li>otrzymania kopii danych,</li>
          <li>sprostowania danych,</li>
          <li>usunięcia danych,</li>
          <li>ograniczenia przetwarzania,</li>
          <li>wniesienia sprzeciwu wobec przetwarzania,</li>
          <li>wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych.</li>
        </ul>

        <h2>8. Pliki cookies</h2>
        <p>Strona może wykorzystywać pliki cookies w celu:</p>
        <ul>
          <li>zapewnienia prawidłowego działania strony,</li>
          <li>utrzymania sesji użytkownika,</li>
          <li>poprawy bezpieczeństwa,</li>
          <li>pamiętywania ustawień technicznych.</li>
        </ul>
        <p>
          Jeżeli na stronie są wykorzystywane dodatkowe narzędzia analityczne lub
          marketingowe, takie jak np. Google Analytics, Meta Pixel, YouTube,
          Google Maps, Calendly lub inne rozwiązania zewnętrzne, politykę
          prywatności i mechanizm zgód cookies trzeba rozszerzyć o te narzędzia.
          Obowiązek informacyjny w tym zakresie wynika z RODO i praktyki UODO.
        </p>

        <h2>9. Zarządzanie cookies</h2>
        <p>
          Użytkownik może zarządzać plikami cookies poprzez ustawienia swojej
          przeglądarki internetowej. Ograniczenie stosowania cookies może wpłynąć
          na niektóre funkcje strony.
        </p>

        <h2>10. Bezpieczeństwo danych</h2>
        <p>
          Administrator stosuje odpowiednie środki techniczne i organizacyjne, aby
          chronić dane osobowe przed ich utratą, zniszczeniem, ujawnieniem lub
          dostępem osób nieuprawnionych.
        </p>

        <h2>11. Zmiany polityki prywatności</h2>
        <p>
          Polityka prywatności może być aktualizowana w przypadku zmiany przepisów
          prawa, sposobu działania strony lub stosowanych rozwiązań technicznych.
        </p>

        <h2>12. Kontakt</h2>
        <p>
          W sprawach związanych z przetwarzaniem danych osobowych można
          skontaktować się z administratorem pod adresem:{" "}
          <strong>kontakt@coordination.pl</strong>.
        </p>
      </Prose>

      <Footer />
    </>
  );
}
