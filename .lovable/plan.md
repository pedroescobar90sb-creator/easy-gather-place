## Objetivo
Deixar o sistema pronto para venda: site público claro e à prova de erros, painel interno recebendo 100% das reservas em tempo real, sem possibilidade de overbooking (incluindo futura integração com Booking.com).

## 1. Site público (`/` e `/reservar`)

**Home (`src/routes/index.tsx`)**
- Nos 3 cards de quartos (Duplo / Triplo / Quádruplo), trocar o texto/ícone "Chegada surpresa no quarto" por **"Pagamento e chave na recepção"** (ícone de chave).
- Garantir que cada card envie `?type=duplo|triplo|quadruplo` para `/reservar` (já existe, validar).

**Reservar (`src/routes/reservar.tsx`)**
- Remover qualquer menção a "chegada surpresa".
- Trocar o bloco lateral por: **"Pagamento realizado na recepção no check-in"** + **"Retirada da chave na recepção"**.
- Travar nº de hóspedes 100% pelo tipo escolhido (duplo=2, triplo=3, quadruplo=4) — esconder botões +/−, mostrar valor fixo.
- Mostrar apenas quartos do tipo escolhido **e disponíveis nas datas** (já usa `public_busy_room_ids`, reforçar feedback: se 0 quartos livres → banner vermelho "Sem vagas nesta data, escolha outras").
- Mostrar contador de quartos restantes por tipo na seleção de datas (ex: "2 quartos duplo disponíveis").
- Mensagem de erro amigável quando ocorrer conflito (já feito, manter).
- Após confirmar: tela de sucesso clara — "Reserva CÓDIGO confirmada. Pague e retire a chave na recepção no dia DD/MM."

## 2. Painel interno — visibilidade total das reservas

- Confirmar que `create_public_reservation` (RPC) insere com `channel='site'` e `status='pending'` (já está).
- Em `useSupabaseBootstrap`: adicionar **Supabase Realtime** subscrevendo `reservations`, `guests`, `room_blocks` → atualiza store na hora, sem depender de polling de 20s.
- Toast no painel quando chegar reserva nova: "Nova reserva do site: NOME — Quarto X".
- Validar que `reservas.tsx`, `calendario.tsx`, `hospedes.tsx` e `dashboard.tsx` mostram a reserva imediatamente (RLS para `admin`/`operacao` já permite).

## 3. Prevenção de overbooking (site + Booking + interno)

A camada definitiva é o banco (`reservations_no_overlap` EXCLUDE constraint já existe). Reforços:

- **No site**: `public_busy_room_ids(check_in, check_out)` já filtra. Adicionar índice por tipo para listar disponibilidade agregada.
- **No painel**: ao criar/editar reserva manual, chamar a mesma checagem antes do insert (UX) e tratar erro `23P01` (exclusion violation) com mensagem clara.
- **Para Booking.com (preparação)**: criar coluna `external_ref` + `channel` já existem. Adicionar:
  - tabela `channel_sync_log` (id, channel, action, payload, status, created_at) para auditoria.
  - endpoint público `/api/public/webhooks/booking` (TanStack server route) com verificação de assinatura via secret `BOOKING_WEBHOOK_SECRET`, que insere via `supabaseAdmin` respeitando a mesma constraint de não-sobreposição.
  - função `create_channel_reservation(...)` SECURITY DEFINER análoga à do site, aceitando `channel='booking'` e `external_ref`.
  - Documento curto em `docs/booking-integration.md` explicando como apontar o webhook.

## 4. Limpeza e robustez

- Remover do menu/UX qualquer botão "Criar primeira conta admin" se já houver admin (já oculto, revalidar).
- `auth.tsx`: somente login, sem signup público.
- Verificar `StatusBadge` e fallbacks em `reservas.tsx`, `reservas.$id.tsx`, `calendario.tsx` (nome do hóspede, nº do quarto, capacidade) — já feito, revalidar após mudanças.
- Conferir que `Logo`, `AppSidebar`, `sonner` exportam default/named corretamente (causa raiz dos "Element type is invalid" anteriores).
- Rodar build + abrir Playwright em `/`, `/reservar?type=duplo`, fazer reserva e checar `/reservas` no painel logado.

## 5. Migrations necessárias

1. `channel_sync_log` (tabela + GRANTs + RLS apenas staff lê).
2. `create_channel_reservation(channel, external_ref, ...)` SECURITY DEFINER.
3. Garantir índice `reservations(check_in, check_out)` para o filtro público.

## 6. Verificação final (checklist antes de entregar)

- [ ] Reserva pelo site aparece no painel em <2s (realtime).
- [ ] Tentativa de reservar mesmas datas/quarto → bloqueada com mensagem amigável.
- [ ] Duplo trava em 2, triplo em 3, quadruplo em 4 (sem botões).
- [ ] Textos "chegada surpresa" removidos; "pagamento/chave na recepção" presentes.
- [ ] Webhook Booking documentado e testado com payload fake.
- [ ] Sem erros no console em nenhuma rota.

## Detalhes técnicos
- Realtime: `supabase.channel('admin-sync').on('postgres_changes', { event: '*', schema: 'public', table: 'reservations' }, ...).subscribe()` dentro de `useSupabaseBootstrap` quando autenticado.
- Webhook Booking em `src/routes/api/public/webhooks.booking.ts` usando `createFileRoute` + `server.handlers.POST`, HMAC SHA-256, import dinâmico de `client.server`.
- Constraint de overlap já garante atomicidade — UI só faz pré-checagem para UX.
