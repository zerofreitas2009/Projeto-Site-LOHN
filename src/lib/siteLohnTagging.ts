import { supabase } from "../integrations/supabase/client";

export type SiteLohnEventType = "page_view" | "button_click" | "page_duration";

type EventInsert = {
  event_type: SiteLohnEventType;
  page_path?: string | null;
  button_id?: string | null;
  button_label?: string | null;
  session_id?: string | null;
  referrer?: string | null;
  user_agent?: string | null;
  device_type?: string | null;
  platform?: string | null;
  duration_ms?: number | null;
  meta?: Record<string, unknown>;
};

const SESSION_KEY = "site_lohn_session_id";

function getSessionId() {
  try {
    const existing = localStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
    return id;
  } catch {
    return null;
  }
}

function detectDeviceType() {
  const ua = navigator.userAgent;
  if (/iPad|Tablet/i.test(ua)) return "tablet";
  if (/Mobi|Android|iPhone|iPod|Windows Phone/i.test(ua)) return "mobile";
  return "desktop";
}

function detectPlatform() {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
  if (/Android/i.test(ua)) return "android";
  return "web";
}

export async function logSiteLohnEvent(input: EventInsert) {
  try {
    const session_id = getSessionId();
    const payload = {
      ...input,
      session_id,
      referrer: input.referrer ?? document.referrer ?? null,
      user_agent: input.user_agent ?? navigator.userAgent ?? null,
      device_type: input.device_type ?? detectDeviceType(),
      platform: input.platform ?? detectPlatform(),
      meta: input.meta ?? {},
    };

    // Fire-and-forget. We don't want to block navigation/clicks.
    supabase.from("site_lohn_tag_events").insert(payload).then(({ error }) => {
      if (error) console.error("[site-lohn] tagging insert", error);
    });
  } catch (e) {
    console.error("[site-lohn] tagging unexpected", e);
  }
}