
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import HostPage from "./pages/HostPage";
import PlayerPage from "./pages/PlayerPage";
import PlayersPage from "./pages/PlayersPage";
import NotFound from "./pages/NotFound";
import GameRulesPage from "./pages/GameRulesPage";
import SettingsPage from "./pages/SettingsPage";
import OverlayPage from "./pages/OverlayPage";
import { GameProvider } from "./context/GameContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <GameProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/host" element={<HostPage />} />
            <Route path="/player" element={<PlayerPage />} />
            <Route path="/players" element={<PlayersPage />} />
            <Route path="/rules" element={<GameRulesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/overlay" element={<OverlayPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </GameProvider>
  </QueryClientProvider>
);

export default App;
