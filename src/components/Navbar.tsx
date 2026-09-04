"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, ExternalLink } from "lucide-react";
import { Button } from "./ui/Button";

export function Navbar() {
  const [isOwner, setIsOwner] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((d) => setIsOwner(!!d.isOwner))
      .catch(() => {});
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setIsOwner(false);
    window.location.href = "/";
  }

  const links = [
    { href: "/#", label: "Home" },
    { href: "/workshop", label: "Workshop" },
    { href: "https://buymeacoffee.com/makarimsuso", label: "Support", external: true },
    { href: "/#contact", label: "Contact" },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-bg/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold tracking-tight lowercase">
          maasworkshop
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) =>
            l.external ? (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 text-sm text-muted hover:text-text transition-colors inline-flex items-center gap-1"
              >
                {l.label} <ExternalLink size={12} />
              </a>
            ) : (
              <Link
                key={l.label}
                href={l.href}
                className="px-3 py-1.5 text-sm text-muted hover:text-text transition-colors"
              >
                {l.label}
              </Link>
            )
          )}
        </div>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-2">
          {isOwner ? (
            <>
              <Link href="/workshop/admin">
                <Button size="sm" variant="secondary">Admin</Button>
              </Link>
              <Button size="sm" variant="ghost" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <Link
              href="/workshop/admin"
              className="text-sm text-muted hover:text-text transition-colors"
            >
              Owner login
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-muted"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/50 bg-bg px-6 py-4 flex flex-col gap-2">
          {links.map((l) =>
            l.external ? (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 text-sm text-muted hover:text-text"
              >
                {l.label}
              </a>
            ) : (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="py-2 text-sm text-muted hover:text-text"
              >
                {l.label}
              </Link>
            )
          )}
          <div className="pt-3 border-t border-border/30 mt-2">
            {isOwner ? (
              <div className="flex gap-2">
                <Link href="/workshop/admin" onClick={() => setMobileOpen(false)}>
                  <Button size="sm" variant="secondary">Admin</Button>
                </Link>
                <Button size="sm" variant="ghost" onClick={handleLogout}>Logout</Button>
              </div>
            ) : (
              <Link
                href="/workshop/admin"
                onClick={() => setMobileOpen(false)}
                className="text-sm text-muted hover:text-text"
              >
                Owner login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
