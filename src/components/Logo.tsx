import logoUrl from "@/assets/logo.svg";

export function Logo({ className = "h-10 w-10", showText = false }: { className?: string; showText?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <img src={logoUrl} alt="Pousada Ilha do Meio" className={className} />
      {showText && (
        <div className="leading-tight">
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Pousada</div>
          <div className="font-display text-lg font-semibold">Ilha do Meio</div>
        </div>
      )}
    </div>
  );
}
