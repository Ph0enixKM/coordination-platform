/**
 * The areas we work on in a company: listed in full at /wsparcie, and matched
 * against what a visitor recognises in their own firm on the home page.
 */

export type SupportAreaId =
  | "strategy"
  | "model"
  | "offer"
  | "sales"
  | "marketing"
  | "owner"
  | "processes"
  | "alignment"
  | "rhythm";

export type SupportArea = {
  id: SupportAreaId;
  title: string;
  /** A few words for a chip, where the title is too long. */
  short: string;
  description: string;
};

export const SUPPORT_AREAS: readonly SupportArea[] = [
  {
    id: "strategy",
    title: "Strategia firmy i kierunek rozwoju",
    short: "Strategia i kierunek",
    description:
      "Porządkujemy kierunek działania firmy, priorytety i decyzje, które mają największy wpływ na wynik. Strategia nie zostaje dokumentem, tylko staje się filtrem do codziennych wyborów właściciela i zespołu.",
  },
  {
    id: "model",
    title: "Model biznesowy i rentowność",
    short: "Model biznesowy i rentowność",
    description:
      "Sprawdzamy, na czym firma naprawdę zarabia, które zlecenia i klienci budują wynik, a które tylko generują obrót, chaos i przeciążenie. Dzięki temu łatwiej podejmować decyzje o ofercie, cenach i kierunku rozwoju.",
  },
  {
    id: "offer",
    title: "Oferta i propozycja wartości",
    short: "Oferta i propozycja wartości",
    description:
      "Porządkujemy sposób mówienia o tym, co firma robi, dla kogo jest właściwym wyborem i dlaczego klient miałby wybrać właśnie ją. Dzięki temu sprzedaż nie opiera się wyłącznie na cenie ani przypadkowych rozmowach.",
  },
  {
    id: "sales",
    title: "Proces sprzedaży i pozyskiwanie klientów",
    short: "Proces sprzedaży",
    description:
      "Analizujemy lejek sprzedaży, źródła zapytań, sposób kwalifikacji klientów, argumentację i ofertowanie. Celem jest bardziej przewidywalny proces sprzedaży, a nie ciągłe liczenie na polecenia, przypadkowe zapytania lub aktywność jednego handlowca.",
  },
  {
    id: "marketing",
    title: "Marketing wspierający sprzedaż",
    short: "Marketing wspierający sprzedaż",
    description:
      "Ustawiamy komunikację, treści i stronę internetową tak, aby wspierały realny proces zakupu klienta. Marketing ma wzmacniać sprzedaż i budować zaufanie do firmy, a nie być zbiorem przypadkowych publikacji.",
  },
  {
    id: "owner",
    title: "Decyzje właścicielskie i odciążenie właściciela",
    short: "Odciążenie właściciela",
    description:
      "Pomagamy właścicielowi przestać być jedynym punktem kontroli w firmie. Ustalamy zasady podejmowania decyzji, odpowiedzialności i priorytety, dzięki którym firma może działać bardziej przewidywalnie bez ciągłego angażowania właściciela w każdy temat.",
  },
  {
    id: "processes",
    title: "Procesy i organizacja pracy",
    short: "Procesy i organizacja pracy",
    description:
      "Porządkujemy sposób realizacji zleceń, przepływ informacji, odpowiedzialności i momenty decyzyjne. Chodzi nie o biurokrację, lecz o to, aby firma nie rozwiązywała tych samych problemów od nowa przy każdym kliencie.",
  },
  {
    id: "alignment",
    title: "Współpraca sprzedaży, marketingu i realizacji",
    short: "Sprzedaż, marketing i realizacja razem",
    description:
      "Łączymy działania handlowe, marketingowe i operacyjne w jeden spójny sposób pracy. Dzięki temu firma nie obiecuje klientom rzeczy, których nie może dowieźć, a sprzedaż nie generuje problemów dla realizacji.",
  },
  {
    id: "rhythm",
    title: "Planowanie, kontrola i poprawianie działania firmy",
    short: "Planowanie i kontrola",
    description:
      "Wprowadzamy prosty rytm pracy nad firmą: diagnozę sytuacji, decyzje, wdrożenie, obserwację efektów i korektę. Dzięki temu firma uczy się działać na podstawie faktów, a nie tylko intuicji i reakcji na bieżące problemy.",
  },
];
