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
import ShippingPolicy from "./pages/ShippingPolicy";
import ReturnPolicy from "./pages/ReturnPolicy";
import SanjivaniProduct from "./pages/SanjivaniProduct";
import Account from "./pages/Account";
import ShoppingBag from "./pages/ShoppingBag";
import Checkout from "./pages/Checkout";
import Admin from "./pages/Admin";
import AgeGate from "./pages/AgeGate";
import { StoreProvider } from "./context/StoreContext";
import MobileBuyBar from "./components/MobileBuyBar";
import SupportDock from "./components/SupportDock";
import MetaPixel from "./components/MetaPixel";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <StoreProvider>
          <MetaPixel />
          <ScrollToTop />
          <div className="pb-[calc(5.75rem+env(safe-area-inset-bottom))] md:pb-0"><Routes>
            <Route path="/" element={<Index />} />
            <Route path="/products/:slug" element={<SanjivaniProduct />} />
            <Route path="/account" element={<Account />} />
            <Route path="/bag" element={<ShoppingBag />} />
            <Route path="/checkout" element={<Checkout />} />
<Route path="/admin" element={<Admin />} />
            <Route path="/access" element={<AgeGate />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/shipping-policy" element={<ShippingPolicy />} />
            <Route path="/return-policy" element={<ReturnPolicy />} />
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
