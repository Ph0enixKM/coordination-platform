import BrandHero from "@/components/BrandHero/BrandHero";
import SystemOfWork from "@/components/SystemOfWork/SystemOfWork";
import Pricing from "@/components/Pricing/Pricing";
import ContactMail from "@/components/ContactMail/ContactMail";
import Principles from "@/components/Principles/Principles";
import Footer from "@/components/Footer/Footer";

export default function Home() {
  return (
    <>
      <main>
        <BrandHero />
        <SystemOfWork />
        <Principles />
        <Pricing />
        <ContactMail />
      </main>
      <Footer />
    </>
  );
}
