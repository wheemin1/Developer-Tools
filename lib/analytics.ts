export type AnalyticsPayload = Record<string, string | number | boolean | null | undefined>

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>
    plausible?: (eventName: string, options?: { props?: Record<string, unknown> }) => void
  }
}

export function trackEvent(eventName: string, payload: AnalyticsPayload = {}) {
  if (typeof window === "undefined") return

  const event = {
    eventName,
    path: window.location.pathname,
    timestamp: Date.now(),
    ...payload,
  }

  window.dispatchEvent(new CustomEvent("developer-tools-analytics", { detail: event }))

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: eventName, ...payload })
  }

  if (typeof window.plausible === "function") {
    window.plausible(eventName, { props: payload })
  }
}
