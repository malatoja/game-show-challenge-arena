
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import HostPage from "./pages/HostPage";
import PlayersPage from "./pages/PlayersPage";
import OverlayPage from "./pages/OverlayPage";
import SettingsPage from "./pages/SettingsPage";
import GameRulesPage from "./pages/GameRulesPage";
import NotFound from "./pages/NotFound";
import { GameProvider } from "./context/GameContext";
import { SocketProvider } from "./context/SocketContext";
import { ThemeProvider } from "./context/ThemeProvider";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <SocketProvider>
            <GameProvider>
              <Toaster />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/host" element={<HostPage />} />
                  <Route path="/players" element={<PlayersPage />} />
                  <Route path="/overlay" element={<OverlayPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/rules" element={<GameRulesPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </GameProvider>
          </SocketProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
