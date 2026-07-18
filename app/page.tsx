import styles from "./page.module.css";
import Header from "./Header";
import {
  ArrowRight,
  ArrowUpRight,
  ChartPie,
  Gem,
  RefreshCw,
  Repeat2,
  Sparkles,
  TrendingUp,
  UserCog,
  Workflow,
} from "lucide-react";

const supportAreas = [
  [TrendingUp, "Strategia firmy i kierunek rozwoju", "Porządkujemy kierunek działania firmy, priorytety i decyzje, które mają największy wpływ na wynik."],
  [ChartPie, "Model biznesowy i rentowność", "Sprawdzamy, na czym firma naprawdę zarabia, a które zlecenia generują tylko obrót i przeciążenie."],
  [Gem, "Oferta i propozycja wartości", "Ustalamy, dla kogo firma jest właściwym wyborem i dlaczego klient miałby wybrać właśnie ją."],
  [ArrowRight, "Proces sprzedaży i pozyskiwanie klientów", "Analizujemy lejek, źródła zapytań, kwalifikację klientów, argumentację i ofertowanie."],
  [Sparkles, "Marketing wspierający sprzedaż", "Ustawiamy komunikację, treści i stronę tak, aby wspierały realny proces zakupu klienta."],
  [UserCog, "Decyzje właścicielskie", "Pomagamy właścicielowi przestać być jedynym punktem kontroli i ustalić jasne odpowiedzialności."],
  [Workflow, "Procesy i organizacja pracy", "Porządkujemy realizację zleceń, przepływ informacji i momenty decyzyjne bez zbędnej biurokracji."],
  [Repeat2, "Sprzedaż, marketing i realizacja", "Łączymy działania handlowe, marketingowe i operacyjne w jeden spójny sposób pracy."],
  [RefreshCw, "Planowanie i poprawianie", "Wprowadzamy prosty rytm: diagnoza, decyzje, wdrożenie, obserwacja efektów i korekta."],
] as const;

const industries = [
  ["/assets/industry-services.png", "Firmy usługowe i eksperckie", "Pomagamy uporządkować ofertę, proces sprzedaży, komunikację i sposób pracy z klientami, aby rozwój nie zależał wyłącznie od właściciela i jego osobistego zaangażowania."],
  ["/assets/industry-production.png", "Firmy produkcyjne i techniczne", "Porządkujemy decyzje handlowe, priorytety, ofertowanie i współpracę sprzedaży z realizacją, aby firma nie przyjmowała zleceń, które generują obrót, ale niszczą marżę i planowanie."],
  ["/assets/industry-commerce.png", "Firmy handlowe i dystrybucyjne", "Pomagamy określić, na czym firma ma konkurować poza ceną, jakich klientów wybierać i jak zbudować bardziej przewidywalny proces sprzedaży."],
  ["/assets/industry-family.png", "Firmy rodzinne", "Pomagamy oddzielić relacje od zarządzania, uporządkować role, odpowiedzialności i sposób podejmowania decyzji, aby firma nie zależała od nieformalnych ustaleń i bieżących emocji."],
] as const;

const process = [
  ["01", "Diagnoza i wspólne zrozumienie sytuacji", "Analizujemy, jak firma działa dziś na poziomie strategii, sprzedaży, marketingu i decyzji właścicielskich. Porządkujemy fakty i oddzielamy przyczyny od objawów.", "/assets/process-diagnosis.png"],
  ["02", "Ustalenie kierunku i priorytetów", "Na podstawie diagnozy wyznaczamy kierunek działania i priorytety o największym wpływie na stabilność sprzedaży, produkcji i finansów.", "/assets/process-priorities.png"],
  ["03", "Strategia na sprzedaż i marketing", "Decyzje strategiczne przekładamy na spójny sposób działania sprzedaży i marketingu. Oferta i komunikacja zaczynają wspierać ten sam cel.", "/assets/process-marketing.png"],
  ["04", "Wsparcie we wdrożeniu decyzji", "Pomagamy właścicielowi i zespołowi wdrażać ustalone kierunki w codziennym działaniu bez zatrzymywania bieżącej pracy.", "/assets/process-implementation.png"],
  ["05", "Uporządkowanie i poprawianie", "Wypracowane rozwiązania układamy w jasny model działania. Efektem jest firma, która działa przewidywalnie, a nie reaktywnie.", "/assets/process-finish.png"],
] as const;

const articles = [
  ["/assets/article-notion.png", "17 lipca, 2026", "Czy Notion nadaje się do prowadzenia małej firmy? Zalety, wady i praktyczne zastosowania"],
  ["/assets/article-planning.png", "15 lipca, 2026", "Jakie narzędzie wybrać do planowania pracy małego zespołu? Praktyczny przewodnik dla właścicieli MŚP"],
  ["/assets/article-crm.png", "13 lipca, 2026", "CRM dla małej firmy usługowej – jaki system wybrać i na co zwrócić uwagę?"],
] as const;

function Arrow() {
  return <ArrowUpRight aria-hidden="true" />;
}

export default function Home() {
  return (
    <>
      <Header />
      <main id="top">
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <p className={styles.eyebrow}>coordination.pl</p>
            <p className={styles.heroTag}>Strategia operacyjna <i /> Przemysł 4.0</p>
            <h1>Rozwój firmy zaczyna się od dobrych decyzji</h1>
            <p className={styles.lead}><strong>Dla właścicieli małych firm usługowych, produkcyjnych i handlowych</strong></p>
            <p className={styles.heroCopy}>Codziennie wspieramy rozwój małych, polskich biznesów B2C oraz B2B, które chcą rosnąć w sposób świadomy i uporządkowany. Pomagamy projektować strategie, model biznesowy, sprzedaż oraz decyzje, które wzmacniają firmę.</p>
            <a className={styles.primaryButton} href="#dla-kogo">Dowiedz się więcej <Arrow /></a>
          </div>
        </section>

        <section className={`${styles.darkSection} ${styles.who}`} id="dla-kogo">
          <div className={styles.sectionIntro}>
            <p className={styles.kicker}>Właściwe dopasowanie</p>
            <h2>Dla jakich firm jesteśmy właściwym wyborem?</h2>
            <p>Pracujemy z mikro i małymi firmami, które mają już klientów, zespół i przychody, ale widzą, że dalszy rozwój wymaga uporządkowania strategii, sprzedaży, marketingu i sposobu podejmowania decyzji.</p>
          </div>
          <div className={styles.companyCardsShell}>
            <div className={styles.companyCards}>
              <article>
                <img className={styles.companyIcon} src="/assets/company-production.svg" alt="" />
                <h3>Firmy produkcyjne</h3>
                <p>W firmach produkcyjnych najczęściej pracujemy nad relacją między strategią, sprzedażą, decyzjami handlowymi, realizacją i rentownością. Problemem bardzo często nie jest sam brak sprzedaży, tylko to, że firma przyjmuje zlecenia, które generują obrót, ale nie zawsze budują wynik. Część decyzji sprzedażowych może obciążać realizację, obniżać marżę albo powodować napięcia między tym, co zostało obiecane klientowi, a tym, co firma może wykonać w zdrowy sposób. Dlatego porządkujemy zasady wyboru klientów, kwalifikacji zapytań, wyceny, sprzedaży i podejmowania decyzji, które mają bezpośredni wpływ na wynik firmy.</p>
                <div className={styles.companyPrice}><img src="/assets/company-budget.png" alt="" /><em>Firmy produkcyjne przeważnie zostawiają u nas 2300–4000 zł netto miesięcznie.</em></div>
              </article>
              <article>
                <img className={styles.companyIcon} src="/assets/company-services.svg" alt="" />
                <h3>Firmy usługowe i eksperckie</h3>
                <p>W firmach usługowych i eksperckich najczęściej pracujemy nad strategią, ofertą, sprzedażą, zakresem współpracy z klientem i sposobem komunikowania wartości. Problemem często nie jest brak kompetencji, tylko to, że firma obsługuje zbyt szeroki zakres klientów, przyjmuje zbyt indywidualne projekty albo nie ma jasnych zasad, gdzie kończy się opłacalna współpraca, a gdzie zaczyna się praca, która pochłania czas i nie przekłada się proporcjonalnie na wynik. Pomagamy uporządkować, dla kogo firma jest właściwym wyborem, jaki problem rozwiązuje, jak powinna sprzedawać swoją wartość i jakich warunków współpracy nie powinna przyjmować.</p>
                <div className={styles.companyPrice}><img src="/assets/company-budget.png" alt="" /><em>Firmy usługowe przeważnie zaczynają współpracę od około 1800 zł netto miesięcznie.</em></div>
              </article>
              <article>
                <img className={styles.companyIcon} src="/assets/company-commerce.svg" alt="" />
                <h3>Firmy handlowe, techniczne i projektowe</h3>
                <p>W firmach handlowych, technicznych i projektowych najczęściej pracujemy nad tym, żeby sprzedaż, oferta, marketing i decyzje operacyjne zaczęły wynikać z jednej logiki. Często firma ma klientów i zapytania, ale działa zbyt reaktywnie: sprzedaje to, co akurat da się sprzedać, konkuruje ceną albo nie ma jasno określonego segmentu, na którym chce budować przewagę. Porządkujemy strategię, propozycję wartości, proces sprzedaży, sposób kwalifikacji klientów i zasady podejmowania decyzji, żeby firma nie generowała jedynie obrotu, ale świadomie budowała rentowny model działania.</p>
                <div className={styles.companyPrice}><img src="/assets/company-budget.png" alt="" /><em>Firmy tego typu przeważnie zostawiają u nas kwoty zbliżone do podstawowego zakresu współpracy, czyli 2300–4000 zł netto miesięcznie.</em></div>
              </article>
            </div>
            <p className={styles.pricingNote}>Podane kwoty nie są sztywnym cennikiem pakietów. Pokazują, ile przeważnie zostawiają u nas firmy podobnej wielkości i o podobnym poziomie złożoności. Dokładny zakres współpracy ustalamy dopiero po poznaniu firmy.</p>
          </div>
        </section>

        <section className={`${styles.darkSection} ${styles.support}`} id="wsparcie">
          <div className={styles.sectionIntro}>
            <p className={styles.kicker}>Firma jako system</p>
            <h2>W czym pomagamy właścicielom małych firm</h2>
            <p>Pracujemy nad tym, komu firma sprzedaje, na czym naprawdę zarabia, jak działa oferta, sprzedaż i marketing oraz które decyzje powinny przestać wracać do właściciela.</p>
          </div>
          <div className={styles.supportGrid}>
            {supportAreas.map(([Icon, title, copy]) => (
              <article key={title}>
                <Icon className={styles.lineIcon} aria-hidden="true" />
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.collaboration}>
          <div className={styles.sectionIntro}>
            <p className={styles.kicker}>Praca, nie prezentacja</p>
            <h2>Projektujemy, wdrażamy i utrzymujemy zmianę</h2>
          </div>
          <img className={styles.collaborationLine} src="/assets/collaboration-line.png" alt="Schemat współpracy" />
          <div className={styles.threeColumns}>
            <article><span>01</span><h3>Projektowanie</h3><p>Analizujemy klientów, ofertę, sprzedaż, marketing i miejsca, w których firma traci czas, marżę lub kontrolę.</p></article>
            <article><span>02</span><h3>Wdrażanie</h3><p>Ustalone zasady przekładamy na realne decyzje, oferty, priorytety i sposób pracy zespołu.</p></article>
            <article><span>03</span><h3>Utrzymanie</h3><p>Regularnie sprawdzamy efekty i korygujemy sposób działania, aby firma nie wracała do dawnych nawyków.</p></article>
          </div>
        </section>

        <section className={`${styles.darkSection} ${styles.paths}`}>
          <div className={styles.sectionIntro}>
            <p className={styles.kicker}>Zacznij po swojemu</p>
            <h2>Nie oczekujemy, że każdy od razu będzie gotowy na rozmowę</h2>
          </div>
          <div className={styles.pathGrid}>
            <article><img className={styles.pathIcon} src="/assets/path-question.svg" alt="" /><h3>Chcesz zadać anonimowe pytanie</h3><p>Przejdź do FAQ. Możesz zapytać o wszystko związane z Twoją firmą — to bezpieczny pierwszy krok.</p><a href="https://coordination.pl/faq/">Przejdź do FAQ <Arrow /></a></article>
            <article><img className={styles.pathIcon} src="/assets/path-time.svg" alt="" /><h3>Wiesz, że coś nie działa, ale potrzebujesz czasu</h3><p>Dołącz do zamkniętej społeczności i zobacz, jak rozmawiamy o strategii, sprzedaży i produkcji.</p><a href="https://coordination.pl/spolecznosc/">Dołącz do społeczności <Arrow /></a></article>
            <article><img className={styles.pathIcon} src="/assets/path-conversation.svg" alt="" /><h3>Jesteś gotowy na rozmowę</h3><p>Umów bezpłatną konsultację. Poznamy Twoją sytuację i wspólnie sprawdzimy, czy dalsza współpraca ma sens.</p><a href="#kontakt">Umów rozmowę <Arrow /></a></article>
          </div>
        </section>

        <section className={styles.start}>
          <div className={styles.sectionIntro}>
            <p className={styles.kicker}>Bez ryzyka i deklaracji</p>
            <h2>Jak zaczyna się doradztwo strategiczne dla małej firmy</h2>
            <p>Najpierw odbywamy trzy bezpłatne spotkania robocze, podczas których analizujemy firmę, sprzedaż, ofertę, klientów oraz miejsca utraty marży, czasu lub kontroli.</p>
          </div>
          <div className={styles.startGrid}>
            <article><b>01.</b><h3>Po pierwsze</h3><p>Sprawdzamy, czy Twoja firma jest właściwym miejscem do tego typu pracy i czy możemy realnie wnieść wartość.</p></article>
            <article><b>02.</b><h3>Po drugie</h3><p>Ty sprawdzasz, czy nasz sposób analizy, zadawania pytań i pracy nad decyzjami odpowiada temu, czego potrzebujesz.</p></article>
          </div>
          <p className={styles.centerNote}>Dopiero po tych spotkaniach podejmujemy decyzję, czy wchodzimy we właściwą współpracę. Jeżeli nie ma dopasowania — nie kontynuujemy.</p>
        </section>

        <section className={styles.industries}>
          <div className={styles.sectionIntro}>
            <p className={styles.kicker}>Właściwe dopasowanie</p>
            <h2>Dla jakich firm jest ta współpraca</h2>
            <p>Pracujemy z właścicielami firm, które już działają, mają klientów, zespół i powtarzalne przychody, ale zaczynają odczuwać, że dalszy rozwój nie może opierać się wyłącznie na intuicji, osobistym zaangażowaniu właściciela i gaszeniu bieżących problemów.</p>
          </div>
          <div className={styles.industryGrid}>
            {industries.map(([image, title, copy], index) => (
              <article key={title}>
                <div className={styles.industryVisual}>
                  <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <img src={image} alt="" />
                </div>
                <div className={styles.industryCopy}><h3>{title}</h3><p>{copy}</p></div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.process} id="proces">
          <div className={styles.sectionIntro}>
            <p className={styles.kicker}>Od diagnozy do samodzielności</p>
            <h2>Jeden spójny proces zmiany</h2>
          </div>
          <div className={styles.processList}>
            {process.map(([number, title, copy, image], index) => (
              <article key={number} className={index % 2 ? styles.processReverse : undefined}>
                <div className={styles.processImage}><img src={image} alt="" /></div>
                <div className={styles.processCopy}><span>{number}.</span><h3>{title}</h3><p>{copy}</p></div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.consultation} id="kontakt">
          <div className={styles.consultationInner}>
            <div className={styles.consultationCopy}>
              <h2>Czas porozmawiać o Twojej firmie</h2>
              <p>Ta rozmowa to Twój pierwszy krok do uporządkowania strategii, sprzedaży i marketingu w jeden spójny system.</p>
              <a className={styles.primaryButton} href="mailto:kontakt@coordination.pl?subject=Bezpłatna konsultacja">Umów bezpłatną konsultację</a>
            </div>
            <img src="/assets/testimonial.png" alt="Szymon Pirko wskazujący na treść konsultacji" />
          </div>
        </section>

        <section className={styles.testimonial}>
          <blockquote>
            <h2>Z ręką na sercu polecam usługi</h2>
            <p>Z ręką na sercu polecam usługi firmy. Szymon to niesamowicie kompetentna osoba z ogromną wiedzą w temacie przedsiębiorczości i rozwoju osobistego. Do klientów podchodzi z pełnym profesjonalizmem i zaangażowaniem. Super atmosfera, można się czuć swobodnie podczas konsultacji.</p>
            <footer><strong>Adrian Mech</strong><small>CEO Inoveria</small></footer>
          </blockquote>
        </section>

        <section className={styles.about} id="o-nas">
          <div className={styles.aboutTitle}><p className={styles.kicker}>Dlaczego Coordination</p><h2>Mała firma nie potrzebuje więcej chaosu. Potrzebuje spójnych decyzji.</h2></div>
          <div className={styles.aboutCopy}>
            <p>W wielu małych firmach sprzedaż działa osobno, marketing osobno, realizacja osobno, a właściciel próbuje łączyć wszystko własnym czasem i energią. Nowa kampania, handlowiec czy proces mogą tylko zwiększyć chaos, jeśli firma nie wie, komu chce sprzedawać, na czym zarabia i według jakich zasad podejmuje decyzje.</p>
            <p>Coordination powstało po to, aby pomagać właścicielom zobaczyć firmę jako jeden system. Strategia, model biznesowy, sprzedaż, marketing, oferta i decyzje właścicielskie stają się elementami jednego sposobu działania.</p>
          </div>
        </section>

        <section className={styles.media}>
          <div className={styles.sectionIntro}><p className={styles.kicker}>Materiały bezpłatne</p><h2>Posłuchaj nas</h2></div>
          <div className={styles.mediaGrid}>
            <a href="https://open.spotify.com/show/0dlekJRAAzprqI93yYABGf" target="_blank" rel="noreferrer"><img src="/assets/spotify.webp" alt="Spotify" /></a>
            <a href="https://www.youtube.com/@szymon_pirko" target="_blank" rel="noreferrer"><img src="/assets/youtube.webp" alt="YouTube" /></a>
            <a href="https://podcasts.apple.com/us/podcast/podcast-pno-pozytywny-networking-online/id1722037002" target="_blank" rel="noreferrer"><img src="/assets/apple-podcasts.webp" alt="Apple Podcasts" /></a>
          </div>
        </section>

        <section className={styles.knowledge} id="wiedza">
          <div className={styles.sectionHeaderRow}><div><p className={styles.kicker}>Baza wiedzy</p><h2>Najnowsze wpisy</h2></div><a href="https://coordination.pl/blog-coordination/">Zobacz wszystkie <Arrow /></a></div>
          <div className={styles.articleGrid}>
            {articles.map(([image, date, title]) => (
              <article key={title}>
                <img src={image} alt="" />
                <p>{date} <i /> autorstwa Szymon Pirko</p>
                <h3>{title}</h3>
                <a href="https://coordination.pl/blog-coordination/">Czytaj <Arrow /></a>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerGrid}>
          <div className={styles.footerBrand}><img src="/assets/logo.svg" alt="Coordination" /><p>Firmy rosną szybciej, gdy strategia, sprzedaż i marketing działają jako jeden system. My ten system projektujemy i wdrażamy.</p><div><a href="https://www.facebook.com/groups/804139875408843/">f</a><a href="https://www.instagram.com/coordination.pl/">◎</a><a href="https://www.linkedin.com/in/szymon-pirko-bb00271b1/">in</a></div></div>
          <div><h3>Firma</h3><a href="#dla-kogo">Doradztwo dla firm</a><a href="#proces">Jak pracujemy</a><a href="#wsparcie">Obszary wsparcia</a><a href="#o-nas">Poznaj nas lepiej</a><a href="#kontakt">Kontakt</a></div>
          <div><h3>Zasoby</h3><a href="#wiedza">Baza wiedzy</a><a href="https://coordination.pl/spolecznosc/">Społeczność</a><a href="https://coordination.pl/podcast-pno/">Podcast</a><a href="https://coordination.pl/faq/">FAQ Hub</a></div>
          <div><h3>Szybki kontakt</h3><a href="mailto:kontakt@coordination.pl">kontakt@coordination.pl</a><a href="tel:+48790485873">+48 790 485 873</a></div>
        </div>
        <div className={styles.footerBottom}>Copyright © 2026 Coordination <span>|</span> <a href="https://coordination.pl/regulamin/">Regulamin</a> <span>|</span> <a href="https://coordination.pl/polityka-prywatnosci/">Polityka prywatności</a></div>
      </footer>
    </>
  );
}
