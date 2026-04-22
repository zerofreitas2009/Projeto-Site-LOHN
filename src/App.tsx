import { Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/contato" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}