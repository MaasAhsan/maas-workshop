import { Heart } from "lucide-react";
import { Reveal } from "./Reveal";

export function Support() {
  return (
    <section id="support" className="py-20 md:py-32 px-6 max-w-6xl mx-auto">
      <Reveal>
        <div className="rounded-2xl border border-border bg-surface p-10 md:p-16 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 mb-6">
            <Heart size={22} className="text-accent" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Support my work</h2>
          <p className="text-muted mb-8 max-w-md mx-auto">
            If something I built helped you, a coffee would keep the vibecoding going.
          </p>
          <a
            href="https://buymeacoffee.com/makarimsuso"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3 text-base font-medium rounded-xl bg-accent text-white hover:bg-accent-hover transition-colors shadow-sm"
          >
            <Heart size={18} /> Buy me a coffee
          </a>
        </div>
      </Reveal>
    </section>
  );
}
