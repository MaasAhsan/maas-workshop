import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { ProjectsSection, type FeaturedProject } from "@/components/ProjectsSection";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

async function getHomeProjects(): Promise<FeaturedProject[]> {
  try {
    const rows = await prisma.project.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    const parsed = rows.map((p) => {
      let tags: string[] = [];
      try {
        const t = JSON.parse(p.tags);
        if (Array.isArray(t)) tags = t;
      } catch {}
      return { ...p, tags, createdAt: p.createdAt.toISOString(), updatedAt: p.updatedAt.toISOString() };
    });
    const featured = parsed.filter((p) => p.featured);
    return (featured.length > 0 ? featured : parsed).slice(0, 3);
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const projects = await getHomeProjects();
  return (
    <>
      <Navbar />
      <main className="flex flex-col">
        <Reveal>
          <Hero />
        </Reveal>
        <ProjectsSection projects={projects} />
        <Reveal delay={100}>
          <About />
        </Reveal>
        <Reveal delay={100}>
          <Contact />
        </Reveal>
      </main>
      <Footer />
    </>
  );
}
