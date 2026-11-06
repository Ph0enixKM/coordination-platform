/**
 * How a cooperation runs, step by step: in full at /proces, and as the
 * interactive timeline on the home page.
 */
export type ProcessStep = {
  title: string;
  description: string;
  /** What the step leaves the firm with. */
  outcome: string;
};

export const PROCESS_STEPS: readonly ProcessStep[] = [
  {
    title: "Diagnoza i wspólne zrozumienie sytuacji",
    description:
      "Współpracę zaczynamy od uporządkowania faktów. Analizujemy, jak firma działa dziś na poziomie strategii, sprzedaży, marketingu i decyzji właścicielskich. Celem nie jest szybka ocena, lecz wspólne zrozumienie realnych przyczyn problemów.",
    outcome: "To etap, w którym porządkujemy obraz firmy i ustalamy, co naprawdę wymaga zmiany, a co jest tylko objawem.",
  },
  {
    title: "Ustalenie kierunku i priorytetów",
    description:
      "Na podstawie diagnozy wyznaczamy jasny kierunek działania firmy. Określamy priorytety, które mają największy wpływ na stabilność sprzedaży, produkcji i finansów. Eliminujemy działania poboczne.",
    outcome: "Właściciel zyskuje punkt odniesienia do każdej decyzji.",
  },
  {
    title: "Strategia na sprzedaż i marketing",
    description:
      "Ustalone decyzje strategiczne przekładamy na spójny sposób działania sprzedaży i marketingu. Sprawdzamy, czy oferta i komunikacja wspierają ten sam cel biznesowy.",
    outcome: "Porządkujemy to, co już funkcjonuje, tak aby zaczęło pracować jako jeden system.",
  },
  {
    title: "Wsparcie we wdrożeniu decyzji",
    description:
      "Pomagamy właścicielowi i zespołowi wdrażać ustalone kierunki w codziennym działaniu, bez zatrzymywania operacji bieżących.",
    outcome: "Celem jest realna zmiana sposobu działania, a nie stosy dokumentów.",
  },
  {
    title: "Uporządkowanie i poprawianie",
    description:
      "Porządkujemy wypracowane rozwiązania w jasny model działania firmy. Właściciel otrzymuje system, który może dalej rozwijać samodzielnie.",
    outcome: "Efektem jest firma, która działa przewidywalnie, a nie reaktywnie.",
  },
];

/** "01." for the first step, as the pages number them. */
export const stepNumber = (index: number) => `${String(index + 1).padStart(2, "0")}.`;
