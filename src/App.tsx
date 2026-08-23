import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import Index from "./pages/Index";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Divorcio from "./pages/Divorcio";
import Privacy from "./pages/Privacy";
import CookieConsentBanner from "./components/site/CookieConsentBanner";
import { logSiteLohnEvent } from "./lib/siteLohnTagging";

function isExcludedPath(path: string) {
  return path.startsWith("/admin");
}

function AnalyticsListener() {
  const location = useLocation();
  const currentPathRef = useRef<string | null>(null);
  const startedAtRef = useRef<number | null>(null);
  const activeMsRef = useRef(0);

  const path = `${location.pathname}${location.search}${location.hash}`;

  const flushDuration = (now: number, reason: string) => {
    const currentPath = currentPathRef.current;
    if (!currentPath) return;

    const startedAt = startedAtRef.current;
    const total = activeMsRef.current + (startedAt ? now - startedAt : 0);

    // Avoid noise from extremely short transitions
    if (total >= 1000) {
      logSiteLohnEvent({
        event_type: "page_duration",
        page_path: currentPath,
        duration_ms: Math.round(total),
        meta: { reason },
      });
    }

    activeMsRef.current = 0;
    startedAtRef.current = null;
  };

  useEffect(() => {
    const now = Date.now();

    // Flush duration for the previous tracked page (if any)
    if (currentPathRef.current) {
      flushDuration(now, "route_change");
    }

    if (isExcludedPath(location.pathname)) {
      currentPathRef.current = null;
      startedAtRef.current = null;
      activeMsRef.current = 0;
      return;
    }

    currentPathRef.current = path;
    startedAtRef.current = document.visibilityState === "visible" ? now : null;

    logSiteLohnEvent({
      event_type: "page_view",
      page_path: path,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, location.pathname]);

  useEffect(() => {
    const onVisibilityChange = () => {
      const now = Date.now();
      if (!currentPathRef.current) return;

      if (document.visibilityState === "hidden") {
        if (startedAtRef.current) {
          activeMsRef.current += now - startedAtRef.current;
          startedAtRef.current = null;
        }
      } else {
        if (!startedAtRef.current) startedAtRef.current = now;
      }
    };

    const onPageHide = () => {
      if (!currentPathRef.current) return;
      flushDuration(Date.now(), "page_hide");
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pagehide", onPageHide);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pagehide", onPageHide);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

function GlobalOverlays() {
  const location = useLocation();
  if (location.pathname.startsWith("/admin")) return null;
  return <CookieConsentBanner />;
}

export default function App() {
  return (
    <>
      <AnalyticsListener />
      <GlobalOverlays />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/contato" element={<Contact />} />
        <Route path="/divorcio/*" element={<Divorcio />} />
        <Route path="/politica-de-privacidade/*" element={<Privacy />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </>
  );
}