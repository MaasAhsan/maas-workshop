"use client";

import { useState } from "react";
import { Download, Github, Star } from "lucide-react";
import Image from "next/image";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { cn, formatDate } from "@/lib/utils";

export interface ProjectCardProps {
  project: {
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
  };
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [expanded, setExpanded] = useState(false);
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

  const displayDescription = project.shortDesc || project.description;
  const isLong = displayDescription.length > 180;

  return (
    <Card
      className={cn(
        "flex flex-col h-full overflow-hidden",
        project.featured && "border-accent/50 shadow-[0_0_0_1px_rgba(var(--accent-rgb),0.2)]"
      )}
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-5 bg-surface border border-border">
        {project.thumbnail ? (
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-surface to-accent/20 flex items-center justify-center">
            <Github size={28} className="text-accent/60" />
          </div>
        )}
        {project.featured && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-accent/90 text-white border-accent/30">
              <Star size={10} className="mr-1" />
              Featured
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1">
        {/* Version + Tags */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          <Badge className="border-accent/30 text-accent">v{project.version}</Badge>
          {project.tags.slice(0, 3).map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold tracking-tight mb-1.5">{project.title}</h3>

        {/* Description with progressive disclosure */}
        <p
          className="text-sm text-muted leading-relaxed mb-5"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: expanded ? "unset" : 2,
            WebkitBoxOrient: "vertical",
            overflow: expanded ? "visible" : "hidden",
          }}
        >
          {displayDescription}
        </p>
        {isLong && (
          <button
            onClick={() => setExpanded((e) => !e)}
            className="text-sm text-accent hover:underline mb-5 inline-flex items-center gap-1"
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        )}

        {/* Footer */}
        <div className="mt-auto pt-5 border-t border-border/50 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {project.downloadCount > 0 && (
                <span className="text-xs text-muted">
                  {project.downloadCount.toLocaleString()} downloads
                </span>
              )}
              <span className="text-xs text-muted">
                Updated {formatDate(project.updatedAt)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              className="flex-1"
              onClick={handleDownload}
              disabled={downloading}
            >
              <Download size={14} />
              {downloading ? "Downloading..." : "Download"}
            </Button>
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border border-border text-muted hover:text-text hover:bg-surface-hover transition-colors"
              >
                <Github size={14} /> Source
              </a>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}