import { createServerFn } from "@tanstack/react-start";

interface Input {
  to: string;
  name: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  total: number;
}

const fmtDate = (s: string) =>
  new Date(s + "T00:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
const fmtBRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

export const sendReservationConfirmation = createServerFn({ method: "POST" })
  .inputValidator((data: Input) => data)
  .handler(async ({ data }) => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn("[email] RESEND_API_KEY ausente — skipping send");
      return { ok: false, skipped: true };
    }

    const html = `<!doctype html><html><body style="font-family:-apple-system,Segoe UI,sans-serif;background:#fafaf7;padding:32px;color:#1a1a1a">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;padding:32px;border:1px solid #ececec">
    <h1 style="font-family:Georgia,serif;font-size:24px;margin:0 0 8px">Olá, ${escapeHtml(data.name)} 🌿</h1>
    <p style="color:#555;margin:0 0 24px">Recebemos sua reserva na <strong>Pousada Ilha do Meio</strong>. Em até 2 horas confirmaremos por WhatsApp.</p>
    <div style="background:#f6f5f0;border-radius:8px;padding:20px;margin-bottom:20px">
      <table style="width:100%;font-size:14px;color:#333;border-collapse:collapse">
        <tr><td style="padding:6px 0;color:#777">Quarto</td><td style="padding:6px 0;text-align:right;font-weight:600">${escapeHtml(data.roomName)}</td></tr>
        <tr><td style="padding:6px 0;color:#777">Check-in</td><td style="padding:6px 0;text-align:right">${fmtDate(data.checkIn)} · 14h</td></tr>
        <tr><td style="padding:6px 0;color:#777">Check-out</td><td style="padding:6px 0;text-align:right">${fmtDate(data.checkOut)} · 11h</td></tr>
        <tr><td style="padding:6px 0;color:#777">Noites · Hóspedes</td><td style="padding:6px 0;text-align:right">${data.nights} · ${data.guests}</td></tr>
        <tr><td style="padding:12px 0 0;border-top:1px solid #e3e0d6;font-size:13px;color:#777">Total estimado</td><td style="padding:12px 0 0;border-top:1px solid #e3e0d6;text-align:right;font-size:18px;font-weight:700">${fmtBRL(data.total)}</td></tr>
      </table>
    </div>
    <p style="color:#555;font-size:13px;margin:0 0 4px">Itacimirim, Camaçari · BA</p>
    <p style="color:#999;font-size:12px;margin:0">Qualquer dúvida, responda este e-mail ou chame no WhatsApp +55 71 9126-3096.</p>
  </div>
</body></html>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        from: "Pousada Ilha do Meio <onboarding@resend.dev>",
        to: [data.to],
        subject: `Reserva recebida — ${fmtDate(data.checkIn)}`,
        html,
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error("[email] resend failed", res.status, text);
      return { ok: false, error: text };
    }
    return { ok: true };
  });

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}
