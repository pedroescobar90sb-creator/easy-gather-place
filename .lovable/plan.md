
# Plano — Ilha do Meio como Landing Page de Tráfego Pago (foco WhatsApp)

Objetivo único da página pública: **clique no WhatsApp**. Tudo que não serve a isso sai.

---

## 1. Copy do Hero (final escolhido)

```json
{
  "headline": "O sossego da Bahia, a dois minutos do mar.",
  "subheadline": "Pousada autoral em Itacimirim, entre Guarajuba e Praia do Forte. Atendimento direto com a casa, melhor tarifa garantida e reserva em minutos pelo WhatsApp.",
  "primary_cta": "Reservar pelo WhatsApp",
  "whatsapp_prefilled_message": "Olá! Vim pelo site da Pousada Ilha do Meio e quero reservar. Pode me passar disponibilidade e valores?"
}
```

### 10 headlines alternativas (premium / conversão)
1. O sossego da Bahia, a dois minutos do mar.
2. Itacimirim como ela deve ser vivida.
3. Sua próxima escapada começa aqui.
4. O refúgio discreto entre Guarajuba e Praia do Forte.
5. Acorde com o som do mar. Saia da rotina hoje mesmo.
6. A pousada que os baianos guardam pra si.
7. Praia, silêncio e atendimento de casa.
8. Reserva direta, tarifa real, experiência inesquecível.
9. O endereço certo pra fugir de Salvador no fim de semana.
10. Itacimirim sem intermediário. Direto com a pousada.

### 5 subheadlines
1. Atendimento direto com a casa, melhor tarifa garantida e reserva em minutos pelo WhatsApp.
2. A poucos minutos de Guarajuba, Praia do Forte e Salvador — sem o preço das grandes redes.
3. Quartos confortáveis, café da manhã da casa e a praia logo ali. Reserve falando direto com a gente.
4. Sem comissão, sem robô, sem surpresa: você fala com quem cuida da pousada.
5. Hospedagem tranquila pra casais e famílias que querem voltar pra casa descansados.

### 5 CTAs WhatsApp
1. Reservar pelo WhatsApp
2. Falar agora com a pousada
3. Ver disponibilidade no WhatsApp
4. Quero reservar minha estadia
5. Conversar direto com a recepção

### 3 versões de hero

**Premium**
- H: O sossego da Bahia, a dois minutos do mar.
- Sub: Pousada autoral em Itacimirim, entre Guarajuba e Praia do Forte. Atendimento direto, sem intermediários.
- CTA: Reservar pelo WhatsApp

**Elegante**
- H: Itacimirim como ela deve ser vivida.
- Sub: Um refúgio discreto na Praia da Espera, pensado pra quem busca silêncio, mar e bom atendimento.
- CTA: Falar agora com a pousada

**Alta conversão**
- H: Sua escapada na Bahia começa com uma mensagem.
- Sub: Reserve direto com a casa, garanta a melhor tarifa e receba confirmação em minutos pelo WhatsApp.
- CTA: Quero reservar minha estadia

---

## 2. Plano de limpeza da landing page

### Remover do site público
- **Top bar**: tirar o botão "Reservar" que leva para `/reservar`. Manter só logo + ícone WhatsApp.
- **Hero**: remover o link secundário "ou falar no WhatsApp" (vira ruído já que o CTA principal vira WhatsApp); remover a frase "Reserve direto e ganhe 10% off" (promessa de desconto sem regra clara enfraquece premium).
- **Trust bar**: remover o número "17" e o card "10% off reserva direta". Manter só "2 min da praia" e um selo de avaliação.
- **Seção Acomodações inteira**: remover os 3 cards com preço/“Reservar”. Substituir por um bloco visual único "Acomodações" com 1–2 fotos e CTA "Ver opções no WhatsApp".
- **Seção "Reserva direta = benefícios"**: remover (duplica argumento e adiciona outro CTA competindo).
- **Seção "Localização"**: manter, mas remover botão Instagram do bloco e simplificar para endereço + 1 CTA WhatsApp.
- **CTA final**: manter, mas remover o link secundário "ou falar no WhatsApp" (o botão principal já é WhatsApp).
- **Mobile sticky**: remover o botão "Reservar online"; deixar apenas a barra "Falar no WhatsApp" ocupando largura total.
- **Footer**: enxugar — remover coluna "Empresa" detalhada e link "Ligar para a recepção". Manter marca, endereço curto, CNPJ em linha discreta, WhatsApp, Instagram.
- **Rotas internas do site público**: remover do menu/links públicos qualquer referência a `/reservar`, `/auth`, `/dashboard` e demais rotas administrativas. Rotas continuam existindo no projeto (admin acessa por URL direta), mas **nenhum link público** aponta pra elas.

### Manter
- Hero com foto forte, headline, subheadline, 1 CTA WhatsApp.
- Faixa curta de confiança (avaliação + “a 2 min do mar” + “atendimento direto”).
- Galeria enxuta (6 fotos no máximo).
- Bloco de localização com endereço + CTA WhatsApp.
- CTA final fullscreen com foto + 1 botão WhatsApp.
- Footer minimalista com CNPJ e contato.

### Acima da dobra (above the fold)
1. Logo + ícone WhatsApp no topo
2. Foto hero
3. Selo "Itacimirim · Bahia"
4. Headline
5. Subheadline
6. **1 botão verde "Reservar pelo WhatsApp"** (único CTA)
7. Linha curta de prova social (ex.: "Avaliação 9.4 · Atendimento direto com a casa")

### Abaixo da dobra (ordem ideal)
1. Faixa de confiança (3 selos)
2. Galeria (6 fotos)
3. Bloco "A casa" — 2–3 linhas sobre experiência + CTA WhatsApp
4. Localização com endereço + CTA WhatsApp
5. CTA final fullscreen
6. Footer enxuto

---

## 3. Arquitetura de conversão (resumo)

| Seção | Função | Prioridade |
|---|---|---|
| Headline | Capturar atenção em 2s | Muito alta |
| Subheadline | Reforçar valor + localização | Muito alta |
| CTA WhatsApp único | Direcionar tráfego pago | Muito alta |
| Foto hero premium | Desejo e confiança | Alta |
| Prova social curta | Reduzir objeção | Alta |
| Galeria enxuta | Sustentar desejo | Alta |
| Localização | Relevância regional | Alta |
| Sticky WhatsApp mobile | Conversão móvel | Muito alta |
| Footer enxuto | Credibilidade (CNPJ) | Média |

---

## 4. Mudanças técnicas a implementar (modo build)

Arquivos a editar:
- `src/routes/index.tsx`
  - Trocar todos os `<Link to="/reservar">` por `<a href={WHATSAPP}>`.
  - Atualizar `WHATSAPP` com a nova mensagem pré-preenchida.
  - Remover seção "Acomodações" (cards de quartos), seção "Reserva direta", botão Reservar do header e do sticky mobile.
  - Reescrever hero, trust bar, CTA final com a nova copy.
  - Remover imports não usados (`quartoDuplo`, `quartoTriplo`, `quartoQuadruplo`, `Calendar`, etc.).
- `src/components/SiteFooter.tsx`
  - Remover coluna "Empresa" longa e link "Ligar para a recepção".
  - Manter marca + endereço resumido + WhatsApp + Instagram + CNPJ em linha discreta.
- Nenhuma alteração em rotas administrativas (`/auth`, `/dashboard`, `/reservas`, etc.) — apenas deixam de ser linkadas publicamente.

Sem mudanças de backend, schema ou auth.

---

## 5. Estimativas
- Custo: R$ 0
- Tempo: ~10 min de edição
- ROI esperado: aumento expressivo de CTR para WhatsApp e qualidade do lead, com página mais limpa, premium e confiável.

Se aprovar, eu aplico tudo isso no `index.tsx` e no `SiteFooter.tsx` em um único passo.
