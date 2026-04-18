import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { Steps } from "@/components/sections/Steps";
import { Projects } from "@/components/sections/Projects";
import { CTA } from "@/components/sections/CTA";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <Stats />
      <Steps />
      <Projects />
      <CTA />
      <Footer />
    </main>
  );
}
