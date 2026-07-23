import { metaTrack, newMetaEventId, getFbCookie, getOrBuildFbc } from "@/lib/meta-pixel";
import { sendMetaCapiEvent } from "@/lib/meta-capi.functions";
import { trackGoogleAdsContact } from "@/lib/google-ads";

/** Dispara Lead (Pixel + Conversions API + Google Ads) no clique de um CTA de WhatsApp · sinal mais forte que "Contact" pro Meta otimizar o anúncio. */
export function trackWhatsAppLead(contentName: string, value?: number) {
  const eventId = newMetaEventId();
  metaTrack("Lead", { content_name: contentName, ...(value ? { value, currency: "BRL" } : {}) }, eventId);
  trackGoogleAdsContact();
  sendMetaCapiEvent({
    data: {
      eventName: "Lead",
      eventId,
      eventSourceUrl: typeof window !== "undefined" ? window.location.href : "",
      value,
      currency: value ? "BRL" : undefined,
      fbp: getFbCookie("_fbp"),
      fbc: getOrBuildFbc(),
    },
  }).catch(() => {});
}
