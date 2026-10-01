"use client";
import { useState } from "react";
import { Mail, Github } from "lucide-react";
import { Reveal } from "./Reveal";

// Address is assembled on click so it is not in the served HTML for scrapers.
const USER = "makarimsusanto19";
const HOST = "gmail.com";

export function Contact() {
  const [email, setEmail] = useState<string | null>(null);
  const reveal = () => {
    const addr = `${USER}@${HOST}`;
    setEmail(addr);
    window.location.href = `mailto:${addr}`;
  };

  return (
    <section id="contact" className="py-20 md:py-32 px-6 max-w-6xl mx-auto">
      <Reveal>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Get in touch</h2>
        <div className="w-16 h-1 bg-accent rounded-full mb-10" />
      </Reveal>

      <Reveal delay={100}>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="button"
            onClick={reveal}
            className="inline-flex items-center gap-3 px-6 py-4 rounded-xl border border-border bg-surface hover:bg-surface-hover transition-colors group text-left"
          >
            <Mail size={20} className="text-accent" />
            <span className="text-text group-hover:text-white">{email ?? "Email me"}</span>
          </button>
          <a
            href="https://github.com/MaasAhsan"
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
