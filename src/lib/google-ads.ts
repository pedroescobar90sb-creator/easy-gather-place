declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** Dispara o evento de conversão "CONTACT" do Google Ads (usa o gtag.js já carregado pelo GA4 no __root.tsx). */
export function trackGoogleAdsContact() {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", "conversion_event_contact");
}

/** Dispara o evento de conversão "PURCHASE" do Google Ads na reserva concluída (mesmo gtag.js do GA4). */
export function trackGoogleAdsPurchase(value: number, currency = "BRL") {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", "conversion_event_purchase", { value, currency });
}
