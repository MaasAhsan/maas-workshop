import { Mail, Github } from "lucide-react";
import { Reveal } from "./Reveal";

export function Contact() {
  return (
    <section id="contact" className="py-20 md:py-32 px-6 max-w-6xl mx-auto">
      <Reveal>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Get in touch</h2>
        <div className="w-16 h-1 bg-accent rounded-full mb-10" />
      </Reveal>

      <Reveal delay={100}>
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="mailto:makarimsusanto19@gmail.com"
            className="inline-flex items-center gap-3 px-6 py-4 rounded-xl border border-border bg-surface hover:bg-surface-hover transition-colors group"
          >
            <Mail size={20} className="text-accent" />
            <span className="text-text group-hover:text-white">makarimsusanto19@gmail.com</span>
          </a>
          <a
            href="https://github.com/makarimsuso"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-4 rounded-xl border border-border bg-surface hover:bg-surface-hover transition-colors group"
          >
            <Github size={20} className="text-accent" />
            <span className="text-text group-hover:text-white">GitHub</span>
          </a>
        </div>
      </Reveal>
    </section>
  );
}
