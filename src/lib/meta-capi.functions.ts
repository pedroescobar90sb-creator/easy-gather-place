import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

interface Input {
  eventName: string;
  eventId: string;
  eventSourceUrl: string;
  actionSource?: "website";
  value?: number;
  currency?: string;
  email?: string;
  phone?: string;
  fbp?: string;
  fbc?: string;
}

async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10 || digits.length === 11) return `55${digits}`;
  return digits;
}

export const sendMetaCapiEvent = createServerFn({ method: "POST" })
  .inputValidator((data: Input) => data)
  .handler(async ({ data }) => {
    const pixelId = process.env.META_PIXEL_ID;
    const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
    if (!pixelId || !accessToken) {
      console.warn("[meta-capi] META_PIXEL_ID/META_CAPI_ACCESS_TOKEN ausente · skipping send");
      return { ok: false, skipped: true };
    }

    const request = getRequest();
    const userAgent = request?.headers.get("user-agent") ?? undefined;
    const clientIp =
      request?.headers.get("cf-connecting-ip") ??
      request?.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      undefined;

    const userData: Record<string, unknown> = {};
    if (data.email) userData.em = [await sha256Hex(data.email.trim().toLowerCase())];
    if (data.phone) userData.ph = [await sha256Hex(normalizePhone(data.phone))];
    if (data.fbp) userData.fbp = data.fbp;
    if (data.fbc) userData.fbc = data.fbc;
    if (clientIp) userData.client_ip_address = clientIp;
    if (userAgent) userData.client_user_agent = userAgent;

    const testEventCode = process.env.META_TEST_EVENT_CODE;

    const payload = {
      data: [
        {
          event_name: data.eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_id: data.eventId,
          event_source_url: data.eventSourceUrl,
          action_source: data.actionSource ?? "website",
          user_data: userData,
          ...(data.value !== undefined
            ? { custom_data: { value: data.value, currency: data.currency ?? "BRL" } }
            : {}),
        },
      ],
      ...(testEventCode ? { test_event_code: testEventCode } : {}),
    };

    try {
      const res = await fetch(
        `https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${accessToken}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.error("[meta-capi] graph api failed", res.status, json);
        return { ok: false, error: json };
      }
      return { ok: true, result: json };
    } catch (e) {
      console.error("[meta-capi] exception", e);
      return { ok: false, error: e instanceof Error ? e.message : "unknown" };
    }
  });
