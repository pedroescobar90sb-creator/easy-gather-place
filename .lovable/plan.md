## Análise (gestor de tráfego + especialista em sites)

**Vale a pena? Sim — mas como uma seção curta e estratégica, NÃO como galeria solta.**

### Por quê (visão de tráfego pago)
- A **piscina é o ativo visual de maior conversão** de pousada de praia. Em campanha Meta/Google, criativos com piscina ao entardecer batem CTR 30–60% acima de fachada ou quarto.
- Você já tem **4 fotos boas de piscina** (`piscina-noite`, `piscina-lagoa`, `piscina-bg-desktop`, `piscina-bg-mobile`) — não estão sendo aproveitadas; só uma aparece hoje no rodapé do bloco de localização.
- A landing hoje vai: hero → quartos → localização. Falta o **"momento desejo"** que conecta emoção → CTA. Piscina é exatamente isso.
- Em mobile (390px, seu viewport atual), uma seção visual quebra a leitura pesada de texto e **aumenta tempo na página** — métrica que o algoritmo do Meta usa pra otimizar.

### Por que NÃO virar só "galeria de fotos da piscina"
- Galeria pura sem copy = visitante rola e sai. Foto bonita sem CTA não converte.
- Já existe o `GalleryLightbox` no site — duplicar vira ruído.

### Recomendação
Criar **uma seção dedicada "A piscina"** entre os **quartos** e a **localização**, formato editorial:
- 1 foto grande à esquerda (`piscina-noite` — a mais cinematográfica)
- 2 fotos menores empilhadas à direita (`piscina-lagoa` + `piscina-bg-desktop`)
- Headline curta + 1 linha de copy + CTA WhatsApp
- Mobile: foto principal full-width, duas menores em grid 2 colunas abaixo
- Clique em qualquer foto abre o `GalleryLightbox` existente (aproveita componente)

### Copy proposta
- **Headline:** "A piscina que faz a viagem valer."
- **Sub:** "Aberta o dia todo, com espreguiçadeiras, área sombreada e vista da pousada. Perfeita pra descansar antes ou depois da praia."
- **CTA:** "Reservar com vista pra piscina" → WhatsApp

### Posicionamento
Entre `</section>` dos quartos e o início de "LOCALIZAÇÃO" — captura o usuário no pico de interesse (já viu o quarto, já viu o preço), e empurra pro WhatsApp.

## Mudanças
- `src/routes/index.tsx` — nova `<section>` "A piscina" (3 imagens existentes + headline + copy + CTA WhatsApp + integração ao `GalleryLightbox`).
- Nenhum asset novo, nenhuma dependência nova.

## Confirma?
Implemento desse jeito (editorial 1 grande + 2 menores com CTA WhatsApp), ou prefere **apenas a galeria de fotos sem texto/CTA**? Recomendo fortemente a primeira.
