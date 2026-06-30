## 1) Player limpo (sem barra preta de controles)

No `ImmersiveVideoSection.tsx`, no modo tela cheia:
- Remover `controls` do `<video>` (some a barra `0:08 / 1:22`, volume, fullscreen, três pontinhos).
- Tocar/pausar com clique no próprio vídeo (toggle).
- Manter **apenas o botão "X"** no canto superior direito para sair.
- Manter autoplay com som (`muted={false}`), `playsInline`, `onEnded={() => setOpen(false)}`.
- Esconder `::-webkit-media-controls` via style inline como reforço (Safari iOS).

Resultado visual: vídeo cheio na tela + X. Nada mais.

## 2) Melhorar qualidade do vídeo

**Situação real:** o arquivo de origem que está hoje no projeto tem conteúdo útil em ~720x404. O atual de 1080p já é um upscale. Re-encodar para 1440p/4K só aumenta o peso sem ganhar nitidez real.

Plano em duas frentes:

**A. Otimização imediata (sem novo arquivo)** — re-encodar com perfil de máxima qualidade visual no mesmo 1080p:
- `ffmpeg -i origem.mp4 -vf "scale=1920:1080:flags=lanczos,unsharp=5:5:0.8:3:3:0.4" -c:v libx264 -preset slow -crf 17 -profile:v high -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 192k saida.mp4`
- Substituir o asset `video-paraiso-clean-cover.mp4` pelo novo via `lovable-assets create`.
- Ganho: imagem mais limpa, menos blocagem, sharpening sutil, start mais rápido (`+faststart`).

**B. Upgrade real para "ultra qualidade" (recomendado)** — precisa de um vídeo-fonte melhor:
- Você envia o vídeo original em 1080p ou 4K (sem corte/letterbox), de preferência o arquivo direto do celular/câmera.
- Eu processo em 1080p ou 4K H.264 high profile + AAC 192k e publico como novo asset.
- Mantemos um fallback 1080p para conexões lentas (`<source media="..."/>`).

## Arquivos alterados

- `src/components/ImmersiveVideoSection.tsx` — remover `controls`, adicionar toggle play/pause no clique, manter X.
- (Opcional, etapa B) novo `src/assets/video-paraiso-ultra.mp4.asset.json` quando você enviar o vídeo-fonte melhor.

## Pergunta para você

Quer que eu já execute **A (otimização do atual)** agora, ou prefere primeiro me enviar o vídeo original em alta para fazermos **B (ultra qualidade real)**?