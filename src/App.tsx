import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import SanjivaniProduct from "./pages/SanjivaniProduct";
import Account from "./pages/Account";
import ShoppingBag from "./pages/ShoppingBag";
import Checkout from "./pages/Checkout";
import Admin from "./pages/Admin";
import { StoreProvider } from "./context/StoreContext";
import MobileBuyBar from "./components/MobileBuyBar";
import SupportDock from "./components/SupportDock";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <StoreProvider>
          <ScrollToTop />
          <div className="pb-[calc(5.75rem+env(safe-area-inset-bottom))] md:pb-0"><Routes>
            <Route path="/" element={<Index />} />
            <Route path="/products/:slug" element={<SanjivaniProduct />} />
            <Route path="/account" element={<Account />} />
            <Route path="/bag" element={<ShoppingBag />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="*" element={<NotFound />} />
          </Routes></div>
          <SupportDock />
          <MobileBuyBar />
        </StoreProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
