
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import { GameProvider } from "./context/GameContext";
import { SocketProvider } from "./context/SocketContext";
import GameOverlay from "./components/overlay/GameOverlay";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SocketProvider>
          <GameProvider>
            <Toaster />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/overlay" element={<GameOverlay />} />
              </Routes>
            </BrowserRouter>
          </GameProvider>
        </SocketProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
