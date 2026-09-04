import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { ProjectsSection } from "@/components/ProjectsSection";
import { Support } from "@/components/Support";
import { Contact } from "@/components/Contact";
import { Reveal } from "@/components/Reveal";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col">
        <Reveal>
          <Hero />
        </Reveal>
        <Reveal delay={100}>
          <About />
        </Reveal>
        <Reveal delay={100}>
          <ProjectsSection />
        </Reveal>
        <Reveal delay={100}>
          <Support />
        </Reveal>
        <Reveal delay={100}>
          <Contact />
        </Reveal>
      </main>
    </>
  );
}
