"use client";

import { useEffect, useState } from "react";
import { OTPLoginForm } from "@/components/OTPLoginForm";
import { AdminProjectList } from "@/components/AdminProjectList";
import { AdminProjectForm } from "@/components/AdminProjectForm";
import { Reveal } from "@/components/Reveal";
import { Card } from "@/components/ui/Card";
import { FolderGit2, Lock, AlertCircle } from "lucide-react";

export default function WorkshopAdminPage() {
  const [isOwner, setIsOwner] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((d) => setIsOwner(!!d.isOwner))
      .catch(() => {});
  }, []);

  if (!isOwner) {
    return (
      <section className="py-20 md:py-32 px-6 max-w-6xl mx-auto">
        <Reveal>
          <div className="max-w-xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-surface border border-border mb-6">
              <Lock size={32} className="text-muted" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Admin Access</h1>
            <p className="text-muted mb-8">
              This area is restricted to the site owner. Sign in with the OTP sent to your email.
            </p>
            <OTPLoginForm onSuccess={() => setIsOwner(true)} />
          </div>
        </Reveal>
      </section>
    );
  }

  return (
    <section className="py-20 md:py-32 px-6 max-w-6xl mx-auto">
      <Reveal>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted mt-1">Manage projects: create, edit, reorder, feature, delete</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setEditingProject(null);
                setShowForm(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl bg-accent text-white hover:bg-accent-hover transition-colors"
            >
              <FolderGit2 size={16} /> New Project
            </button>
          </div>
        </div>
      </Reveal>

      <Reveal delay={100}>
        <AdminProjectList
          onEdit={(project) => {
            setEditingProject(project);
            setShowForm(true);
          }}
          onAdd={() => {
            setEditingProject(null);
            setShowForm(true);
          }}
        />
      </Reveal>

      {showForm && (
        <AdminProjectForm
          project={editingProject}
          onClose={() => {
            setShowForm(false);
            setEditingProject(null);
          }}
          onSuccess={() => {
            setShowForm(false);
            setEditingProject(null);
          }}
        />
      )}
    </section>
  );
}