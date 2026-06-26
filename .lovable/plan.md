## Objetivo
Fechar a pousada para venda: rodapé profissional com CNPJ, fluxo de reserva sem bugs, e-mail Resend em toda confirmação e painel interno 100% sincronizado com o site.

---

## 1. Rodapé profissional (imagem 1)

**Arquivo:** `src/routes/index.tsx` (e `src/routes/reservar.tsx` ganha o mesmo rodapé)

Atualizar bloco do `<footer>` para layout 3 colunas:

- **Coluna 1 — Marca:** Logo + "Pousada Ilha do Meio" + tagline curta.
- **Coluna 2 — Empresa (novo):**
  - Razão social / nome fantasia: *Pousada Ilha do Meio*
  - **CNPJ 45.688.734/0001-43**
  - Endereço: *Rua Sítio Novo, 7 — Loteamento Santa Maria, Lote 8 · Itacimirim, Camaçari — BA · CEP 42823-000*
- **Coluna 3 — Contato:** Instagram, WhatsApp +55 71 9126-3096, e-mail.
- **Barra inferior:** `© {ano} Pousada Ilha do Meio · CNPJ 45.688.734/0001-43 · Todos os direitos reservados.`

Replicar mesmo rodapé como componente compartilhado `<SiteFooter />` em `src/components/SiteFooter.tsx` e usar em `index.tsx` e `reservar.tsx`.

---

## 2. Fluxo de reserva: datas → quartos (imagem 2)

**Arquivo:** `src/routes/reservar.tsx`

Problemas:
- Hoje as seções "Principais comodidades" e "Regras da casa" aparecem **em cima** da lista de quartos no step 2 (porque o `<section>` está antes do `{step === 2 && ...}` no JSX).
- Usuário quer: ao confirmar datas → mostrar **lista de quartos primeiro**, e comodidades/regras **embaixo**.

Mudanças:
1. Mover o bloco `{step !== 4 && (<section …comodidades/regras…/>)}` para **depois** do bloco `{step === 2 && (...)}` no JSX (e idealmente só renderizar nos steps 1 e 2, escondendo no 3).
2. Garantir que ao clicar "Ver quartos" o `setStep(2)` scrolla suavemente para o topo da lista (`window.scrollTo({ top: 0, behavior: 'smooth' })`).
3. Reposicionar `<Steps>` sticky no topo do `<main>` para feedback claro.

---

## 3. "Datas inválidas. Verifique check-in e check-out." (imagem 3)

**Causa:** O RPC `create_public_reservation` rejeita quando `check_in >= check_out` — mas o erro também aparece em outros caminhos. Investigar dois pontos:

- O `range` default no `useState` é `{from: hoje, to: hoje+2}` — válido.
- Quando o usuário muda só uma das datas, a lógica de auto-ajuste pode gerar `from === to` em casos extremos (clicar saída igual à entrada).

Correções em `src/routes/reservar.tsx`:
1. Endurecer `onSelect` dos dois calendários para **nunca** permitir `from >= to`: se igual, mover `to` para `from+1` automaticamente (e vice-versa).
2. Desabilitar botão "Ver quartos" e "Confirmar" quando `nights < 1`.
3. Mostrar mensagem inline (em vez de toast) próxima aos date pickers quando inválido.
4. Tratar erro `invalid_dates` do RPC com toast claro **+ voltar para step 1**.

---

## 4. E-mail de confirmação via Resend (em toda reserva)

**Estado atual:** `src/lib/email.functions.ts` usa `process.env.RESEND_API_KEY` direto na API do Resend. Se a key não estiver setada como secret de servidor, o envio é pulado silenciosamente.

Plano:
1. **Verificar/configurar secret** `RESEND_API_KEY` no ambiente do servidor (TanStack server function). Se não estiver, pedir ao usuário via `add_secret`.
2. Atualizar `email.functions.ts`:
   - Remetente: `Pousada Ilha do Meio <reservas@onboarding.resend.dev>` (até domínio próprio verificado) — manter mas adicionar `reply_to` com e-mail real da pousada.
   - Incluir CNPJ e endereço completo no rodapé do e-mail.
   - Incluir horários (check-in 14h, check-out 11h) e instrução "chave na recepção".
   - Retornar erro estruturado em vez de silenciar (logar no console mas não quebrar UX).
3. **Garantir disparo**: em `confirm()` o `await sendReservationConfirmation(...)` já roda dentro de `try/catch`. Adicionar log de auditoria no Supabase numa tabela `email_log` (template, recipient, status, created_at) para o painel admin ter histórico de envios.
4. Toast final: "Reserva confirmada — verifique seu e-mail (e caixa de spam)".

---

## 5. Sincronização 100% site ↔ painel interno

**Estado atual:** `useSupabaseBootstrap.ts` já tem realtime + refresh a cada 20s + focus listener. RPC `create_public_reservation` insere em `guests` + `reservations`. Painel deveria ver na hora.

Validações extras:
1. Confirmar que `reservations` e `guests` têm publicação realtime ativa (verificar via supabase linter / migration).
2. No painel `/reservas`, mostrar badge "Nova" nas reservas criadas nas últimas 2h e ordenar por `created_at desc` por padrão.
3. Em `/hospedes`, garantir que hóspedes vindos do site aparecem com origem `site` (campo `source`). Adicionar coluna "Origem" e badge.
4. Dashboard: card "Reservas hoje (site)" + "Próximos check-ins (7 dias)".

---

## Detalhes técnicos

- **Rodapé compartilhado:** novo `src/components/SiteFooter.tsx`, props `variant: "site" | "booking"`.
- **Resend:** server function continua `createServerFn({ method: "POST" })`. Se preferir, migrar para connector gateway do Resend (`standard_connectors`) para não depender de env var manual.
- **email_log table (migration nova):**
  ```sql
  CREATE TABLE public.email_log (
    id uuid primary key default gen_random_uuid(),
    template text not null,
    recipient text not null,
    status text not null,
    error text,
    reservation_id uuid references public.reservations(id) on delete set null,
    created_at timestamptz not null default now()
  );
  GRANT SELECT ON public.email_log TO authenticated;
  GRANT ALL ON public.email_log TO service_role;
  ALTER TABLE public.email_log ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "admin reads email_log" ON public.email_log FOR SELECT
    TO authenticated USING (public.has_role(auth.uid(), 'admin'));
  ```
- **Validação de datas:** helper `clampRange(from, to)` que garante `to >= from+1`.

---

## Pergunta antes de executar

Para o envio de e-mail funcionar 100%, preciso de **uma** destas:

1. Você confirma que **`RESEND_API_KEY` já está como secret de servidor** no projeto? (se não, eu peço pelo add_secret)
2. Ou prefere que eu migre para o **connector Resend** da Lovable (mais simples, só clicar)?

Após sua resposta executo o plano inteiro de uma vez.