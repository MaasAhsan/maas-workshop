"use client";
import { useState } from "react";
import { ChevronDown, Github, Rocket } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/Button";

const PFP_PATH = "/pfp.jpeg";

export function Hero() {
  const [pfpError, setPfpError] = useState(false);

  return (
    <section id="hero" className="relative min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center px-6 text-center">
      <div className="mb-8">
        <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-gradient-to-br from-accent to-violet-700 flex items-center justify-center text-4xl md:text-5xl font-bold text-white shadow-xl shadow-accent/20 ring-4 ring-accent/10 mx-auto">
          {!pfpError ? (
            <Image
              src={PFP_PATH}
              alt="Makarim Ahsan"
              fill
              sizes="(min-width: 768px) 10rem, 8rem"
              className="object-cover object-center scale-110"
              onError={() => setPfpError(true)}
            />
          ) : (
            <span>MA</span>
          )}
        </div>
      </div>

      <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]">
        Makarim Ahsan<span className="text-accent">,</span>
      </h1>

      <p className="mt-6 max-w-xl text-lg md:text-xl text-muted">
        A teenager who likes <span className="text-text font-medium">vibecoding</span> and doing{" "}
        <span className="text-text font-medium">AI stuff</span>.
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link href="/workshop">
          <Button size="lg">
            <Rocket size={18} /> View Projects
          </Button>
        </Link>
        <a href="https://github.com/MaasAhsan" target="_blank" rel="noopener noreferrer">
          <Button size="lg" variant="secondary">
            <Github size={18} /> GitHub
          </Button>
        </a>
      </div>

      <a href="#about" className="absolute bottom-8 text-muted hover:text-text transition-colors animate-bounce" aria-label="Scroll down">
        <ChevronDown size={24} />
      </a>
    </section>
  );
}
