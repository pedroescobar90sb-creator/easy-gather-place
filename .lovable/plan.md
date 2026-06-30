## Diagnóstico

Detectei o problema: o arquivo enviado é tecnicamente 720×1280 (vertical), mas o **vídeo real está em apenas 720×404 (paisagem 16:9)** centralizado no meio, com **faixas pretas enormes em cima e embaixo** já "queimadas" no arquivo. Quando o reencodei para 1080×1920 vertical, mantive essas faixas — daí o preto que aparece.

```
[cropdetect] crop=720:404:0:438  ← área útil do vídeo
```

## Plano

### 1. Cortar as faixas pretas na fonte
Rodar `ffmpeg` com `crop=720:404:0:438` para extrair **apenas a área com imagem**, descartando todo o preto.

### 2. Upscale + nitidez na imagem útil
Sobre o frame limpo (720×404):
- Escalar para **1920×1080 Lanczos** (16:9 nativo, full HD real)
- `hqdn3d=1.5:1.5:6:6` — limpa ruído de compressão
- `unsharp=5:5:0.6` — devolve definição
- `eq=saturation=1.08:contrast=1.04` — verde/céu mais vivos
- Encode **H.264 High, CRF 18, preset slow, +faststart**, áudio AAC 192k

Resultado: arquivo 1080p paisagem, ~20–35 MB, **sem nenhuma faixa preta**.

### 3. Player ocupa a tela inteira sem preto
O componente `ImmersiveVideoSection.tsx` já usa `object-cover` + `inset-0`. Com o vídeo agora sendo um 16:9 limpo, ele preenche a viewport edge-to-edge automaticamente. **No mobile (portrait)** o vídeo paisagem se ajusta cobrindo a tela toda — sem preto, sem letterbox — porque `object-cover` corta uma leve borda lateral em vez de adicionar barra.

### 4. Trocar o asset e validar
- Subir como `video-paraiso-fullhd-clean.mp4`
- Atualizar só o `import video` em `ImmersiveVideoSection.tsx`
- Abrir o preview mobile (390px) e desktop, confirmar:
  - Zero preto em qualquer borda
  - Botão "X" continua visível e funcional
  - Vídeo nítido e fluido

---

**Próximo passo:** aprova e eu executo crop + upscale + troca de asset.
