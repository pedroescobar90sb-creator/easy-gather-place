## Diagnóstico do arquivo enviado

- Resolução: **720×1280 (portrait)** — compressão do WhatsApp
- Bitrate: **~1.1 Mbps** (baixo, daí o "embaçado")
- Codec: H.264, 30fps, 82s, 12 MB

É o mesmo material que já está no site, só que o WhatsApp recomprimiu. **O vídeo nunca vai ficar 4K nítido** a partir desse arquivo — a informação visual foi destruída na compressão. Mas dá pra deixar **bem mais limpo e profissional** com pós-processamento cuidadoso.

> Se você conseguir, em algum momento, exportar o vídeo direto do app que filmou (Capcut, galeria, drone) e me mandar **como Documento** no WhatsApp, conseguimos um salto real de qualidade. Por enquanto, vamos extrair o máximo do que existe.

## Plano de melhoria (mesmo formato, mesmo lightbox vertical)

### 1. Pipeline `ffmpeg` profissional de upscale + clean-up

Vou rodar este encoding sobre o arquivo enviado:

- **Denoise temporal** (`hqdn3d=1.5:1.5:6:6`) — remove o ruído de compressão sem borrar detalhe estático
- **Upscale Lanczos para 1080×1920** — escala vertical mantendo proporção 9:16 original
- **Sharpen sutil em duas etapas** (`unsharp=3:3:0.6, unsharp=5:5:0.4`) — devolve definição às palmeiras e telhas sem criar halo
- **Color subtle boost** (`eq=saturation=1.08:contrast=1.04`) — verde da vegetação e céu mais vivos
- **Encode H.264 High Profile, CRF 18, preset slow, +faststart** — qualidade master, começa a tocar antes de baixar
- **Áudio AAC 192k** (mantém o som ambiente)
- Arquivo final esperado: ~25–40 MB, 1080×1920, fluido em mobile e desktop

### 2. Substituir o asset mantendo TUDO igual no site

- Subir o novo MP4 como asset (`video-paraiso-portrait-hd.mp4`)
- Atualizar **apenas** o `<source>` portrait em `src/components/ImmersiveVideoSection.tsx`
- **Não mexer**: lightbox, botão "X", capa landscape do desktop, posição, copy, animação — nada

### 3. Verificação visual

- Abrir o vídeo no preview mobile (390px) e conferir nitidez no texto "Pousada Ilha do Sacimirim/BA"
- Conferir que o player abre rápido e sem barras pretas
- Conferir que o "X" continua fechando

### 4. (Opcional, se quiser ir além)

Posso aplicar upscale por IA (Real-ESRGAN/Topaz-like via FFmpeg + modelo) se a versão acima ainda não te agradar — mas costuma deixar folhagem com aspecto "pintado". Faço só se você pedir depois de ver o resultado da etapa 1.

---

**Próximo passo:** aprova e eu executo o pipeline ffmpeg + troco o asset agora.
