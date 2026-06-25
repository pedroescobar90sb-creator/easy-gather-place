-- =====================================================================
-- Seed mínimo — 13 quartos da Pousada Ilha do Meio
-- Execute UMA VEZ após rodar schema.sql
-- =====================================================================
insert into public.rooms (code, name, type, capacity, base_price, status, amenities, description) values
('101','Suíte Vista Mar','master',2,890,'active',array['Vista mar','Hidromassagem','Ar-condicionado','Varanda'],'Suíte master com vista frontal para o mar de Itacimirim.'),
('102','Suíte Jardim','suite',3,620,'active',array['Jardim privativo','Ar-condicionado'],'Suíte ampla com saída para jardim tropical.'),
('103','Bangalô Coqueiral 1','bangalo',2,540,'active',array['Rede','Varanda'],'Bangalô em madeira no meio do coqueiral.'),
('104','Bangalô Coqueiral 2','bangalo',2,540,'active',array['Rede','Varanda'],'Bangalô gêmeo com vista lateral mar.'),
('105','Bangalô Coqueiral 3','bangalo',4,720,'maintenance',array['Rede','Varanda','Família'],'Bangalô família com cama extra.'),
('106','Quarto Marezia','standard',2,420,'active',array['Ar-condicionado'],'Quarto charmoso e silencioso.'),
('107','Quarto Maré Alta','standard',2,420,'active',array['Ar-condicionado'],'Quarto com janela para o jardim.'),
('108','Quarto Maré Baixa','standard',2,420,'active',array['Ar-condicionado'],'Quarto aconchegante térreo.'),
('109','Quarto Coral','standard',3,480,'active',array['Ar-condicionado'],'Quarto triplo com varanda.'),
('110','Quarto Atobá','standard',2,420,'active',array['Ar-condicionado'],'Quarto com vista para piscina.'),
('111','Quarto Itacimirim','suite',4,780,'active',array['Família','Cozinha','Varanda'],'Suíte família com cozinha americana.'),
('112','Quarto Praia do Forte','standard',2,460,'active',array['Ar-condicionado'],'Quarto sereno no jardim interno.'),
('113','Quarto Ilha do Meio','master',2,950,'active',array['Vista mar','Ofurô','Varanda privativa'],'Suíte signature da pousada com ofurô externo.')
on conflict (code) do nothing;

insert into public.sync_state (channel, status, last_sync, imported_count, errors)
values ('booking','ok', now() - interval '7 minutes', 0, 0)
on conflict (channel) do nothing;

-- Após criar o usuário em Authentication → Users, rode:
-- insert into public.user_roles(user_id, role)
-- values ((select id from auth.users where email='recepcao@ilhadomeio.com.br'), 'admin');
