"""
Gera as variantes reduzidas das fotos usadas nas galerias.

Roda a mao, fora do build:  python scripts/gen-thumbs.py

Por que existe: as miniaturas do grid sao exibidas em ~240px de largura mas estavam
baixando o arquivo original (ate 1920x2560). Este script gera as variantes 480w e 960w
em webp, que entram no srcset. O build do Vite nao e tocado - o aviso no vite.config.ts
diz que adicionar plugin manualmente quebra o app, entao nada de plugin de imagem.

Tambem imprime as dimensoes originais, prontas pra colar como width/height nos itens
da galeria (evita salto de layout enquanto a foto carrega).
"""

from pathlib import Path

from PIL import Image

ASSETS = Path(__file__).resolve().parent.parent / "src" / "assets"
OUT = ASSETS / "thumbs"

# Logos e avatares ja sao pequenos e nao entram em galeria.
SKIP_PREFIXES = ("logo-", "avatar-")
WIDTHS = (480, 960)
EXTS = {".jpg", ".jpeg", ".png", ".webp"}


def main() -> None:
    OUT.mkdir(exist_ok=True)
    dims: list[tuple[str, int, int]] = []
    total_before = 0
    total_after = 0

    for path in sorted(ASSETS.iterdir()):
        if not path.is_file() or path.suffix.lower() not in EXTS:
            continue
        if path.name.startswith(SKIP_PREFIXES):
            continue

        with Image.open(path) as im:
            im = im.convert("RGB")
            w, h = im.size
            dims.append((path.stem, w, h))
            total_before += path.stat().st_size

            for target in WIDTHS:
                # Nao faz upscale: se o original ja e menor, mantem o tamanho dele.
                tw = min(target, w)
                th = round(h * tw / w)
                dest = OUT / f"{path.stem}@{target}.webp"
                im.resize((tw, th), Image.LANCZOS).save(
                    dest, "WEBP", quality=72, method=6
                )
                total_after += dest.stat().st_size

    print(f"{len(dims)} imagens processadas -> {OUT}")
    print(f"originais: {total_before / 1024:.0f} KB | variantes: {total_after / 1024:.0f} KB\n")
    print("dimensoes originais (width / height):")
    for stem, w, h in dims:
        print(f"  {stem}: {w}x{h}")


if __name__ == "__main__":
    main()
