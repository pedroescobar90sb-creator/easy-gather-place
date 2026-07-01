# Plano — Ajustes de vídeo, quartos e piscina

## 1. Vídeo abre direto (sem etapa intermediária)

Hoje em `src/components/ImmersiveVideoSection.tsx` o clique abre um overlay com poster de fundo e o `<video>` só começa a tocar após um `setTimeout(120ms)` + fade-in de `opacity`. Isso dá a sensação de "abre uma tela, depois abre o vídeo".

- Remover o estado `revealed` e o `setTimeout` de reveal.
- Chamar `videoRef.current.play()` imediatamente no `useEffect` de abertura.
- Tirar o `backgroundImage: url(poster)` do overlay (fundo preto puro).
- Tirar o `opacity` transicional do `<video>` — entra já visível e tocando.
- Manter o botão X e o clique-para-pause.

Resultado: clique no card → tela cheia preta com o vídeo já rodando, sem "flash" de poster.

## 2. Quartos — 1 foto por quarto (as atuais)

Em `src/routes/index.tsx`, hoje cada card de quarto abre um `GalleryLightbox` com múltiplas fotos. Vou:

- Reduzir o array de imagens de cada quarto (Duplo, Triplo, Quádruplo) a **apenas 1 item** — a foto principal que já aparece no card:
  - Duplo → `quarto-duplo-v2.jpg`
  - Triplo → `quarto-triplo-v2.jpg`
  - Quádruplo → `quarto-quadruplo-hd.jpg`
- Manter o botão "Ver fotos do quarto" abrindo o lightbox (agora com 1 imagem só, sem navegação lateral — o `GalleryLightbox` já desabilita as setas nas bordas).

**Depois** aplicar as substituições da seção 4 abaixo (novas fotos para Quádruplo e Duplo).

## 3. Piscina — adicionar 3 novas fotos (sem legenda)

Processar as 3 imagens da piscina enviadas, removendo o texto queimado com `imagegen--edit_image` (inpainting) + upscale HD:

| Upload | Legenda a remover | Destino |
|---|---|---|
| `718894241_...` (pergolado + piscina azul) | "Pousada ilha do meio" | Seção "A piscina" |
| `499676380_...` (piscina com cascata + coqueiros) | "Praia de Itacimirim" | Seção "A piscina" |
| `624837581_...` (pergolado de bambu com cachorrinho) | *(sem texto)* | Seção "A piscina" |

Passos por imagem:
1. `imagegen--edit_image` com prompt para apagar a faixa branca + texto, reconstruindo o piso/água/madeira ao redor, output 1600×1600.
2. `ffmpeg` `unsharp=5:5:0.6` para nitidez final.
3. `lovable-assets create` → `.asset.json` em `src/assets/piscina-<slug>-hd.jpg.asset.json`.
4. Adicionar os 3 novos itens ao array `piscinaGallery` em `src/routes/index.tsx` (mosaico + lightbox já existentes).

## 4. Trocar fotos dos quartos Quádruplo e Duplo

| Upload | Ação | Destino |
|---|---|---|
| `590422900_...` (varandinha amarela com rede) | Remover legenda "Varandinha com rede" + upscale HD | **Quarto Quádruplo** (substitui `quarto-quadruplo-hd.jpg` no card e lightbox) |
| `624767999_...` (quarto laranja com quadros coloridos) | Já sem texto, só upscale HD | **Quarto Duplo** (substitui `quarto-duplo-v2.jpg` no card e lightbox) |

Mesmo pipeline: edit_image (quando tem texto) → ffmpeg sharpen → `lovable-assets create` → atualizar import em `src/routes/index.tsx` → deletar asset antigo com `lovable-assets delete`.

> Observação: você pediu literalmente "varandinha → quádruplo" e "quarto laranja → duplo". Se preferir o contrário (quarto laranja no quádruplo, varandinha em outro lugar), me avise antes de eu implementar — a varandinha não mostra as 4 camas típicas de um quádruplo.

## Fora de escopo

- Não mexo em copy, preços, CTA de WhatsApp, header, footer, seções vizinhas, paleta ou tipografia.
- Não toco no Quarto Triplo (foto atual permanece).
- Não removo assets antigos que ainda sejam usados em outras seções (piscina, hero, galeria geral) — só os substituídos diretamente.
