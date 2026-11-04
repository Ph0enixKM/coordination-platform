import type { Metadata } from "next";
import SubpageHeader from "@/components/SubpageHeader/SubpageHeader";
import Prose from "@/components/Prose/Prose";
import Footer from "@/components/Footer/Footer";
import SiteNav from "@/components/SiteNav/SiteNav";

export const metadata: Metadata = {
  title: "Regulamin",
  description:
    "Regulamin strony internetowej coordination.pl - zasady korzystania z serwisu, formularza kontaktowego oraz prawa autorskie.",
  alternates: { canonical: "/regulamin" },
  openGraph: {
    title: "Regulamin | Coordination",
    description:
      "Regulamin strony internetowej coordination.pl - zasady korzystania z serwisu, formularza kontaktowego oraz prawa autorskie.",
    url: "/regulamin",
  },
};

export default function RegulaminPage() {
  return (
    <>
      <SiteNav variant="subpage" />
      <SubpageHeader
        title="Regulamin strony internetowej"
        lead="Zasady korzystania z serwisu coordination.pl."
        crumbs={[{ label: "Strona główna", href: "/" }, { label: "Regulamin" }]}
      />

      <Prose>
        <p className="updated">Obowiązuje od dnia publikacji.</p>

        <h2>§1. Postanowienia ogólne</h2>
        <ul>
          <li>
            Niniejszy Regulamin określa zasady korzystania ze strony internetowej
            dostępnej pod adresem coordination.pl.
          </li>
          <li>
            Właścicielem strony i administratorem serwisu jest{" "}
            <strong>Szymon Pirko</strong>, adres:{" "}
            <strong>Stargard Gubiński 1, 66-620 Gubin</strong>, e-mail:{" "}
            <strong>kontakt@coordination.pl</strong>.
          </li>
          <li>Strona ma charakter informacyjny i ofertowy.</li>
          <li>
            Za pośrednictwem strony użytkownik może w szczególności:
            <ul>
              <li>zapoznać się z treściami zamieszczonymi na stronie,</li>
              <li>skontaktować się z właścicielem strony,</li>
              <li>przesłać zapytanie za pomocą formularza kontaktowego.</li>
            </ul>
          </li>
        </ul>

        <h2>§2. Zasady korzystania ze strony</h2>
        <ul>
          <li>
            Użytkownik zobowiązuje się do korzystania ze strony zgodnie z
            obowiązującym prawem, dobrymi obyczajami i postanowieniami
            niniejszego Regulaminu.
          </li>
          <li>Zabronione jest dostarczanie przez użytkownika treści bezprawnych.</li>
          <li>
            Użytkownik nie może podejmować działań, które mogłyby zakłócić
            prawidłowe działanie strony.
          </li>
        </ul>

        <h2>§3. Kontakt i formularz kontaktowy</h2>
        <ul>
          <li>
            Skorzystanie z formularza kontaktowego wymaga podania danych
            niezbędnych do obsługi zapytania.
          </li>
          <li>
            Wysłanie wiadomości za pośrednictwem formularza, poczty e-mail lub
            kontakt telefoniczny nie oznaczają automatycznie zawarcia jakiejkolwiek
            umowy.
          </li>
          <li>
            Ewentualna współpraca lub świadczenie usług następuje na podstawie
            odrębnych ustaleń pomiędzy stronami.
          </li>
        </ul>

        <h2>§4. Prawa autorskie</h2>
        <ul>
          <li>
            Wszelkie treści znajdujące się na stronie, w szczególności teksty,
            grafiki, zdjęcia, układ strony i inne materiały, są chronione prawem
            autorskim.
          </li>
          <li>
            Kopiowanie, rozpowszechnianie lub wykorzystywanie treści bez uprzedniej
            zgody właściciela strony jest zabronione, z wyjątkiem przypadków
            przewidzianych przez przepisy prawa.
          </li>
        </ul>

        <h2>§5. Odpowiedzialność</h2>
        <ul>
          <li>
            Właściciel strony dokłada należytej staranności, aby informacje
            prezentowane na stronie były aktualne i rzetelne.
          </li>
          <li>
            Właściciel nie gwarantuje nieprzerwanej dostępności strony i nie ponosi
            odpowiedzialności za czasowe przerwy w jej działaniu wynikające z
            przyczyn technicznych lub niezależnych od niego.
          </li>
          <li>
            Treści zamieszczone na stronie nie stanowią oferty w rozumieniu
            Kodeksu cywilnego, chyba że wyraźnie wskazano inaczej.
          </li>
        </ul>

        <h2>§6. Linki zewnętrzne</h2>
        <p>
          Strona może zawierać odnośniki do stron internetowych podmiotów trzecich.
          Właściciel strony nie odpowiada za treści ani zasady obowiązujące na
          tych stronach.
        </p>

        <h2>§7. Postanowienia końcowe</h2>
        <ul>
          <li>Regulamin obowiązuje od dnia publikacji.</li>
          <li>
            Właściciel strony zastrzega sobie prawo do zmiany Regulaminu w
            przypadku zmiany przepisów prawa lub funkcjonalności strony.
          </li>
          <li>W sprawach nieuregulowanych zastosowanie mają przepisy prawa polskiego.</li>
        </ul>
      </Prose>

      <Footer />
    </>
  );
}
