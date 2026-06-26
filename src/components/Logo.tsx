import logoUrl from "@/assets/logo.svg";

type LogoProps = { className?: string; showText?: boolean };

export function Logo(props: LogoProps = {}) {
  const className = typeof props.className === "string" && props.className.length > 0 ? props.className : "h-10 w-10";
  const showText = props.showText === true;
  return (
    <div className="flex items-center gap-3">
      <img src={logoUrl} alt="Pousada Ilha do Meio" className={className} />
      {showText ? (
        <div className="leading-tight">
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Pousada</div>
          <div className="font-display text-lg font-semibold">Ilha do Meio</div>
        </div>
      ) : null}
    </div>
  );
}
