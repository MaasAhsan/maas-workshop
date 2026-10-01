import Link from "next/link";
import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer id="support" className="border-t border-border/50 mt-10">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted">
        <p>
          Found something useful?{" "}
          <a
            href="https://buymeacoffee.com/makarimsuso"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-accent hover:underline"
          >
            <Heart size={14} /> Buy me a coffee
          </a>
        </p>
        <div className="flex items-center gap-5">
          <span>© {new Date().getFullYear()} MAAS Workshop</span>
          <Link href="/workshop/admin" className="hover:text-text transition-colors">
            Owner
          </Link>
        </div>
      </div>
    </footer>
  );
}
