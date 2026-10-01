"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Download, FolderGit2, Github } from "lucide-react";
import Image from "next/image";
import { Badge } from "./ui/Badge";
import { Card } from "./ui/Card";
import { Reveal } from "./Reveal";

export type FeaturedProject = {
  id: string;
  title: string;
  description: string;
  shortDesc: string | null;
  thumbnail: string | null;
  version: string;
  tags: string[];
  downloadUrl: string;
  repoUrl: string | null;
  featured: boolean;
  downloadCount: number;
  order: number;
  createdAt: Date | string;
  updatedAt: Date | string;
};

function ProjectCard({ project, index }: { project: FeaturedProject; index: number }) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await fetch(`/api/projects/${project.id}/download`, {
        method: "POST",
      });
      if (res.ok) {
        window.location.href = project.downloadUrl;
      }
    } catch (err) {
      console.error("Download tracking failed:", err);
      // Fallback: still trigger download
      window.location.href = project.downloadUrl;
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Reveal delay={100 + index * 100}>
      <Card className="flex flex-col h-full">
        {project.thumbnail ? (
          <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-5 bg-surface border border-border">
            <Image
              src={project.thumbnail}
              alt={project.title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-5 bg-gradient-to-br from-surface to-accent/20 border border-border flex items-center justify-center">
            <FolderGit2 size={28} className="text-accent/60" />
          </div>
        )}

        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          <Badge className="border-accent/30 text-accent">v{project.version}</Badge>
          {project.tags.slice(0, 3).map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>

        <h3 className="text-lg font-semibold tracking-tight mb-1.5">{project.title}</h3>
        <p className="text-sm text-muted leading-relaxed mb-5 line-clamp-3">
          {project.shortDesc || project.description}
        </p>

        <div className="mt-auto pt-5 border-t border-border/50 flex items-center gap-2">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-accent text-white hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={15} /> {downloading ? "Downloading..." : "Download"}
          </button>
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border border-border text-muted hover:text-text hover:bg-surface-hover transition-colors"
            >
              <Github size={15} /> Source
            </a>
          )}
        </div>
      </Card>
    </Reveal>
  );
}

export function ProjectsSection({ projects }: { projects: FeaturedProject[] }) {
  return (
    <section id="projects" className="py-16 md:py-24 px-6 max-w-6xl mx-auto">
      <Reveal>
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Latest from the workshop</h2>
            <p className="text-muted">Grab a build, read the source, make it yours.</p>
          </div>
          <Link href="/workshop" className="hidden sm:inline-flex items-center gap-1.5 text-sm text-accent hover:underline shrink-0">
            All projects <ArrowRight size={14} />
          </Link>
        </div>
      </Reveal>

      {projects.length === 0 ? (
        <Card className="py-14 text-center">
          <FolderGit2 size={28} className="text-accent mx-auto mb-3" />
          <p className="text-muted">New builds are on the way.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      )}
      <Link href="/workshop" className="sm:hidden mt-6 inline-flex items-center gap-1.5 text-sm text-accent hover:underline">
        All projects <ArrowRight size={14} />
      </Link>
    </section>
  );
}
