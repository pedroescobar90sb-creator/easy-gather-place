## 1. Trocar o vídeo atual pelo novo

**Arquivo do vídeo**
- Upload do `snapinsta.com.br-6a41065aa2252.mp4` (720x1280, ~12 MB, H.264) para a CDN via `lovable-assets`, gerando `src/assets/video-paraiso-v2.mp4.asset.json`.
- Apagar o asset antigo `src/assets/video-paraiso.mp4.asset.json` (CDN + pointer) para não pesar o projeto.
- Manter o poster atual (`paraiso-poster.jpg`) — combina com o tom do vídeo.

**Player em tela cheia (ImmersiveVideoSection.tsx)**
- Importar o novo asset.
- No overlay fullscreen, deixar **somente**:
  - O `<video>` em fundo preto, `object-contain`, `width/height: 100vw/100vh`, com `controls`, `playsInline`, `preload="auto"`.
  - **Um único botão "X"** discreto, fixo no canto superior direito (pílula branca translúcida com ícone `X` da lucide), `aria-label="Fechar vídeo"`.
- Remover o botão "← Voltar" da esquerda (some o ruído visual).
- Manter: ESC fecha, clique fora fecha, botão do navegador (back) fecha (já via `pushState`/`popstate`), `body` com `overflow:hidden` enquanto aberto, pause ao fechar.
- Resolução / qualidade: como o vídeo é vertical 720x1280 e o player usa `object-contain` sobre preto, não há reencode nem perda — toca no bitrate original. Em telas largas aparecem faixas pretas laterais (correto e profissional para vídeo 9:16, sem distorcer nem cortar).

Sem mudanças na seção acima do player (poster card, headline, etc).

## 2. Refinar a imagem "Para quem busca conforto e diversão" (Salão de Jogos)

**Asset**
- Re-upload do `src/assets/salao-jogos-v2.jpg` para a CDN via `lovable-assets`, gerando `src/assets/salao-jogos-v2.jpg.asset.json` (a versão atual está como arquivo local, sem CDN/cache otimizado).
- Remover o import direto do `.jpg`; passar a importar o `.asset.json` e usar `.url`.

**Renderização (index.tsx, seção "Lazer")**
- Trocar a `figure` por uma versão com qualidade profissional em mobile e desktop:
  - Container com `rounded-3xl` e `ring-1 ring-border/60`, sombra suave `shadow-[0_30px_80px_-30px_rgba(0,0,0,0.35)]`.
  - Aspect ratio responsivo: `aspect-[4/5]` no mobile (formato editorial, foco no centro da mesa de sinuca) e `md:aspect-[16/10]` no desktop (mais panorâmico, sem cortar as bandeirinhas).
  - `<img>` com `loading="lazy"`, `decoding="async"`, `fetchPriority="low"`, `sizes="(min-width: 768px) 60vw, 100vw"`, `object-cover` e `object-[center_55%]` para manter o foco nas mesas.
  - Caption "Salão de Jogos" mantida, com gradiente inferior um pouco mais sutil (`from-black/70`).
- Sem mudar copy, layout do bloco à direita ou ícones.

## Arquivos alterados
- `src/components/ImmersiveVideoSection.tsx` — novo player limpo (só vídeo + X), novo asset.
- `src/assets/video-paraiso-v2.mp4.asset.json` — novo (criado via CLI).
- `src/assets/video-paraiso.mp4.asset.json` — deletado via `lovable-assets delete`.
- `src/assets/salao-jogos-v2.jpg.asset.json` — novo (criado via CLI).
- `src/assets/salao-jogos-v2.jpg` — removido após upload na CDN.
- `src/routes/index.tsx` — import e bloco da figure do Salão de Jogos.

Sem mudanças de backend, rotas ou schema.