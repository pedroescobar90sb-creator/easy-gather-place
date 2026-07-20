import { createFileRoute } from "@tanstack/react-router";

const WHATSAPP_URL =
  "https://api.whatsapp.com/send/?phone=557191263096&text=" +
  encodeURIComponent("Olá! Vim pelo site da Pousada Ilha do Meio e quero fazer uma reserva.");

/**
 * Motor de reserva próprio desativado: confirmava reserva sozinho, sem
 * passar por conversa no WhatsApp, contrariando a regra do negócio.
 * Redireciona pra conversa real em vez de virar 404, preservando quem
 * tiver o link salvo ou vier do Google (a página estava indexada).
 */
export const Route = createFileRoute("/reservar")({
  server: {
    handlers: {
      GET: async () => new Response(null, { status: 301, headers: { Location: WHATSAPP_URL } }),
    },
  },
});
