"use client";
import { useState } from "react";
import { Mail, Github, Copy, Check } from "lucide-react";
import { Reveal } from "./Reveal";

// Address is assembled on click so it is not in the served HTML for scrapers.
const USER = "makarimsusanto19";
const HOST = "gmail.com";

export function Contact() {
  const [email, setEmail] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked: the address is shown selectable, so the user can copy by hand.
    }
  };

  return (
    <section id="contact" className="py-20 md:py-32 px-6 max-w-6xl mx-auto">
      <Reveal>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Get in touch</h2>
        <div className="w-16 h-1 bg-accent rounded-full mb-10" />
      </Reveal>

      <Reveal delay={100}>
        <div className="flex flex-col sm:flex-row gap-4 sm:items-stretch">
          {email ? (
            <div className="inline-flex flex-wrap items-center gap-3 px-6 py-4 rounded-xl border border-border bg-surface">
              <Mail size={20} className="text-accent" />
              <span className="text-text select-all break-all">{email}</span>
              <button
                type="button"
                onClick={copy}
                aria-label="Copy email address"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-border text-muted hover:text-text hover:bg-surface-hover transition-colors"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
              </button>
              <a
                href={`mailto:${email}`}
                className="text-sm text-accent hover:underline"
              >
                Open mail app
              </a>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setEmail(`${USER}@${HOST}`)}
              className="inline-flex items-center gap-3 px-6 py-4 rounded-xl border border-border bg-surface hover:bg-surface-hover transition-colors group text-left"
            >
              <Mail size={20} className="text-accent" />
              <span className="text-text group-hover:text-white">Show email</span>
            </button>
          )}
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
