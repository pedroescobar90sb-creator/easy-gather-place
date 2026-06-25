
-- Reseed: substituir os 13 quartos antigos pelos 17 reais da Pousada Ilha do Meio
DELETE FROM public.reservation_events;
DELETE FROM public.reservations;
DELETE FROM public.room_blocks;
DELETE FROM public.rooms;

INSERT INTO public.rooms (code, name, type, capacity, base_price, status, amenities, image, description) VALUES
('01','Quarto 01','duplo_casal',2,450,'active',ARRAY['TV','Ar-condicionado','Frigobar','Wi-Fi'],'/__l5e/assets-v1/e1bba8da-fa5f-4583-8e25-a5314dc681e0/pousada-1.jpg','Quarto duplo com cama de casal, TV, ar-condicionado e frigobar.'),
('02','Quarto 02','duplo_casal',2,450,'active',ARRAY['TV','Ar-condicionado','Frigobar','Wi-Fi'],'/__l5e/assets-v1/545be612-10a7-429d-acdb-2a942440c51f/pousada-2.jpg','Quarto duplo com cama de casal, TV, ar-condicionado e frigobar.'),
('03','Quarto 03','duplo_casal',2,450,'active',ARRAY['TV','Ar-condicionado','Frigobar','Wi-Fi'],'/__l5e/assets-v1/147f0147-b8fa-4779-8774-35b143d40c4f/pousada-3.jpg','Quarto duplo com cama de casal, TV, ar-condicionado e frigobar.'),
('04','Quarto 04','duplo_casal',2,450,'active',ARRAY['TV','Ar-condicionado','Frigobar','Wi-Fi'],'/__l5e/assets-v1/837fc2b3-948f-490e-aad2-3e2e3b77bbb5/pousada-4.jpg','Quarto duplo com cama de casal, TV, ar-condicionado e frigobar.'),
('05','Quarto 05','duplo_casal',2,450,'active',ARRAY['TV','Ar-condicionado','Frigobar','Wi-Fi'],'/__l5e/assets-v1/e202ce50-fc71-4e0b-8193-40474a16679c/pousada-5.jpg','Quarto duplo com cama de casal, TV, ar-condicionado e frigobar.'),
('06','Quarto 06','duplo_casal',2,450,'active',ARRAY['TV','Ar-condicionado','Frigobar','Wi-Fi'],'/__l5e/assets-v1/3ae0bf76-aedc-429e-915b-d68374fa526f/pousada-6.jpg','Quarto duplo com cama de casal, TV, ar-condicionado e frigobar.'),
('07','Quarto 07','duplo_casal',2,450,'active',ARRAY['TV','Ar-condicionado','Frigobar','Wi-Fi'],'/__l5e/assets-v1/8de6ec6c-aa60-4f34-b8ce-b5c956fb593a/pousada-7.jpg','Quarto duplo com cama de casal, TV, ar-condicionado e frigobar.'),
('08','Quarto 08','duplo_casal',2,450,'active',ARRAY['TV','Ar-condicionado','Frigobar','Wi-Fi'],'/__l5e/assets-v1/2b1a0a0d-3b75-40ef-915c-bd410a9b1d07/pousada-8.jpg','Quarto duplo com cama de casal, TV, ar-condicionado e frigobar.'),
('09','Quarto 09','duplo_casal',2,450,'active',ARRAY['TV','Ar-condicionado','Frigobar','Wi-Fi'],'/__l5e/assets-v1/7261bbac-ad5c-4b6b-a0bf-bb57f1d584c8/pousada-9.jpg','Quarto duplo com cama de casal, TV, ar-condicionado e frigobar.'),
('10','Quarto 10','duplo_casal',2,450,'active',ARRAY['TV','Ar-condicionado','Frigobar','Wi-Fi'],'/__l5e/assets-v1/584d2128-8f0f-4d72-85a5-c00ac3b6e593/pousada-11.jpg','Quarto duplo com cama de casal, TV, ar-condicionado e frigobar.'),
('11','Quarto 11','triplo',3,550,'active',ARRAY['TV','Ar-condicionado','Frigobar','Wi-Fi'],'/__l5e/assets-v1/e1bba8da-fa5f-4583-8e25-a5314dc681e0/pousada-1.jpg','Quarto triplo com TV, ar-condicionado e frigobar.'),
('12','Quarto 12','triplo',3,550,'active',ARRAY['TV','Ar-condicionado','Frigobar','Wi-Fi'],'/__l5e/assets-v1/545be612-10a7-429d-acdb-2a942440c51f/pousada-2.jpg','Quarto triplo com TV, ar-condicionado e frigobar.'),
('13','Quarto 13','triplo',3,550,'active',ARRAY['TV','Ar-condicionado','Frigobar','Wi-Fi'],'/__l5e/assets-v1/147f0147-b8fa-4779-8774-35b143d40c4f/pousada-3.jpg','Quarto triplo com TV, ar-condicionado e frigobar.'),
('14','Quarto 14','quadruplo',4,650,'active',ARRAY['TV','Ar-condicionado','Frigobar','Wi-Fi'],'/__l5e/assets-v1/837fc2b3-948f-490e-aad2-3e2e3b77bbb5/pousada-4.jpg','Quarto quádruplo para famílias, com TV, ar-condicionado e frigobar.'),
('15','Quarto 15','quadruplo',4,650,'active',ARRAY['TV','Ar-condicionado','Frigobar','Wi-Fi'],'/__l5e/assets-v1/e202ce50-fc71-4e0b-8193-40474a16679c/pousada-5.jpg','Quarto quádruplo para famílias, com TV, ar-condicionado e frigobar.'),
('16','Quarto 16','quadruplo',4,650,'active',ARRAY['TV','Ar-condicionado','Frigobar','Wi-Fi'],'/__l5e/assets-v1/3ae0bf76-aedc-429e-915b-d68374fa526f/pousada-6.jpg','Quarto quádruplo para famílias, com TV, ar-condicionado e frigobar.'),
('17','Quarto 17','quadruplo',4,650,'active',ARRAY['TV','Ar-condicionado','Frigobar','Wi-Fi'],'/__l5e/assets-v1/8de6ec6c-aa60-4f34-b8ce-b5c956fb593a/pousada-7.jpg','Quarto quádruplo para famílias, com TV, ar-condicionado e frigobar.');
