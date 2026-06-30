# Redesign Pousada Ilha do Meio — Editorial Magazine

Direção escolhida (por mim, conforme você pediu): **v2 — Magazine assimétrico**, com paleta Forest & Moss travada, Instrument Serif (display) + Work Sans (texto) e layout magazine com cards de quartos em stagger.

## 1. Trocar a imagem em "Acomodações"

- Remover a foto noturna do coqueiro/varanda iluminada (atual slide 3/4 do lightbox e imagem hero da seção "Ambientes pensados pro seu descanso").
- Subir a nova foto (fachada amarela das cabines, diurna) via `lovable-assets` em alta resolução, sem upscale agressivo — só sharpen leve via ffmpeg pra manter nitidez.
- Atualizar `src/routes/index.tsx` e `GalleryLightbox.tsx` pra usar a nova imagem como hero da seção Acomodações **e** primeiro item do lightbox.
- Garantir que ao abrir o lightbox não dá o bug atual (o "x" colando na nav, contador 3/4 inconsistente): forçar `z-index` acima do header, `body { overflow: hidden }` ao abrir, e índice resetando em 1.

## 2. Sistema de design (tokens — `src/styles.css`)

Travar a paleta como tokens semânticos, sem hardcode em componentes:

```text
--background:        #faf8f3   (off-white quente)
--foreground:        #1a3c2a   (forest deep)
--primary:           #1a3c2a   (forest deep — CTAs, headlines)
--primary-foreground:#faf8f3
--secondary:         #2d5a3d   (moss)
--accent:            #5a8a5c   (sage — labels caps small)
--muted:             #a0c49d   (sage light — divisores, hairlines)
--card / popover     #ffffff
```

Tipografia (via `<link>` no `__root.tsx`, nunca `@import` URL em CSS):
- `--font-display: "Instrument Serif"` → headlines, números, preços
- `--font-sans: "Work Sans"` → corpo, labels, botões

Tokens de motion: fade-up 600ms `ease-out`, parallax leve no hero, hover de imagem com `scale-105` em 1s.

## 3. Estrutura da home (`src/routes/index.tsx`)

Bandas magazine, separadas por hairlines `border-[--muted]/30`:

1. **Nav fixa** translúcida com blur — logo serif itálico + CTA pill "Reservar via WhatsApp".
2. **Hero split 50/50**: à esquerda chapéu caps small "Itacimirim · Bahia", H1 enorme em duas linhas itálicas ("Pousada / *Ilha do Meio*"), parágrafo curto, CTA preenchido + badge 9.2/204 avaliações com borda lateral. À direita: imagem da fachada amarela em altura cheia, gradient fade pra esquerda no desktop.
3. **Vídeo experiência** em banda verde escura, grid 12 colunas (texto 5 / vídeo 7), play button glassmorphism. Mantém o lightbox portrait que já existe — só restyling.
4. **Suítes** — headline gigante + parágrafo caps small, grid de 3 cards em **stagger vertical** (`md:-mt-12` no card do meio), `aspect-[4/5]`, preço "a partir de R$ X" em serif alinhado à direita sob hairline, hover `scale-110` na imagem. CTA WhatsApp customizado por tipo (já existe).
5. **Lazer & Piscina** — banda verde média, mosaico 2 colunas com offset, headline "O lazer que / *abraça a alma*", lista com bullets sage, CTA WhatsApp.
6. **Localização** — bloco com badge alta-resolução já uploadada + endereço + botão "Abrir no Google Maps".
7. **FAQ + Regras** — accordion `<details>` com hairlines, check-in 14h / check-out 11h em destaque.
8. **Footer** verde profundo: nome serif, contato, CNPJ, links legais (Termos, Privacidade, FAQ).
9. **CTA flutuante WhatsApp** verde com tooltip "Fale conosco".

## 4. Componentes a refatorar

- `src/routes/__root.tsx` — adicionar `<link>` Google Fonts (Instrument Serif + Work Sans, com preconnect).
- `src/styles.css` — substituir tokens existentes pela paleta Forest & Moss, registrar `--font-display` e `--font-sans` em `@theme`, manter `@theme inline` pros tokens shadcn.
- `src/routes/index.tsx` — reescrever home com a estrutura acima.
- `src/components/SiteHeader.tsx` (se existir) — nav nova translúcida.
- `src/components/SiteFooter.tsx` — paleta nova, mantém CNPJ e links.
- `src/components/GalleryLightbox.tsx` — fix do bug (z-index, body scroll lock, contador) + paleta nova.
- `src/components/ImmersiveVideoSection.tsx` — restyling com a paleta verde, mantém vídeo HD atual e o X.
- `src/components/Testimonials.tsx` — tipografia editorial nova.

## 5. Detalhes técnicos

- Mobile-first: hero vira coluna única, grid de quartos 1 col, stagger desliga em `<md`.
- Acessibilidade: contraste verificado (forest #1a3c2a sobre off-white = AAA; sage #5a8a5c só pra labels caps); alt em todas as imagens.
- SEO: manter `<head>` de cada rota com title/description únicos, og:image apontando pra nova fachada amarela.
- Sem mudanças em sistema interno, auth, supabase, reservas. Só camada visual da home + assets + bug do lightbox.

## Fora de escopo

- Não vou mexer em booking/admin/calendário/quartos internos.
- Não vou trocar a paleta nem a tipografia depois — ficam travadas.
- Não vou gerar imagens novas com IA — uso a foto que você enviou e as que já estão no projeto.
