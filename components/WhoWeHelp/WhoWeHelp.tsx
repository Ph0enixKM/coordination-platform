import SectionIntro from "@/components/SectionIntro/SectionIntro";
import styles from "./WhoWeHelp.module.css";

const companies = [
  {
    icon: "/assets/company-production.svg",
    title: "Firmy produkcyjne",
    copy: "W firmach produkcyjnych najczęściej pracujemy nad relacją między strategią, sprzedażą, decyzjami handlowymi, realizacją i rentownością. Problemem bardzo często nie jest sam brak sprzedaży, tylko to, że firma przyjmuje zlecenia, które generują obrót, ale nie zawsze budują wynik. Część decyzji sprzedażowych może obciążać realizację, obniżać marżę albo powodować napięcia między tym, co zostało obiecane klientowi, a tym, co firma może wykonać w zdrowy sposób. Dlatego porządkujemy zasady wyboru klientów, kwalifikacji zapytań, wyceny, sprzedaży i podejmowania decyzji, które mają bezpośredni wpływ na wynik firmy.",
    price: "Firmy produkcyjne przeważnie zostawiają u nas 2300–4000 zł netto miesięcznie.",
  },
  {
    icon: "/assets/company-services.svg",
    title: "Firmy usługowe i eksperckie",
    copy: "W firmach usługowych i eksperckich najczęściej pracujemy nad strategią, ofertą, sprzedażą, zakresem współpracy z klientem i sposobem komunikowania wartości. Problemem często nie jest brak kompetencji, tylko to, że firma obsługuje zbyt szeroki zakres klientów, przyjmuje zbyt indywidualne projekty albo nie ma jasnych zasad, gdzie kończy się opłacalna współpraca, a gdzie zaczyna się praca, która pochłania czas i nie przekłada się proporcjonalnie na wynik. Pomagamy uporządkować, dla kogo firma jest właściwym wyborem, jaki problem rozwiązuje, jak powinna sprzedawać swoją wartość i jakich warunków współpracy nie powinna przyjmować.",
    price: "Firmy usługowe przeważnie zaczynają współpracę od około 1800 zł netto miesięcznie.",
  },
  {
    icon: "/assets/company-commerce.svg",
    title: "Firmy handlowe, techniczne i projektowe",
    copy: "W firmach handlowych, technicznych i projektowych najczęściej pracujemy nad tym, żeby sprzedaż, oferta, marketing i decyzje operacyjne zaczęły wynikać z jednej logiki. Często firma ma klientów i zapytania, ale działa zbyt reaktywnie: sprzedaje to, co akurat da się sprzedać, konkuruje ceną albo nie ma jasno określonego segmentu, na którym chce budować przewagę. Porządkujemy strategię, propozycję wartości, proces sprzedaży, sposób kwalifikacji klientów i zasady podejmowania decyzji, żeby firma nie generowała jedynie obrotu, ale świadomie budowała rentowny model działania.",
    price: "Firmy tego typu przeważnie zostawiają u nas kwoty zbliżone do podstawowego zakresu współpracy, czyli 2300–4000 zł netto miesięcznie.",
  },
] as const;

export default function WhoWeHelp() {
  return (
    <section className={styles.who} id="dla-kogo">
      <div className={styles.intro}>
        <SectionIntro title="Dla jakich firm jesteśmy właściwym wyborem?">
          Pracujemy z mikro i małymi firmami, które mają już klientów, zespół i przychody, ale widzą, że dalszy rozwój wymaga uporządkowania strategii, sprzedaży, marketingu i sposobu podejmowania decyzji.
        </SectionIntro>
      </div>
      <div className={styles.companyCardsShell}>
        <div className={styles.companyCards}>
          {companies.map((company) => (
            <article key={company.title}>
              <img className={styles.companyIcon} src={company.icon} alt="" />
              <h3>{company.title}</h3>
              <p>{company.copy}</p>
              <div className={styles.companyPrice}>
                <img src="/assets/company-budget.png" alt="" />
                <em>{company.price}</em>
              </div>
            </article>
          ))}
        </div>
        <p className={styles.pricingNote}>Podane kwoty nie są sztywnym cennikiem pakietów. Pokazują, ile przeważnie zostawiają u nas firmy podobnej wielkości i o podobnym poziomie złożoności. Dokładny zakres współpracy ustalamy dopiero po poznaniu firmy.</p>
      </div>
    </section>
  );
}
