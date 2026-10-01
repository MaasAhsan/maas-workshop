import { Reveal } from "./Reveal";

export function About() {
  return (
    <section id="about" className="py-20 md:py-32 px-6 max-w-6xl mx-auto">
      <Reveal>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">About me</h2>
        <div className="w-16 h-1 bg-accent rounded-full mb-10" />
      </Reveal>

      <div className="max-w-2xl">
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

      </div>
    </section>
  );
}
