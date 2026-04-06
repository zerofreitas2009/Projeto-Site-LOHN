import { Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import Contact from "./pages/Contact";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/contato" element={<Contact />} />
    </Routes>
  );
}