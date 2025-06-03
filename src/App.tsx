
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { OnchainProviders } from "./providers/OnchainProviders";
import Navigation from "./components/Navigation";
import Index from "./pages/Index";
import Swap from "./pages/Swap";
import Staking from "./pages/Staking";
import NotFound from "./pages/NotFound";

const App = () => (
  <OnchainProviders>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen">
          <Navigation />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/swap" element={<Swap />} />
            <Route path="/staking" element={<Staking />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </OnchainProviders>
);

export default App;
