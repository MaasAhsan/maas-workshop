"use client";

import { useState, useEffect } from "react";
import {
  GripVertical,
  Edit,
  Trash2,
  Star,
  Eye,
  Download,
  ChevronUp,
  ChevronDown,
  FolderGit2,
  AlertCircle
} from "lucide-react";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import Image from "next/image";
import { cn, formatDate, parseTags } from "@/lib/utils";
import { useToast } from "./ui/Toast";

export interface AdminProject {
  id: string;
  title: string;
  description: string;
  shortDesc: string | null;
  thumbnail: string | null;
  version: string;
  tags: string;
  downloadUrl: string;
  repoUrl: string | null;
  featured: boolean;
  downloadCount: number;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export function AdminProjectList({
  onEdit,
  onAdd
}: {
  onEdit: (project: AdminProject) => void;
  onAdd: () => void;
}) {
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setProjects(data.map((p: any) => ({ ...p, tags: parseTags(p.tags) })));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  async function handleFeature(id: string, featured: boolean) {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !featured }),
      });
      if (!res.ok) throw new Error("Failed to toggle feature");
      toast("Project updated");
      fetchProjects();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to update", "error");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast("Project deleted");
      fetchProjects();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to delete", "error");
    }
  }

  async function handleReorder(newOrder: string[]) {
    try {
      const res = await fetch("/api/projects/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: newOrder }),
      });
      if (!res.ok) throw new Error("Failed to reorder");
      toast("Order saved");
      fetchProjects();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to reorder", "error");
    }
  }

  function moveProject(index: number, direction: number) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= projects.length) return;
    const newProjects = [...projects];
    [newProjects[index], newProjects[newIndex]] = [newProjects[newIndex], newProjects[index]];
    setProjects(newProjects);
    handleReorder(newProjects.map(p => p.id));
  }

  if (loading) {
    return (
      <Card className="animate-pulse">
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-surface rounded-xl" />
          ))}
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="py-14 text-center">
        <AlertCircle size={28} className="text-destructive mx-auto mb-3" />
        <p className="text-muted">Failed to load: {error}</p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="space-y-0">
        {projects.length === 0 ? (
          <div className="py-14 text-center">
            <FolderGit2 size={28} className="text-accent mx-auto mb-3" />
            <p className="text-muted mb-4">No projects yet</p>
            <Button onClick={onAdd}>Create first project</Button>
          </div>
        ) : (
          projects.map((project, index) => (
            <div
              key={project.id}
              className={cn(
                "flex items-center gap-4 p-4 border-b border-border/50 transition-colors",
                "hover:bg-surface-hover"
              )}
            >
              <Button
                variant="ghost"
                size="sm"
                className="text-muted hover:text-text cursor-grab"
                disabled
              >
                <GripVertical size={18} />
              </Button>

              {project.thumbnail ? (
                <Image
                  src={project.thumbnail}
                  alt={project.title}
                  width={60}
                  height={40}
                  className="rounded-lg object-cover border border-border"
                />
              ) : (
                <div className="w-[60px] h-10 rounded-lg bg-gradient-to-br from-surface to-accent/20 border border-border flex items-center justify-center">
                  <FolderGit2 size={18} className="text-accent/60" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold truncate">{project.title}</h3>
                  {project.featured && (
                    <Badge className="bg-accent/90 text-white border-accent/30">
                      <Star size={10} className="mr-1" /> Featured
                    </Badge>
                  )}
                  <Badge className="border-accent/30 text-accent">v{project.version}</Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted mt-1">
                  <span>{project.downloadCount.toLocaleString()} downloads</span>
                  <span>Order: {project.order + 1}</span>
                  <span>Updated {formatDate(project.updatedAt)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFeature(project.id, project.featured)}
                  title={project.featured ? "Unfeature" : "Feature"}
                >
                  <Star size={16} className={project.featured ? "text-accent" : "text-muted"} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(project)}
                  title="Edit"
                >
                  <Edit size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(project.id)}
                  title="Delete"
                >
                  <Trash2 size={16} className="text-destructive" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => moveProject(index, -1)}
                  disabled={index === 0}
                  title="Move up"
                >
                  <ChevronUp size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => moveProject(index, 1)}
                  disabled={index === projects.length - 1}
                  title="Move down"
                >
                  <ChevronDown size={16} />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}