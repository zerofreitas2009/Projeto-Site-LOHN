export const SITE_LOHN_REVIEW_MODAL_EVENT = "site_lohn_open_review_modal";

export function openSiteLohnReviewModal() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(SITE_LOHN_REVIEW_MODAL_EVENT));
}
