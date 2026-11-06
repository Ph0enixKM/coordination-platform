import BrandHero from "@/components/BrandHero/BrandHero";
import SystemOfWork from "@/components/SystemOfWork/SystemOfWork";
import Pricing from "@/components/Pricing/Pricing";
import ContactMail from "@/components/ContactMail/ContactMail";
import Principles from "@/components/Principles/Principles";
import Footer from "@/components/Footer/Footer";
import SocialMedia from "@/components/SocialMedia/SocialMedia";
import SiteNav from "@/components/SiteNav/SiteNav";
import LatestPost from "@/components/LatestPost/LatestPost";
import FirmFinder from "@/components/FirmFinder/FirmFinder";
import HelpFinder from "@/components/HelpFinder/HelpFinder";
import ProcessTimeline from "@/components/ProcessTimeline/ProcessTimeline";
import ReadinessPaths from "@/components/ReadinessPaths/ReadinessPaths";

// Static: rendering this page per request cost ~35 ms of CPU against the free
// Workers plan's 10 ms. The newest post, its only changing part, is fetched by
// the browser (see LatestPost).
export default function Home() {
  return (
    <>
      <SiteNav />
      <main>
        <BrandHero />
        <SystemOfWork />
        <FirmFinder />
        <HelpFinder />
        <Principles />
        <ProcessTimeline />
        <SocialMedia />
        <Pricing />
        <ReadinessPaths />
        <ContactMail />
        <LatestPost />
      </main>
      <Footer />
    </>
  );
}
