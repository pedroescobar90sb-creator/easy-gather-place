import logoAsset from "@/assets/logo-ilha-do-meio.png.asset.json";

type LogoProps = { className?: string; showText?: boolean };

export function Logo(props: LogoProps = {}) {
  const className = typeof props.className === "string" && props.className.length > 0 ? props.className : "h-10 w-10";
  return (
    <img src={logoAsset.url} alt="Pousada Ilha do Meio · Itacimirim" className={`${className} object-contain`} />
  );
}
