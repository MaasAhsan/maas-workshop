import { Reveal } from "./Reveal";

const skills = ["Vibecoding", "AI & LLMs", "Web Dev", "Next.js", "Python", "Automation", "Prototyping", "Learning fast"];

export function About() {
  return (
    <section id="about" className="py-20 md:py-32 px-6 max-w-6xl mx-auto">
      <Reveal>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">About me</h2>
        <div className="w-16 h-1 bg-accent rounded-full mb-10" />
      </Reveal>

      <div className="grid md:grid-cols-2 gap-12 md:gap-16">
        <Reveal delay={100}>
          <p className="text-muted leading-relaxed text-lg">
            I&apos;m Makarim, a teenager who spends way too much time vibecoding — building things fast,
            learning by doing, and experimenting with AI. I like turning ideas into working tools
            and sharing what I build.
          </p>
          <p className="mt-4 text-muted leading-relaxed text-lg">
            This site is my workshop: a place to put the things I&apos;ve made so anyone can grab them,
            try them, and maybe even get inspired to build something of their own.
          </p>
        </Reveal>

        <Reveal delay={200}>
          <div className="flex flex-wrap gap-2.5">
            {skills.map((s) => (
              <span key={s} className="px-4 py-2 rounded-full text-sm bg-surface border border-border text-text hover:border-accent/40 hover:text-white transition-colors cursor-default">
                {s}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
