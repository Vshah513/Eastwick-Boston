/** Fired by "Quote this" buttons; the quote form listens and pre-selects the service. */
export const SELECT_SERVICE_EVENT = "eastwick:select-service";

export function requestQuoteFor(serviceId: string) {
  window.dispatchEvent(new CustomEvent<string>(SELECT_SERVICE_EVENT, { detail: serviceId }));
  document.getElementById("quote")?.scrollIntoView({ behavior: "smooth", block: "start" });
  window.history.replaceState(null, "", "#quote");
}
