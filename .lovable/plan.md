# Refinamento UI/UX — Pousada Ilha do Meio

Objetivo: elevar o site a padrão pousada boutique, aumentar cliques em WhatsApp/reserva direta e reforçar acessibilidade — **sem alterar textos, ordem das seções ou estratégia**.

## 1. Tipografia (boutique + hotelaria)

- Título: **Fraunces** (serif moderna, quente, orgânica — substitui a atual Instrument Serif que é mais editorial fria).
- Corpo: **Inter** (mantém legibilidade; substitui Work Sans por leitura mais confortável em corpo pequeno).
- Escala tipográfica revisada: H1 clamp(2.5rem, 5vw, 4.25rem), H2 clamp(2rem, 3.5vw, 3rem), H3 1.5rem, body 1rem/1.65, small 0.875rem.
- Line-height generoso (1.6–1.7 em parágrafos), tracking levemente negativo nos títulos serif.
- Carregar via `<link>` no `__root.tsx` (Tailwind v4 exige URL fora do styles.css).

## 2. Paleta refinada (verde-mata + areia + madeira)

Tokens em `src/styles.css` (oklch, mapeados em `@theme inline`):

- `--background`: areia clara quente (oklch 0.98 0.01 85)
- `--foreground`: verde-mata profundo (oklch 0.22 0.04 155) — contraste AAA sobre bg
- `--primary`: verde-folha (oklch 0.42 0.09 155) — botões principais
- `--primary-foreground`: branco quente
- `--accent`: cobre/terracota suave (oklch 0.62 0.12 55) — destaques, selos, nota 9,2
- `--muted-foreground`: verde acinzentado com contraste AA garantido (≥ 4.5:1)
- `--card`: creme quente (oklch 0.965 0.012 80)
- WhatsApp CTA: mantém verde WhatsApp `#128C7E` (código de cor da marca)

Verificação de contraste WCAG AA em todos os pares (texto/fundo, botão/label, muted em card).

## 3. Layout e espaçamento

- Grid vertical com ritmo consistente: seções `py-20 sm:py-28`, containers `max-w-6xl`, gutters `px-4 sm:px-6`.
- Delimitadores sutis: divisores hairline, mudanças de background alternadas (bg → card → bg com imagem).
- **Tabela comparativa Booking × Direto**: card duplo lado a lado no desktop, empilhado no mobile, com badge "Melhor tarifa" no card Direto, ícones ✓/✗ verdes/vermelhos claros, tipografia tabular-nums para preços.
- Cards de ambientes/acomodações com aspect-ratio fixo (4/3), overlay legenda gradient bottom, hover elevation.

## 4. CTAs e botões

- Botão primário WhatsApp: verde WhatsApp, ícone à esquerda, sombra `shadow-lg shadow-primary/25`, hover `translate-y-[-2px]` + sombra intensificada, focus ring visível.
- Botão secundário: outline verde-mata com fundo transparente, hover fill.
- CTAs sticky: botão flutuante WhatsApp já existe — refinar com pulse discreto na primeira aparição + tooltip "Fale com a recepção" no desktop.
- Todos os botões: min-height 44px (mobile tap target), padding generoso, `focus-visible:ring-2 ring-offset-2`.
- Microtexto sob CTA principal: "Resposta em minutos · Melhor tarifa garantida" (já existe, apenas realçar).

## 5. Imagens e galeria

- `<img>` com `loading="lazy"`, `decoding="async"`, aspect-ratio via Tailwind `aspect-*` (evita CLS).
- Alt text descritivo real em cada imagem (fachada noite, piscina iluminada, quarto casal, área verde, salão de jogos).
- Galeria/lightbox: manter componente atual, refinar controles (setas com bg semitransparente, dots com estado ativo claro).
- Carrossel de depoimentos: já existe, apenas ajustar contraste do card sobre bg com folhagem.

## 6. Prova social e localização

- Selo "9,2 · Excelente" com estrelas em `--accent`, destaque no hero e antes dos depoimentos.
- Contagem de avaliações e badges (Google, Booking) alinhados horizontalmente com ícones.
- Seção "Como chegar": lista de distâncias com ícones (praia 5 min a pé, Praia do Forte 20 min, Aeroporto SSA 50 min, Salvador 60 min) em cards com ícone lucide + tempo em tabular-nums. Mini-mapa estilizado SVG opcional (marcador estilizado, não Google Maps embed pesado).

## 7. Acessibilidade

- `<main>` único por rota, hierarquia H1→H2→H3 sem pulos.
- Todos os ícones-only Button com `aria-label`.
- `focus-visible` consistente em toda a paleta.
- `prefers-reduced-motion`: desativar animações não-essenciais.
- Contraste AA validado (muted-foreground sobre card, texto sobre imagens com overlay ≥ 0.5 opacidade).

## 8. Microinterações

- Fade-in + subtle rise on scroll para seções (intersection observer, 1x por seção, respeita reduced-motion).
- Hover cards: `translate-y-[-4px]` + shadow em 200ms.
- Sem parallax pesado, sem animações que atrasem LCP.

## Arquivos afetados (sem tocar conteúdo)

```text
src/routes/__root.tsx          → carregar Fraunces + Inter via <link>
src/styles.css                 → tokens de cor, tipografia, utilitários
src/routes/index.tsx           → refinar espaçamento, CTAs, tabela comparativa
src/routes/ambientes.tsx       → grid/cards de ambientes
src/routes/reservar.tsx        → card de reserva, tabela Booking × Direto
src/routes/como-chegar.tsx     → lista de distâncias com ícones
src/routes/faq.tsx             → tipografia do accordion
src/components/Testimonials.tsx→ contraste do card sobre bg
src/components/SiteFooter.tsx  → ritmo tipográfico
src/components/WhatsAppFloating.tsx → tooltip + pulse discreto inicial
```

## Fora de escopo (não farei)

- Alterar copy, ordem de seções, preços, proposta de valor.
- Trocar imagens existentes.
- Adicionar/remover páginas.
- Mudar integrações (Meta Pixel, GA, WhatsApp, Supabase).

Pronto para implementar assim que aprovar.