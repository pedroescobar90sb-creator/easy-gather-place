## Análise das 6 fotos enviadas

| # | Foto | Avaliação | Uso |
|---|------|-----------|-----|
| 1 | `image-17.png` (piscina com cascata + coqueiros + bangalô amarelo) | **A mais forte.** Água cristalina, cascata, luz natural, profundidade — vende sozinha. | **HERO** (foto única visível) |
| 2 | `85696150.jpg` (pérgola + piscina + árvore grande) | Excelente. Mostra área de convívio, sombra, escala. | Lightbox #2 |
| 3 | `239488161.jpg` (piscina com espreguiçadeiras + céu azul) | Muito boa. Comunica "descanso à beira da piscina". | Lightbox #3 |
| 4 | `image-16.png` (passarela de madeira + coqueiros ao vento) | Boa. Mostra entorno e charme rústico. | Lightbox #4 |
| 5 | `239488566.jpg` (água azul vibrante + árvore) | Boa textura/cor, mas composição parecida com a #3. | Lightbox #5 |
| 6 | `528468362.jpg` (piscina à noite) | Atmosférica. Bom contraste com as diurnas. | Lightbox #6 |

**Aprovo as 6** — formam um conjunto coerente (dia + entardecer + noite + entorno). A foto noturna escura que aparece hoje (`piscina-noite`) será **substituída** pela cascata diurna.

## Melhoria de qualidade
Originais já são bons (≥1000px). Otimização sem perda perceptível:
- Re-encode para **JPEG progressivo, qualidade 88, mozjpeg-like via `ffmpeg`/`magick`**, sharpening leve (`unsharp 0x0.8+0.6+0`), strip de metadados.
- Largura máxima 1920px (mantém nitidez em 4K), preservando proporção.
- Conversão para asset CDN via `lovable-assets`.
- Resultado: arquivos ~30–50% menores, mesmo detalhe visual, carregamento muito mais rápido (importante pro Meta Ads não dropar score do criativo).

## Mudanças no site (`src/routes/index.tsx`)

**Mesma lógica dos cards de quarto:**
- 1 única foto grande visível (`image-17` — cascata) com aspect ratio `4/3` (igual aos quartos)
- Botão sobreposto canto inferior: **"Ver fotos da piscina"** com ícone `Camera` (mesmo estilo dos quartos)
- Clique abre o `GalleryLightbox` existente com **as 6 fotos** otimizadas
- Headline e copy já existentes mantidos
- CTA WhatsApp "Reservar com vista pra piscina" mantido logo abaixo

**Remove:** o mosaico atual de 3 fotos (substituído por foto única).

## Arquivos
- Upload de 6 assets novos via `lovable-assets create` (`piscina-cascata`, `piscina-pergola`, `piscina-loungers`, `piscina-passarela`, `piscina-arvore`, `piscina-noturna`).
- `src/routes/index.tsx` — refatora a seção "A piscina" pro padrão card único + lightbox.
- (Opcional) Deletar `piscina-noite.asset.json` antigo se não for mais usado em nenhum outro lugar — vou verificar antes.

## Confirma?
Implemento com a **cascata (`image-17`)** como foto única visível e as outras 5 dentro do lightbox?
