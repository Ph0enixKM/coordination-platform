import BrandHero from "@/components/BrandHero/BrandHero";
import SystemOfWork from "@/components/SystemOfWork/SystemOfWork";
import Pricing from "@/components/Pricing/Pricing";
import ContactMail from "@/components/ContactMail/ContactMail";
import Principles from "@/components/Principles/Principles";
import Footer from "@/components/Footer/Footer";
import SocialMedia from "@/components/SocialMedia/SocialMedia";
import SiteNav from "@/components/SiteNav/SiteNav";
import LatestPost from "@/components/LatestPost/LatestPost";
import { readLatestPost } from "@/lib/blog/latest";

// Rendered per request for the newest post, which comes from memory, not D1.
export const dynamic = "force-dynamic";

export default async function Home() {
  const { post, check } = await readLatestPost();

  return (
    <>
      <SiteNav />
      <main>
        <BrandHero />
        <SystemOfWork />
        <Principles />
        <SocialMedia />
        <Pricing />
        <ContactMail />
        <LatestPost post={post} check={check} />
      </main>
      <Footer />
    </>
  );
}
