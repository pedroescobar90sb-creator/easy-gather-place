# Trocar foto do Quarto Quádruplo

## O que vou fazer

1. **Remover a legenda "Este é o nosso apto family 4"** da imagem enviada (`WhatsApp_Image_2026-06-30_at_4.03.31_PM.jpeg`) usando `imagegen--edit_image` com inpainting na área superior esquerda, preservando o resto da cena (parede laranja, abajur, quadro de barcos, camas com toalhas amarelas, ar-condicionado, TV, banheiro ao fundo).

2. **Upscale para alta resolução** (1600×1600) no mesmo passo de edição, com sharpen leve via `ffmpeg` (`unsharp=5:5:0.6`) pra manter nitidez sem artefatos.

3. **Subir como asset novo** via `lovable-assets create` → `src/assets/quarto-quadruplo-hd.jpg.asset.json`.

4. **Atualizar `src/routes/index.tsx`**:
   - Trocar o import `quartoQuadruplo` pra apontar pro novo asset HD.
   - Manter o card e o lightbox idênticos — só a fonte da imagem muda.

5. **Deletar o asset antigo** `src/assets/quarto-quadruplo.jpg.asset.json` via `lovable-assets delete` pra não deixar lixo no CDN.

## Fora de escopo

- Não mexo em layout, copy do card ("Quarto Quádruplo · família toda junta"), preço ou CTA.
- Não toco em quarto duplo nem triplo.
- Não mudo paleta, tipografia ou seções vizinhas.
