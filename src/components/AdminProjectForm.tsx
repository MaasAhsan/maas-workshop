"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Textarea } from "./ui/Textarea";
import { ModalHeader, ModalContent } from "./ui/Modal";
import { useToast } from "./ui/Toast";
import { cn, stringifyTags } from "@/lib/utils";

export interface AdminProjectFormProps {
  project: {
    id?: string;
    title: string;
    description: string;
    shortDesc: string;
    version: string;
    tags: string;
    downloadUrl: string;
    repoUrl: string;
    featured: boolean;
    thumbnail: string | null;
  } | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function AdminProjectForm({ project, onClose, onSuccess }: AdminProjectFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [version, setVersion] = useState("1.0.0");
  const [tags, setTags] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [featured, setFeatured] = useState(false);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  useEffect(() => {
    if (project) {
      setTitle(project.title);
      setDescription(project.description);
      setShortDesc(project.shortDesc || "");
      setVersion(project.version);
      setTags(project.tags);
      setDownloadUrl(project.downloadUrl);
      setRepoUrl(project.repoUrl || "");
      setFeatured(project.featured);
      setThumbnail(project.thumbnail);
      setThumbnailPreview(project.thumbnail);
    } else {
      setTitle("");
      setDescription("");
      setShortDesc("");
      setVersion("1.0.0");
      setTags("");
      setDownloadUrl("");
      setRepoUrl("");
      setFeatured(false);
      setThumbnail(null);
      setThumbnailPreview(null);
    }
  }, [project]);

  function validateForm(): boolean {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!downloadUrl.trim()) newErrors.downloadUrl = "Download URL is required";
    if (downloadUrl && !isValidUrl(downloadUrl)) newErrors.downloadUrl = "Invalid URL format";
    if (repoUrl && !isValidUrl(repoUrl)) newErrors.repoUrl = "Invalid URL format";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  async function handleThumbnailUpload(file: File) {
    if (!file.type.startsWith("image/")) {
      toast("File must be an image", "error");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast("File must be under 5MB", "error");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload-thumbnail", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Upload failed");
      }
      const data = await res.json();
      setThumbnail(data.url);
      setThumbnailPreview(data.url);
      toast("Thumbnail uploaded");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Upload failed", "error");
    } finally {
      setUploading(false);
    }
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setThumbnailPreview(event.target?.result as string);
      reader.readAsDataURL(file);
      handleThumbnailUpload(file);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        shortDesc: shortDesc.trim() || null,
        version: version.trim(),
        tags: stringifyTags(tags.split(",").map(t => t.trim()).filter(Boolean)),
        downloadUrl: downloadUrl.trim(),
        repoUrl: repoUrl.trim() || null,
        featured,
        thumbnail,
      };

      const url = project ? `/api/projects/${project.id}` : "/api/projects";
      const method = project ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save project");
      }

      toast(project ? "Project updated" : "Project created", "success");
      onSuccess();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to save", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ModalContent className="max-w-3xl">
      <ModalHeader title={project ? "Edit Project" : "New Project"} onClose={onClose} />
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Input
              id="title"
              label="Title *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Project title"
              error={errors.title}
            />
          </div>

          <div className="md:col-span-2">
            <Textarea
              id="description"
              label="Description *"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Full project description (markdown supported)"
              rows={4}
              error={errors.description}
            />
          </div>

          <div>
            <label htmlFor="shortDesc" className="block text-sm font-medium mb-1.5">Short Description</label>
            <Input
              id="shortDesc"
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              placeholder="Brief description for cards (optional)"
            />
          </div>

          <div>
            <label htmlFor="version" className="block text-sm font-medium mb-1.5">Version *</label>
            <Input
              id="version"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="1.0.0"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="tags" className="block text-sm font-medium mb-1.5">Tags (comma-separated)</label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="react, nextjs, typescript"
            />
            <p className="text-xs text-muted mt-1">Tags used for filtering and display</p>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="downloadUrl" className="block text-sm font-medium mb-1.5">Download URL *</label>
            <Input
              id="downloadUrl"
              type="url"
              value={downloadUrl}
              onChange={(e) => setDownloadUrl(e.target.value)}
              placeholder="https://github.com/user/repo/releases/download/..."
              error={errors.downloadUrl}
            />
            <p className="text-xs text-muted mt-1">Direct link to GitHub Release asset</p>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="repoUrl" className="block text-sm font-medium mb-1.5">Repository URL</label>
            <Input
              id="repoUrl"
              type="url"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/user/repo"
              error={errors.repoUrl}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="featured" className="flex items-center gap-2 cursor-pointer">
              <input
                id="featured"
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded border-border bg-surface text-accent focus:ring-accent"
              />
              <span className="text-sm font-medium">Featured on homepage</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Thumbnail</label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
                className="sr-only"
                id="thumbnail-upload"
              />
              <div
                className="relative aspect-video rounded-xl border-2 border-dashed border-border bg-surface hover:border-accent/50 transition-colors cursor-pointer"
                onClick={() => document.getElementById("thumbnail-upload")?.click()}
              >
                {thumbnailPreview ? (
                  <>
                    <Image
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      width={600}
                      height={338}
                      className="rounded-lg object-cover w-full h-full"
                    />
                    {uploading && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                    <Upload size={32} className="text-muted mb-2" />
                    <p className="text-sm text-muted">Click to upload thumbnail</p>
                    <p className="text-xs text-muted/60">Max 5MB, JPG/PNG/WebP</p>
                  </div>
                )}
              </div>
              {thumbnailPreview && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 rounded-full bg-black/50 text-white hover:bg-black/70"
                  onClick={(e) => {
                    e.preventDefault();
                    setThumbnail(null);
                    setThumbnailPreview(null);
                    document.getElementById("thumbnail-upload")?.setAttribute("value", "");
                  }}
                >
                  <X size={14} />
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/50">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={submitting} className="min-w-[140px]">
            {submitting ? "Saving..." : project ? "Save Changes" : "Create Project"}
          </Button>
        </div>
      </form>
    </ModalContent>
  );
}