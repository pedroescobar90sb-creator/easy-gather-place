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

const CNPJ = "45.688.734/0001-43";
const ADDRESS_LINE1 = "Rua Sítio Novo, 7 · Loteamento Santa Maria, Lote 8";
const ADDRESS_LINE2 = "Itacimirim, Camaçari · BA · CEP 42823-000";
const REPLY_TO = "reservas@pousadailhadomeio.com.br";
const WHATSAPP_DISPLAY = "+55 71 9126-3096";

export const sendReservationConfirmation = createServerFn({ method: "POST" })
  .inputValidator((data: Input) => data)
  .handler(async ({ data }) => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn("[email] RESEND_API_KEY ausente · skipping send");
      return { ok: false, skipped: true };
    }

    const html = `<!doctype html><html><body style="font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background:#faf9f5;padding:32px 16px;color:#1a1a1a;margin:0">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:14px;padding:36px;border:1px solid #ececec;box-shadow:0 1px 3px rgba(0,0,0,0.04)">
    <div style="text-align:center;margin-bottom:28px;padding-bottom:20px;border-bottom:1px solid #f0ede4">
      <div style="font-size:10px;letter-spacing:0.22em;color:#8a8470;text-transform:uppercase;margin-bottom:4px">Pousada</div>
      <div style="font-family:Georgia,'Times New Roman',serif;font-size:26px;color:#1a1a1a;font-weight:500">Ilha do Meio</div>
      <div style="font-size:11px;color:#8a8470;margin-top:6px">Itacimirim · Bahia</div>
    </div>

    <h1 style="font-family:Georgia,serif;font-size:24px;margin:0 0 10px;font-weight:500">Olá, ${escapeHtml(data.name)}!</h1>
    <p style="color:#555;margin:0 0 24px;line-height:1.55">
      Recebemos sua reserva na <strong>Pousada Ilha do Meio</strong>. Em até 2 horas confirmaremos por WhatsApp e prepararemos tudo para sua chegada.
    </p>

    <div style="background:#f6f5f0;border-radius:10px;padding:22px;margin-bottom:22px">
      <table style="width:100%;font-size:14px;color:#333;border-collapse:collapse">
        <tr><td style="padding:7px 0;color:#777">Quarto</td><td style="padding:7px 0;text-align:right;font-weight:600">${escapeHtml(data.roomName)}</td></tr>
        <tr><td style="padding:7px 0;color:#777">Check-in</td><td style="padding:7px 0;text-align:right">${fmtDate(data.checkIn)} · a partir das 14h</td></tr>
        <tr><td style="padding:7px 0;color:#777">Check-out</td><td style="padding:7px 0;text-align:right">${fmtDate(data.checkOut)} · até 11h</td></tr>
        <tr><td style="padding:7px 0;color:#777">Noites · Hóspedes</td><td style="padding:7px 0;text-align:right">${data.nights} · ${data.guests}</td></tr>
        <tr><td style="padding:14px 0 0;border-top:1px solid #e3e0d6;font-size:13px;color:#777">Total estimado</td><td style="padding:14px 0 0;border-top:1px solid #e3e0d6;text-align:right;font-size:20px;font-weight:700;color:#1a1a1a">${fmtBRL(data.total)}</td></tr>
      </table>
    </div>

    <div style="background:#fffaf0;border-left:3px solid #c9a96e;border-radius:6px;padding:14px 16px;margin-bottom:22px;font-size:13px;color:#5a4a2a;line-height:1.5">
      <strong style="display:block;margin-bottom:4px;color:#3a2f1a">Importante</strong>
      A chave do quarto é retirada na recepção no momento do check-in. Documento com foto será solicitado.
    </div>

    <p style="color:#555;font-size:13px;line-height:1.5;margin:0 0 4px">
      Qualquer dúvida, responda este e-mail ou chame no WhatsApp <strong>${WHATSAPP_DISPLAY}</strong>.
    </p>

    <div style="margin-top:28px;padding-top:18px;border-top:1px solid #f0ede4;font-size:11px;color:#999;line-height:1.6;text-align:center">
      <div style="font-weight:600;color:#666;margin-bottom:2px">Pousada Ilha do Meio</div>
      <div>${ADDRESS_LINE1}</div>
      <div>${ADDRESS_LINE2}</div>
      <div style="margin-top:6px">CNPJ ${CNPJ}</div>
    </div>
  </div>
</body></html>`;

    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          from: "Pousada Ilha do Meio <onboarding@resend.dev>",
          to: [data.to],
          reply_to: REPLY_TO,
          subject: `Reserva recebida · ${fmtDate(data.checkIn)} · Pousada Ilha do Meio`,
          html,
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        console.error("[email] resend failed", res.status, text);
        return { ok: false, error: text };
      }
      const json = await res.json().catch(() => ({}));
      return { ok: true, id: (json as { id?: string }).id };
    } catch (e) {
      console.error("[email] resend exception", e);
      return { ok: false, error: e instanceof Error ? e.message : "unknown" };
    }
  });

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}
