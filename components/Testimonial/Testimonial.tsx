import styles from "./Testimonial.module.css";

export default function Testimonial() {
  return (
    <section className={styles.testimonial}>
      <blockquote>
        <h2>Z ręką na sercu polecam usługi</h2>
        <p>Z ręką na sercu polecam usługi firmy. Szymon to niesamowicie kompetentna osoba z ogromną wiedzą w temacie przedsiębiorczości i rozwoju osobistego. Do klientów podchodzi z pełnym profesjonalizmem i zaangażowaniem. Super atmosfera, można się czuć swobodnie podczas konsultacji.</p>
        <footer><strong>Adrian Mech</strong><small>CEO Inoveria</small></footer>
      </blockquote>
    </section>
  );
}
