## Diagnóstico

O vídeo atual (`video-paraiso-clean-cover.mp4`) está embaçado porque foi gerado a partir de um arquivo já comprimido do WhatsApp e depois re-encodado/cortado para 16:9. Cada re-encode somou perda. Não há como "tirar" o borrão sem uma fonte melhor — upscaling por IA só inventa pixel e costuma deixar textura plástica em folhagem (palmeiras viram borrão verde).

A única forma de ficar **realmente nítido** é partir de um arquivo de origem em alta resolução.

## Plano

### 1. Você me envia o arquivo original (passo crítico)
- Pegar o vídeo direto da **galeria do celular** que filmou (não reencaminhado).
- Enviar no chat aqui como **arquivo/documento** (não como vídeo do WhatsApp, que recomprime pra ~720p).
- Ideal: 1080p ou 4K, MP4/MOV, qualquer duração.
- Se tiver mais de um take, manda todos — eu escolho o melhor frame de capa.

### 2. Eu processo localmente em qualidade master
Com o original em mãos, eu faço o pipeline profissional via `ffmpeg`:

- **Crop inteligente para 16:9** mantendo o enquadramento da pousada (sem barras pretas, sem distorção).
- **Escala Lanczos** para 1920×1080 (ou mantém 4K se a fonte for 4K).
- **Sharpen sutil** (`unsharp=5:5:0.8`) para recuperar definição das palmeiras/telhado.
- **Encode H.264 high profile**, CRF 18, preset `slow`, `+faststart` (começa a tocar antes de baixar tudo).
- **Áudio AAC 128k** (ou mudo, se preferir manter como está hoje).
- Resultado esperado: ~15–40 MB para um clipe curto, nítido em tela cheia 1080p.

### 3. Publicar mantendo TUDO igual no site
- Upload do novo MP4 como asset no mesmo slot.
- O componente `ImmersiveVideoSection.tsx` continua exatamente igual — mesmo card, mesmo botão "X", mesmo lightbox portrait no mobile, mesma capa landscape no desktop.
- Nenhuma mudança visual além da nitidez.

### 4. Verificação
- Abrir o vídeo no preview, conferir nitidez no mobile (390px) e desktop (1280px).
- Confirmar que não há barras pretas e que o "X" continua funcionando.

---

**Próximo passo:** me manda o vídeo original (do celular, como documento). Sem isso, qualquer tentativa vai entregar a mesma qualidade de hoje — é limitação física do arquivo atual, não do código.
