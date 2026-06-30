## O que fazer

1. **Limpar a imagem enviada**
   - Usar `imagegen--edit_image` na foto enviada para remover o texto "Finalmente férias" (mantendo piscina, deck e palmeiras intactos), com saída em 1600×1600 para ganhar resolução.
   - Pós-processar com `ffmpeg` (unsharp + JPEG q92) e publicar como asset `piscina-hero-clean.jpg`.

2. **Trocar na seção "A piscina" (`src/routes/index.tsx`)**
   - Substituir a hero image atual (`piscina-cascata`) por essa nova foto limpa.
   - Manter exatamente o mesmo layout: foto única + botão "Ver fotos da piscina" + CTA WhatsApp (como na 2ª imagem de referência).

3. **Reduzir a galeria para só essa foto**
   - O lightbox vai abrir com **apenas 1 imagem** (a nova).
   - Remover as 5 fotos antigas da piscina do array do lightbox e apagar os assets que ficarem órfãos (`piscina-cascata`, `piscina-pergola`, `piscina-loungers`, `piscina-passarela`, `piscina-agua`) via `lovable-assets delete` para não deixar lixo.

4. **Verificação**
   - Abrir o preview mobile (390px), conferir que a nova foto aparece nítida, sem o texto, e que o botão "Ver fotos da piscina" abre o lightbox mostrando só ela.

## Observação importante sobre qualidade

A foto original enviada está em 640×640 (WhatsApp/Instagram já comprimiu). Vou conseguir uma boa limpeza e um upscale decente com sharpening, mas **resolução real só com o arquivo original** (do celular, enviado como Documento no WhatsApp). Se depois quiser nitidez máxima, me mande o original e eu troco mantendo tudo igual.
