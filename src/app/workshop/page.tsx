"use client";

import { useEffect, useState } from "react";
import { ProjectCard } from "@/components/ProjectCard";
import { Reveal } from "@/components/Reveal";
import { Card } from "@/components/ui/Card";
import { FolderGit2 } from "lucide-react";

export interface Project {
  id: string;
  title: string;
  description: string;
  shortDesc: string | null;
  thumbnail: string | null;
  version: string;
  tags: string[];
  downloadUrl: string;
  repoUrl: string | null;
  downloadCount: number;
  featured: boolean;
  updatedAt: Date | string;
}

export default function WorkshopPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/projects");
        if (!res.ok) throw new Error("Failed to fetch projects");
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <section id="workshop" className="py-20 md:py-32 px-6 max-w-6xl mx-auto">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Workshop</h2>
          <p className="text-muted mb-12">All projects available for download</p>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Reveal key={i} delay={100 + i * 100}>
              <Card className="flex flex-col h-full animate-pulse">
                <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-5 bg-surface border border-border" />
                <div className="h-4 bg-surface w-3/4 rounded mb-2" />
                <div className="h-3 bg-surface w-full rounded mb-2" />
                <div className="h-3 bg-surface w-2/3 rounded mb-5" />
                <div className="mt-auto pt-5 border-t border-border/50 h-10" />
              </Card>
            </Reveal>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="workshop" className="py-20 md:py-32 px-6 max-w-6xl mx-auto">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Workshop</h2>
          <p className="text-muted mb-12">All projects available for download</p>
        </Reveal>
        <Reveal delay={100}>
          <Card className="py-14 text-center">
            <FolderGit2 size={28} className="text-destructive mx-auto mb-3" />
            <p className="text-muted">Failed to load projects: {error}</p>
          </Card>
        </Reveal>
      </section>
    );
  }

  return (
    <section id="workshop" className="py-20 md:py-32 px-6 max-w-6xl mx-auto">
      <Reveal>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Workshop</h2>
        <p className="text-muted mb-12">All projects available for download</p>
      </Reveal>

      {projects.length === 0 ? (
        <Reveal delay={100}>
          <Card className="py-14 text-center">
            <FolderGit2 size={28} className="text-accent mx-auto mb-3" />
            <p className="text-muted">No projects yet — check back soon.</p>
          </Card>
        </Reveal>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </section>
  );
}