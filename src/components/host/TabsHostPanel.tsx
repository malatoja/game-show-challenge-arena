
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGame } from '@/context/GameContext';
import { useGameHistory } from '@/components/host/context/GameHistoryContext';
import { useGameControl } from './context/GameControlContext';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  Zap, 
  Gamepad2, 
  CreditCard, 
  Camera, 
  FileText,
  Clock,
  Users
} from 'lucide-react';

import EliminationsTab from './tabs/EliminationsTab';
import QuickResponseTab from './tabs/QuickResponseTab';
import WheelTab from './tabs/WheelTab';
import SpecialCardsTab from './tabs/SpecialCardsTab';
import CameraOverlayTab from './tabs/CameraOverlayTab';
import SummaryLogTab from './tabs/SummaryLogTab';
import CrossTabControls from './CrossTabControls';

export function TabsHostPanel() {
  const { state } = useGame();
  const { actions } = useGameHistory();
  const gameControl = useGameControl();
  const [activeTab, setActiveTab] = useState('round1');
  
  // Determine which tab should be active based on the current round
  React.useEffect(() => {
    if (state.currentRound === 'knowledge') {
      setActiveTab('round1');
    } else if (state.currentRound === 'speed') {
      setActiveTab('round2');
    } else if (state.currentRound === 'wheel') {
      setActiveTab('round3');
    }
  }, [state.currentRound]);

  // Helper function to get round status
  const getRoundStatus = (roundType: string) => {
    if (state.currentRound === roundType && state.roundStarted && !state.roundEnded) {
      return 'active';
    } else if (state.roundEnded && state.currentRound === roundType) {
      return 'completed';
    }
    return 'inactive';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="ml-2 bg-green-500">Aktywna</Badge>;
      case 'completed':
        return <Badge variant="secondary" className="ml-2">Zakończona</Badge>;
      default:
        return null;
    }
  };

  const activePlayers = state.players.filter(p => !p.eliminated).length;
  const totalPlayers = state.players.length;

  return (
    <div className="container mx-auto p-4 bg-gameshow-background">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Game Rounds Tabs */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Gamepad2 className="h-5 w-5" />
            Rundy gry
            <Badge variant="outline" className="ml-2">
              {activePlayers}/{totalPlayers} graczy aktywnych
            </Badge>
          </h3>
          <TabsList className="grid grid-cols-3 mb-2">
            <TabsTrigger 
              value="round1" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center"
            >
              <Target className="h-4 w-4 mr-2" />
              Runda 1: Eliminacje
              {getStatusBadge(getRoundStatus('knowledge'))}
            </TabsTrigger>
            <TabsTrigger 
              value="round2" 
              className="data-[state=active]:bg-amber-600 data-[state=active]:text-white flex items-center"
            >
              <Zap className="h-4 w-4 mr-2" />
              Runda 2: Szybka odpowiedź
              {getStatusBadge(getRoundStatus('speed'))}
            </TabsTrigger>
            <TabsTrigger 
              value="round3" 
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white flex items-center"
            >
              <Gamepad2 className="h-4 w-4 mr-2" />
              Runda 3: Koło fortuny
              {getStatusBadge(getRoundStatus('wheel'))}
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Management Tabs */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Zarządzanie grą
          </h3>
          <TabsList className="grid grid-cols-3 mb-2">
            <TabsTrigger value="cards" className="flex items-center">
              <CreditCard className="h-4 w-4 mr-2" />
              Karty specjalne
              {state.players.reduce((total, player) => total + player.cards.filter(c => !c.isUsed).length, 0) > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {state.players.reduce((total, player) => total + player.cards.filter(c => !c.isUsed).length, 0)}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="camera" className="flex items-center">
              <Camera className="h-4 w-4 mr-2" />
              Kamery / Overlay
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Podsumowanie / Logi
              {actions.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {actions.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Universal Cross-Tab Controls */}
        <CrossTabControls />

        {/* Tab contents */}
        <div className="mt-6">
          <TabsContent value="round1">
            <div className="bg-gameshow-card rounded-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Target className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Runda 1: Eliminacje</h2>
                  <p className="text-gameshow-muted">Pytania wiedzy ogólnej - za błędną odpowiedź gracz traci życie</p>
                </div>
              </div>
              <EliminationsTab />
            </div>
          </TabsContent>
          
          <TabsContent value="round2">
            <div className="bg-gameshow-card rounded-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-amber-500/20 rounded-lg">
                  <Zap className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Runda 2: Szybka odpowiedź</h2>
                  <p className="text-gameshow-muted">5 sekund na odpowiedź - pierwszy poprawny dostaje punkty</p>
                </div>
              </div>
              <QuickResponseTab />
            </div>
          </TabsContent>
          
          <TabsContent value="round3">
            <div className="bg-gameshow-card rounded-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Gamepad2 className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Runda 3: Koło fortuny</h2>
                  <p className="text-gameshow-muted">Koło losuje kategorię - finałowa runda o zwycięstwo</p>
                </div>
              </div>
              <WheelTab />
            </div>
          </TabsContent>
          
          <TabsContent value="cards">
            <div className="bg-gameshow-card rounded-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <CreditCard className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Karty specjalne</h2>
                  <p className="text-gameshow-muted">Zarządzanie kartami specjalnymi graczy</p>
                </div>
              </div>
              <SpecialCardsTab />
            </div>
          </TabsContent>
          
          <TabsContent value="camera">
            <div className="bg-gameshow-card rounded-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-cyan-500/20 rounded-lg">
                  <Camera className="h-6 w-6 text-cyan-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Kamery i nakładka</h2>
                  <p className="text-gameshow-muted">Konfiguracja kamer graczy i ustawienia nakładki OBS</p>
                </div>
              </div>
              <CameraOverlayTab />
            </div>
          </TabsContent>
          
          <TabsContent value="logs">
            <div className="bg-gameshow-card rounded-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gray-500/20 rounded-lg">
                  <FileText className="h-6 w-6 text-gray-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Podsumowanie i logi</h2>
                  <p className="text-gameshow-muted">Historia akcji gry i statystyki</p>
                </div>
              </div>
              <SummaryLogTab />
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

export default TabsHostPanel;
