import About from "@/components/About/About";
import Collaboration from "@/components/Collaboration/Collaboration";
import Consultation from "@/components/Consultation/Consultation";
import Footer from "@/components/Footer/Footer";
import GettingStarted from "@/components/GettingStarted/GettingStarted";
import Header from "@/components/Header/Header";
import Hero from "@/components/Hero/Hero";
import Industries from "@/components/Industries/Industries";
import Knowledge from "@/components/Knowledge/Knowledge";
import Media from "@/components/Media/Media";
import Paths from "@/components/Paths/Paths";
import Process from "@/components/Process/Process";
import SupportAreas from "@/components/SupportAreas/SupportAreas";
import Testimonial from "@/components/Testimonial/Testimonial";
import WhoWeHelp from "@/components/WhoWeHelp/WhoWeHelp";

export default function Home() {
  return (
    <>
      <Header />
      <main id="top">
        <Hero />
        <WhoWeHelp />
        <SupportAreas />
        <Collaboration />
        <Paths />
        <GettingStarted />
        <Industries />
        <Process />
        <Consultation />
        <Testimonial />
        <About />
        <Media />
        <Knowledge />
      </main>
      <Footer />
    </>
  );
}
