
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Features from "./pages/Features";
import Tutorials from "./pages/Tutorials";
import Download from "./pages/Download";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import ProductApp from "../src/pages/products/src/ProductApp"; // ✅ New import
import { CartProvider } from "../src/pages/products/src/context/CartContext"; // ✅ Add this
import AdminDash from "./pages/Admindashboard/src/AdminDash";
import AppAuth from "./pages/Login/src/App";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/features" element={<Features />} />
          <Route path="/tutorials" element={<Tutorials />} />
          <Route path="/download" element={<Download />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/product/*" element={<ProductApp />} />
          <Route path="/Dash/*" element={<AdminDash />} />
          <Route path="/auth/*" element={<AppAuth />} />
        </Routes>
        </CartProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
