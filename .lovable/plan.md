## Objetivo
Substituir a foto atual (`quiosqueJardim`) na seção **Localização** da home pela arte enviada (badge verde com palmeiras, logo "Ilha do Meio" e pin "LOCALIZAÇÃO"), entregue em alta resolução e enquadramento correto.

## Análise da imagem enviada
- Original: 1254 × 1254 px (quadrada), JPEG, arte gráfica (não é foto).
- O slot atual no site é `aspect-[4/3]` — usar a imagem quadrada nesse slot cortaria as palmeiras laterais e o texto "LOCALIZAÇÃO" inferior. Precisamos preservar a composição inteira.
- Como é arte vetorial/ilustrada, fazer upscale com IA não agrega — basta otimizar e servir nítido. Vou reprocessar com `ffmpeg`/Pillow para gerar um JPEG de altíssima qualidade (sharpen leve + qualidade 92) mantendo 1254×1254, e publicar via `lovable-assets` no CDN.

## Mudanças
1. **Otimizar e subir a arte** como asset CDN (`src/assets/localizacao-badge.jpg.asset.json`).
2. **Ajustar o slot visual** em `src/routes/index.tsx` (linhas 541–543):
   - Trocar `aspect-[4/3]` por `aspect-square` para respeitar a proporção 1:1 da arte.
   - Trocar `object-cover` por `object-contain` com fundo no tom verde do badge (`bg-[#0f3d2e]`) para garantir que nada do desenho seja cortado em nenhuma viewport.
   - Atualizar `alt` para "Localização da Pousada Ilha do Meio em Itacimirim, Bahia".
   - Manter `rounded-2xl shadow-xl` e `loading="lazy"`.
3. **Sem outras alterações** — copy, endereço, layout em duas colunas e demais seções permanecem iguais.

## Detalhes técnicos
- Asset pipeline: `lovable-assets create --file /tmp/localizacao-badge.jpg --filename localizacao-badge.jpg`.
- Import: `import localizacaoBadge from "@/assets/localizacao-badge.jpg.asset.json"` e usar `localizacaoBadge.url`.
- A imagem `quiosqueJardim` continua usada em outras seções, então não removo o import existente.
