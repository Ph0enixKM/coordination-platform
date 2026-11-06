import type { ComponentType } from "react";
import { Factory, Handshake, House, Store, type LucideProps } from "lucide-react";

/**
 * The kinds of company we work with: described in full at /dla-kogo, and
 * picked from on the home page.
 */
export type FirmType = {
  id: string;
  Icon: ComponentType<LucideProps>;
  title: string;
  /** The name on a picker button. */
  label: string;
  /** The symptom that shows up most often in this kind of company. */
  symptom: string;
  description: string;
  /** One sentence on what we do there, for the home page. */
  summary: string;
};

export const FIRM_TYPES: readonly FirmType[] = [
  {
    id: "produkcja",
    Icon: Factory,
    title: "Firmy produkcyjne",
    label: "Produkcyjną",
    symptom: "Zlecenia, które generują obrót, ale obciążają realizację i niszczą marżę",
    description:
      "Najczęściej pracujemy nad relacją między strategią, sprzedażą, decyzjami handlowymi, realizacją i rentownością. Część decyzji sprzedażowych obciąża produkcję, obniża marżę albo powoduje napięcia między tym, co obiecano klientowi, a tym, co firma może wykonać w zdrowy sposób. Dlatego porządkujemy zasady wyboru klientów, kwalifikacji zapytań, wyceny i podejmowania decyzji, które mają bezpośredni wpływ na wynik.",
    summary:
      "Porządkujemy zasady wyboru klientów, kwalifikacji zapytań, wyceny i decyzji handlowych, tak żeby sprzedaż przestała obciążać produkcję i zjadać marżę.",
  },
  {
    id: "uslugi",
    Icon: Handshake,
    title: "Firmy usługowe i eksperckie",
    label: "Usługową lub ekspercką",
    symptom: "Zbyt szeroki zakres klientów i projektów, które pochłaniają czas ekspertów",
    description:
      "Najczęściej pracujemy nad strategią, ofertą, sprzedażą, zakresem współpracy z klientem i sposobem komunikowania wartości. Problemem często nie jest brak kompetencji, tylko to, że firma obsługuje zbyt szeroki zakres klientów albo nie ma jasnych zasad, gdzie kończy się opłacalna współpraca, a gdzie zaczyna się praca, która nie przekłada się proporcjonalnie na wynik. Pomagamy uporządkować, dla kogo firma jest właściwym wyborem i jakich warunków nie powinna przyjmować.",
    summary:
      "Ustalamy, dla kogo firma jest właściwym wyborem, jak sprzedawać swoją wartość i jakich warunków współpracy nie przyjmować.",
  },
  {
    id: "handel",
    Icon: Store,
    title: "Firmy handlowe, techniczne i projektowe",
    label: "Handlową, techniczną lub projektową",
    symptom: "Sprzedaż reaktywna - sprzedaje to, co akurat da się sprzedać, konkuruje ceną",
    description:
      "Najczęściej pracujemy nad tym, żeby sprzedaż, oferta, marketing i decyzje operacyjne zaczęły wynikać z jednej logiki. Często firma ma klientów i zapytania, ale działa zbyt reaktywnie: konkuruje ceną albo nie ma jasno określonego segmentu, na którym chce budować przewagę. Porządkujemy strategię, propozycję wartości, proces sprzedaży, sposób kwalifikacji klientów i zasady podejmowania decyzji, żeby firma świadomie budowała rentowny model działania.",
    summary:
      "Porządkujemy strategię, propozycję wartości i proces sprzedaży, żeby firma przestała konkurować ceną i świadomie budowała rentowny model działania.",
  },
  {
    id: "rodzinne",
    Icon: House,
    title: "Firmy rodzinne",
    label: "Rodzinną",
    symptom: "Relacje mieszają się z zarządzaniem - decyzje wynikają z dynamiki rodzinnej",
    description:
      "Najczęściej pracujemy nad oddzieleniem relacji od zarządzania. W firmie rodzinnej wiele decyzji wynika z nieformalnych ustaleń, historii i bieżących emocji, a nie z logiki firmy. Pomagamy uporządkować role, odpowiedzialności i sposób podejmowania decyzji, aby firma nie zależała od relacji i mogła działać bardziej przewidywalnie.",
    summary:
      "Pomagamy oddzielić relacje od zarządzania: uporządkować role, odpowiedzialności i sposób podejmowania decyzji.",
  },
];
