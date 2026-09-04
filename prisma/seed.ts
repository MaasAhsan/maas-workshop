import { PrismaClient } from "@prisma/client";
import { stringifyTags } from "../src/lib/utils";

const prisma = new PrismaClient();

const demoProjects = [
  {
    title: "VibeTerm",
    description:
      "A terminal-style app builder that turns natural-language prompts into working TUIs. Built while vibecoding over a weekend — handles command parsing, history, and themes out of the box.",
    shortDesc: "Turn prompts into working terminal apps.",
    version: "1.2.0",
    tags: ["AI", "CLI", "TypeScript"],
    downloadUrl: "https://github.com/makarimsuso/vibeterm/releases/download/v1.2.0/vibeterm-setup.exe",
    repoUrl: "https://github.com/makarimsuso/vibeterm",
    featured: true,
    order: 0,
  },
  {
    title: "PromptStack",
    description:
      "A local-first library for organizing and testing AI prompts. Save, version, and A/B test prompt variants against any model. Syncs nothing to the cloud.",
    shortDesc: "Organize and A/B test AI prompts locally.",
    version: "0.9.1",
    tags: ["AI", "Tool", "Electron"],
    downloadUrl: "https://github.com/makarimsuso/promptstack/releases/download/v0.9.1/promptstack-win.zip",
    repoUrl: "https://github.com/makarimsuso/promptstack",
    featured: true,
    order: 1,
  },
  {
    title: "AutoDeck AI Web Assistant",
    description:
      "An AI assistant that helps build web slides fast — one of the projects I keep coming back to. Docs, decks, and demos all generated from a single brief.",
    shortDesc: "AI assistant for building web slides fast.",
    version: "1.0.0",
    tags: ["AI", "Web"],
    downloadUrl: "https://github.com/makarimsuso/autodeck/releases/download/v1.0.0/autodeck.zip",
    repoUrl: "https://github.com/makarimsuso/autodeck",
    featured: true,
    order: 2,
  },
  {
    title: "Notaker",
    description:
      "A small cross-platform notes board with a dark theme. Learn how it was built over in the repo.",
    shortDesc: "Cross-platform notes board.",
    version: "0.4.2",
    tags: ["Tauri", "Rust", "Notes"],
    downloadUrl: "https://github.com/makarimsuso/notaker/releases/download/v0.4.2/notaker-win.zip",
    repoUrl: "https://github.com/makarimsuso/notaker",
    featured: false,
    order: 3,
  },
];

async function main() {
  const count = await prisma.project.count();
  if (count > 0) {
    console.log(`Seed skipped — ${count} projects already exist.`);
    return;
  }
  for (const p of demoProjects) {
    await prisma.project.create({
      data: {
        title: p.title,
        description: p.description,
        shortDesc: p.shortDesc,
        version: p.version,
        tags: stringifyTags(p.tags),
        downloadUrl: p.downloadUrl,
        repoUrl: p.repoUrl,
        featured: p.featured,
        order: p.order,
      },
    });
  }
  console.log(`Seeded ${demoProjects.length} demo projects.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
