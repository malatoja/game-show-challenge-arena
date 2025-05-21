
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGame } from '@/context/GameContext';
import { useGameHistory } from '@/components/host/context/GameHistoryContext';
import { useGameControl } from './context/GameControlContext';

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

  return (
    <div className="container mx-auto p-4 bg-gameshow-background">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-6 mb-6">
          <TabsTrigger value="round1" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Runda 1: Eliminacje
          </TabsTrigger>
          <TabsTrigger value="round2" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
            Runda 2: Szybka odpowiedź
          </TabsTrigger>
          <TabsTrigger value="round3" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            Runda 3: Koło fortuny
          </TabsTrigger>
          <TabsTrigger value="cards">
            Karty specjalne
          </TabsTrigger>
          <TabsTrigger value="camera">
            Kamery / Overlay
          </TabsTrigger>
          <TabsTrigger value="logs">
            Podsumowanie / Logi
          </TabsTrigger>
        </TabsList>

        {/* Universal Cross-Tab Controls */}
        <CrossTabControls />

        {/* Tab contents */}
        <TabsContent value="round1">
          <EliminationsTab />
        </TabsContent>
        
        <TabsContent value="round2">
          <QuickResponseTab />
        </TabsContent>
        
        <TabsContent value="round3">
          <WheelTab />
        </TabsContent>
        
        <TabsContent value="cards">
          <SpecialCardsTab />
        </TabsContent>
        
        <TabsContent value="camera">
          <CameraOverlayTab />
        </TabsContent>
        
        <TabsContent value="logs">
          <SummaryLogTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default TabsHostPanel;
