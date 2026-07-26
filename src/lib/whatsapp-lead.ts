import { metaTrack, newMetaEventId, getFbCookie, getOrBuildFbc } from "@/lib/meta-pixel";
import { sendMetaCapiEvent } from "@/lib/meta-capi.functions";
import { trackGoogleAdsContact } from "@/lib/google-ads";
import { codigoOrigem } from "@/lib/origem-anuncio";

/** Dispara Lead (Pixel + Conversions API + Google Ads) no clique de um CTA de WhatsApp · sinal mais forte que "Contact" pro Meta otimizar o anúncio. */
export function trackWhatsAppLead(contentName: string, value?: number) {
  const eventId = newMetaEventId();
  // Qual anúncio trouxe essa pessoa · segue nos dois lados (Pixel e CAPI) pro relatório da
  // Meta mostrar o lead já com a origem, sem precisar sujar a mensagem do WhatsApp.
  const origem = codigoOrigem() ?? undefined;
  metaTrack(
    "Lead",
    {
      content_name: contentName,
      ...(origem ? { origem_anuncio: origem } : {}),
      ...(value ? { value, currency: "BRL" } : {}),
    },
    eventId,
  );
  trackGoogleAdsContact();
  sendMetaCapiEvent({
    data: {
      eventName: "Lead",
      eventId,
      eventSourceUrl: typeof window !== "undefined" ? window.location.href : "",
      value,
      currency: value ? "BRL" : undefined,
      origem,
      fbp: getFbCookie("_fbp"),
      fbc: getOrBuildFbc(),
    },
  }).catch(() => {});
}
