import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import { logSiteLohnEvent } from "./lib/siteLohnTagging";

function AnalyticsListener() {
  const location = useLocation();

  useEffect(() => {
    logSiteLohnEvent({
      event_type: "page_view",
      page_path: `${location.pathname}${location.search}${location.hash}`,
    });
  }, [location.pathname, location.search, location.hash]);

  return null;
}

export default function App() {
  return (
    <>
      <AnalyticsListener />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/contato" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </>
  );
}