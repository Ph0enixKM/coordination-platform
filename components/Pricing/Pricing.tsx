"use client";

import { useState } from "react";
import { Check, Factory, Handshake, Store } from "lucide-react";
import CtaButton from "@/components/CtaButton/CtaButton";
import MailModal from "@/components/MailModal/MailModal";
import SectionIntro from "@/components/SectionIntro/SectionIntro";
import styles from "./Pricing.module.css";

/** The mail each group opens with, so nobody starts from a blank page. */
const draftFor = (business: string) =>
  `Cześć, zarządzam ${business} i jestem zainteresowany ofertą. Chciałbym z wami współpracować. Do usłyszenia.`;

/**
 * The three company groups we work with, with the entry amount for each one.
 * These are reference amounts rather than a package price list - the note at
 * the bottom of the section says so. The benefits under each amount are what
 * that particular kind of company gets out of the work.
 */
const groups = [
  {
    Icon: Factory,
    title: "Firmy produkcyjne",
    business: "firmą produkcyjną",
    prefix: "Od",
    amount: "2300 zł",
    suffix: "netto miesięcznie",
    benefits: [
      "Uporządkowana droga od zapytania do gotowego zlecenia",
      "Kryteria, które zlecenia przyjmować, a których nie",
      "Marża policzona przed przyjęciem zlecenia, nie po nim",
      "Mniej spraw, które muszą wracać do właściciela",
    ],
  },
  {
    Icon: Handshake,
    title: "Firmy usługowe i eksperckie",
    business: "firmą ekspercką / usługową",
    prefix: "Od",
    amount: "1800 zł",
    suffix: "netto miesięcznie",
    benefits: [
      "Jasna oferta i powód, dla którego klient wybiera właśnie Was",
      "Kwalifikacja klientów, zanim pochłoną czas ekspertów",
      "Powtarzalny proces sprzedaży zamiast pojedynczych rozmów",
      "Ceny, które wytrzymują rozmowę o rabacie",
    ],
  },
  {
    Icon: Store,
    title: "Firmy handlowe, techniczne i projektowe",
    business: "firmą handlową / techniczną / projektową",
    prefix: "Od",
    amount: "2300 zł",
    suffix: "netto miesięcznie",
    benefits: [
      "Klienci i produkty poukładani według rzeczywistej rentowności",
      "Zasady rabatowania zamiast negocjacji od przypadku do przypadku",
      "Sprzedaż, marketing i realizacja pracujące w jednym rytmie",
      "Priorytety, które przestają konkurować o te same zasoby",
    ],
  },
] as const;

/** What every company gets, niezależnie od grupy i kwoty. */
const shared = [
  "Diagnozę tego, co naprawdę nie działa - zanim cokolwiek wdrożymy",
  "Zasady decyzji, które zostają w firmie po zakończeniu współpracy",
  "Stały rytm pracy: decyzje, wdrożenie, obserwacja efektów, korekta",
  "Zakres ustalony po poznaniu firmy, a nie wybrany z gotowego pakietu",
] as const;

type CardProps = {
  group: (typeof groups)[number];
  onAsk: () => void;
};

function PricingCard({ group, onAsk }: CardProps) {
  const { Icon, title, prefix, amount, suffix, benefits } = group;

  return (
    <article className={styles.card}>
      <header className={styles.head}>
        <div className={styles.icon}>
          <Icon aria-hidden="true" />
        </div>
        <h3>{title}</h3>
      </header>

      <div className={styles.price}>
        <p className={styles.amount}>
          <span className={styles.prefix}>{prefix}</span>
          <strong>{amount}</strong>
        </p>
        <span className={styles.suffix}>{suffix}</span>
      </div>

      <ul className={styles.benefits}>
        {benefits.map((benefit) => (
          <li key={benefit}>
            <Check aria-hidden="true" />
            <span>{benefit}</span>
          </li>
        ))}
      </ul>

      <div className={styles.ask}>
        <CtaButton onClick={onAsk}>Porozmawiajmy</CtaButton>
      </div>
    </article>
  );
}

export default function Pricing() {
  /** The group whose mail is open, or null while the modal is closed. */
  const [asking, setAsking] = useState<(typeof groups)[number] | null>(null);

  return (
    <section
      className={styles.pricing}
      id="cennik"
    >
      <div className={styles.intro}>
        <SectionIntro title="Ile kosztuje współpraca?">
          Punkt wyjścia do rozmowy o Twojej firmie. Ostateczny zakres i koszt
          współpracy ustalamy po poznaniu jej potrzeb.
        </SectionIntro>
      </div>

      <div className={styles.cards}>
        {groups.map((group) => (
          <PricingCard
            key={group.title}
            group={group}
            onAsk={() => setAsking(group)}
          />
        ))}
      </div>

      <div className={styles.tail}>
        <div className={styles.shared}>
          <div className={styles.sharedInner}>
            <h3>W każdej współpracy,<br />niezależnie od kwoty.</h3>
            <ul>
              {shared.map((item) => (
                <li key={item}>
                  <Check aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className={styles.note}>
          Podane kwoty nie są sztywnym cennikiem pakietów. Pokazują, ile
          przeważnie zostawiają u nas firmy podobnej wielkości i o podobnym
          poziomie złożoności. Dokładny zakres współpracy ustalamy dopiero po
          poznaniu firmy.
        </p>
      </div>

      {asking && (
        <MailModal
          draft={draftFor(asking.business)}
          title={`Napisz do nas - ${asking.title.toLowerCase()}`}
          onClose={() => setAsking(null)}
        />
      )}
    </section>
  );
}
