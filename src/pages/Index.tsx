import SiteHeader from "../components/site/SiteHeader";
import HeroSection from "../components/site/sections/HeroSection";
import AboutSection from "../components/site/sections/AboutSection";
import ServicesSection from "../components/site/sections/ServicesSection";
import SiteFooter from "../components/site/SiteFooter";
import WhatsAppFloatingButton from "../components/site/WhatsAppFloatingButton";

export default function Index() {
  return (
    <div className="min-h-dvh bg-black text-neutral-200">
      <SiteHeader />
      <main>
        <HeroSection />
        <AboutSection />
        <ServicesSection />
      </main>
      <SiteFooter />
      <WhatsAppFloatingButton />
    </div>
  );
}