import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { Logo } from "@/components/Logo";

type LegalPageProps = {
  eyebrow: string;
  title: string;
  intro?: string;
  children: ReactNode;
};

export function LegalPageLayout({ eyebrow, title, intro, children }: LegalPageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Topbar minimal */}
      <header className="border-b border-border/60">
        <div className="mx-auto max-w-4xl px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Logo className="h-9 w-9" />
            <span className="font-display text-base font-semibold tracking-tight">
              Pousada Ilha do Meio
            </span>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Voltar ao site
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-16 md:py-24">
          <p className="text-[11px] uppercase tracking-[0.22em] text-primary font-medium mb-4">
            {eyebrow}
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight text-foreground">
            {title}
          </h1>
          {intro ? (
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              {intro}
            </p>
          ) : null}

          <div className="mt-12 space-y-10 text-[15px] leading-relaxed text-muted-foreground">
            {children}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-xl font-semibold text-foreground tracking-tight">
        {title}
      </h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}
