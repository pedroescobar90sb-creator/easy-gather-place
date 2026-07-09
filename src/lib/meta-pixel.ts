declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & { queue?: unknown[] };
  }
}

export const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID as string | undefined;

/** Dispara evento no Pixel do navegador. Passe o mesmo eventId usado na chamada server-side (CAPI) para dedup. */
export function metaTrack(
  eventName: string,
  params?: Record<string, unknown>,
  eventId?: string,
) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  if (eventId) {
    window.fbq("track", eventName, params ?? {}, { eventID: eventId });
  } else {
    window.fbq("track", eventName, params ?? {});
  }
}

export function newMetaEventId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `evt_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export function getFbCookie(name: "_fbp" | "_fbc"): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}
