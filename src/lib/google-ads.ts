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
