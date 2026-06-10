import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import ScrollProgress from "./components/ScrollProgress";
import CursorTrail from "./components/CursorTrail";
import CustomCursor from "./components/CustomCursor";
import SmoothScroll from "./components/SmoothScroll";
import TickerTape from "./components/TickerTape";
import Spotlight from "./components/Spotlight";
import BrowserEggs from "./components/BrowserEggs";
import IdleZzz from "./components/IdleZzz";
import KonamiCode from "./components/KonamiCode";
import Index from "./pages/Index";
import SecretPage from "./pages/SecretPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <SmoothScroll />
        <ScrollProgress />
        <CursorTrail />
        <CustomCursor />
        <Spotlight />
        <TickerTape />
        <BrowserEggs />
        <IdleZzz />
        <KonamiCode />
        <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/root" element={<SecretPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
