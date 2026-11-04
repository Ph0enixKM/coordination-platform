import styles from "./FirmTypes.module.css";

type FirmType = {
  title: string;
  /** The symptom that shows up most often in this kind of company. */
  symptom: string;
  description: string;
};

const FIRM_TYPES: readonly FirmType[] = [
  {
    title: "Firmy produkcyjne",
    symptom:
      "Zlecenia, które generują obrót, ale obciążają realizację i niszczą marżę",
    description:
      "Najczęściej pracujemy nad relacją między strategią, sprzedażą, decyzjami handlowymi, realizacją i rentownością. Część decyzji sprzedażowych obciąża produkcję, obniża marżę albo powoduje napięcia między tym, co obiecano klientowi, a tym, co firma może wykonać w zdrowy sposób. Dlatego porządkujemy zasady wyboru klientów, kwalifikacji zapytań, wyceny i podejmowania decyzji, które mają bezpośredni wpływ na wynik.",
  },
  {
    title: "Firmy usługowe i eksperckie",
    symptom:
      "Zbyt szeroki zakres klientów i projektów, które pochłaniają czas ekspertów",
    description:
      "Najczęściej pracujemy nad strategią, ofertą, sprzedażą, zakresem współpracy z klientem i sposobem komunikowania wartości. Problemem często nie jest brak kompetencji, tylko to, że firma obsługuje zbyt szeroki zakres klientów albo nie ma jasnych zasad, gdzie kończy się opłacalna współpraca, a gdzie zaczyna się praca, która nie przekłada się proporcjonalnie na wynik. Pomagamy uporządkować, dla kogo firma jest właściwym wyborem i jakich warunków nie powinna przyjmować.",
  },
  {
    title: "Firmy handlowe, techniczne i projektowe",
    symptom:
      "Sprzedaż reaktywna - sprzedaje to, co akurat da się sprzedać, konkuruje ceną",
    description:
      "Najczęściej pracujemy nad tym, żeby sprzedaż, oferta, marketing i decyzje operacyjne zaczęły wynikać z jednej logiki. Często firma ma klientów i zapytania, ale działa zbyt reaktywnie: konkuruje ceną albo nie ma jasno określonego segmentu, na którym chce budować przewagę. Porządkujemy strategię, propozycję wartości, proces sprzedaży, sposób kwalifikacji klientów i zasady podejmowania decyzji, żeby firma świadomie budowała rentowny model działania.",
  },
  {
    title: "Firmy rodzinne",
    symptom:
      "Relacje mieszają się z zarządzaniem - decyzje wynikają z dynamiki rodzinnej",
    description:
      "Najczęściej pracujemy nad oddzieleniem relacji od zarządzania. W firmie rodzinnej wiele decyzji wynika z nieformalnych ustaleń, historii i bieżących emocji, a nie z logiki firmy. Pomagamy uporządkować role, odpowiedzialności i sposób podejmowania decyzji, aby firma nie zależała od relacji i mogła działać bardziej przewidywalnie.",
  },
];

export default function FirmTypes() {
  return (
    <div className={styles.grid}>
      {FIRM_TYPES.map((firm) => (
        <article key={firm.title} className={styles.card}>
          <h3 className={styles.title}>{firm.title}</h3>

          <p className={styles.symptom}>{firm.symptom}</p>

          <p className={styles.description}>{firm.description}</p>
        </article>
      ))}
    </div>
  );
}
