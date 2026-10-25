import HeroSection from "@/components/sections/HeroSection";
import PhilosophySection from "@/components/sections/PhilosophySection";
import CoffeeShowcase from "@/components/sections/CoffeeShowcase";
import MoodCollection from "@/components/sections/MoodCollection";
import MoodDiscovery from "@/components/sections/MoodDiscovery";
import RitualSection from "@/components/sections/RitualSection";
import BrandStorySection from "@/components/sections/BrandStorySection";
import FaqSection from "@/components/sections/FaqSection";
import WaitlistSection from "@/components/sections/WaitlistSection";
import FinalCTASection from "@/components/sections/FinalCTASection";

export default function Home() {
  return (<>
    <HeroSection /><PhilosophySection /><CoffeeShowcase /><MoodCollection /><MoodDiscovery />
    <RitualSection /><BrandStorySection /><FaqSection /><FinalCTASection /><WaitlistSection />
  </>);
}
