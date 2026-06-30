## Recomendação estratégica: mostrar ou esconder preço?

**Recomendo MOSTRAR o preço — com a etiqueta "a partir de R$ X / noite".**

Por quê (baseado em conversão de pousadas que vendem por WhatsApp):
- Quem vem de tráfego pago **filtra rápido por preço**. Sem valor visível, a maioria fecha a aba em vez de chamar no WhatsApp — você queima clique pago.
- Quem chama no WhatsApp **sem ter ideia de preço** vem mais frio, negocia mais e converte menos. O atendimento vira "consultoria de preço" em vez de fechamento.
- Com "**a partir de**" você ancora o valor mínimo (psicologicamente parece mais barato), preserva margem para alta temporada/feriado e mantém o WhatsApp como canal de **fechamento**, não de cotação.
- Pousadas concorrentes em Itacimirim/Guarajuba (Booking, site próprio) mostram preço. Esconder gera desconfiança ("se não mostra, é caro").

**Quando esconderia:** só se o ticket variasse muito (ex.: 3x entre baixa e alta) ou se o produto fosse luxo puro sem comparação direta. Não é o caso aqui.

Decisão proposta: **manter preço visível com prefixo "a partir de"** e copy curta focada em benefício + ocupação ideal.

## Mudanças

### 1) Preços atualizados em `src/routes/index.tsx`
- Duplo: **R$ 450 / noite** (era R$ 400)
- Triplo: **R$ 550 / noite** (era R$ 500)
- Quádruplo: **R$ 650 / noite** (era R$ 550)
- Formato exibido: `a partir de R$ 450 / noite` (mesmo padrão nos 3 cards, tabular-nums, destaque sutil).

### 2) Copy personalizada por quarto (substitui `capacity` + adiciona uma linha curta de benefício acima do CTA)

**Quarto Duplo — R$ 450**
- Headline: "Quarto Duplo · para o casal"
- Linha de venda: "Cama de casal, ar-condicionado, frigobar e café da manhã incluso. A 2 minutos da praia."
- WhatsApp: "Olá! Tenho interesse no **Quarto Duplo** (2 pessoas) da Pousada Ilha do Meio, a partir de R$ 450/noite. Pode confirmar disponibilidade para as minhas datas?"

**Quarto Triplo — R$ 550**
- Headline: "Quarto Triplo · grupo pequeno ou família"
- Linha de venda: "Três camas confortáveis, ar-condicionado e café da manhã incluso. Ótimo custo por pessoa."
- WhatsApp: "Olá! Quero reservar o **Quarto Triplo** (3 pessoas) na Pousada Ilha do Meio, a partir de R$ 550/noite. Pode me passar disponibilidade?"

**Quarto Quádruplo — R$ 650**
- Headline: "Quarto Quádruplo · família toda junta"
- Linha de venda: "Espaço para 4 pessoas, ar-condicionado e café da manhã incluso. Pertinho da piscina e da praia."
- WhatsApp: "Olá! Tenho interesse no **Quarto Quádruplo** (4 pessoas) da Pousada Ilha do Meio, a partir de R$ 650/noite. Pode confirmar disponibilidade?"

### 3) Ajuste visual mínimo no card de preço
- Linha pequena cinza "a partir de" acima do valor (mesmo tamanho do `capacity`), valor em destaque, "/ noite" em peso menor. Sem mudar layout/grid.

## Arquivos alterados
- `src/routes/index.tsx` — preços, headlines, linha de venda, mensagens de WhatsApp e formatação "a partir de".

## Confirma?
1. Manter **preço visível "a partir de"** (recomendado) ou prefere realmente **esconder e só mostrar no WhatsApp**?
2. Confirma os valores **450 / 550 / 650**?
