
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useGame } from '@/context/GameContext';

// Import tab components
import EliminationsTab from './tabs/EliminationsTab';
import QuickResponseTab from './tabs/QuickResponseTab';
import WheelTab from './tabs/WheelTab';
import SpecialCardsTab from './tabs/SpecialCardsTab';
import CameraOverlayTab from './tabs/CameraOverlayTab';
import SummaryLogTab from './tabs/SummaryLogTab';

import { 
  Users, 
  Zap, 
  Target, 
  Gamepad2, 
  Camera, 
  ScrollText,
  Clock,
  Trophy
} from 'lucide-react';

const TabsHostPanel = () => {
  const { state } = useGame();
  const [activeTab, setActiveTab] = useState('eliminations');

  const getTabBadge = (tabId: string) => {
    switch (tabId) {
      case 'eliminations':
        return state.currentRound === 'knowledge' && state.roundStarted ? (
          <Badge className="bg-blue-500/20 text-blue-400 ml-2">AKTYWNA</Badge>
        ) : null;
      case 'quick-response':
        return state.currentRound === 'speed' && state.roundStarted ? (
          <Badge className="bg-amber-500/20 text-amber-400 ml-2">AKTYWNA</Badge>
        ) : null;
      case 'wheel':
        return state.currentRound === 'wheel' && state.roundStarted ? (
          <Badge className="bg-purple-500/20 text-purple-400 ml-2">AKTYWNA</Badge>
        ) : null;
      case 'cards':
        const totalCards = state.players.reduce((sum, player) => sum + player.cards.length, 0);
        return totalCards > 0 ? (
          <Badge variant="secondary" className="ml-2">{totalCards}</Badge>
        ) : null;
      default:
        return null;
    }
  };

  const tabs = [
    {
      id: 'eliminations',
      label: 'Eliminacje',
      icon: Target,
      color: 'text-blue-400',
      component: EliminationsTab
    },
    {
      id: 'quick-response',
      label: 'Szybka odpowiedź',
      icon: Clock,
      color: 'text-amber-400',
      component: QuickResponseTab
    },
    {
      id: 'wheel',
      label: 'Koło fortuny',
      icon: Trophy,
      color: 'text-purple-400',
      component: WheelTab
    },
    {
      id: 'cards',
      label: 'Karty specjalne',
      icon: Zap,
      color: 'text-green-400',
      component: SpecialCardsTab
    },
    {
      id: 'cameras',
      label: 'Kamery i nakładka',
      icon: Camera,
      color: 'text-cyan-400',
      component: CameraOverlayTab
    },
    {
      id: 'summary',
      label: 'Podsumowanie',
      icon: ScrollText,
      color: 'text-gray-400',
      component: SummaryLogTab
    }
  ];

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-gameshow-card/50 border border-gameshow-accent/20">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <TabsTrigger 
                key={tab.id}
                value={tab.id} 
                className="flex items-center gap-2 data-[state=active]:bg-gameshow-primary/20 data-[state=active]:text-gameshow-primary"
              >
                <IconComponent className={`h-4 w-4 ${tab.color}`} />
                <span className="hidden sm:inline">{tab.label}</span>
                {getTabBadge(tab.id)}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {tabs.map((tab) => {
          const ComponentToRender = tab.component;
          return (
            <TabsContent key={tab.id} value={tab.id} className="mt-6">
              <ComponentToRender />
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};

export default TabsHostPanel;
