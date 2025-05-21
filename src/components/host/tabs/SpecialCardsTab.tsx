
import React, { useState } from 'react';
import { Card, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { useGame } from '@/context/GameContext';
import { useGameControl } from '../context/GameControlContext';
import { CardType, Player } from '@/types/gameTypes';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Clock, Gift, History } from 'lucide-react';
import { toast } from 'sonner';
import { useGameHistory } from '@/components/host/context/GameHistoryContext';
import { formatDistance } from 'date-fns';
import { pl } from 'date-fns/locale';

// Card type definitions with descriptions and effects
const cardDetails: Record<CardType, { name: string, description: string, effect: string }> = {
  'dejavu': { 
    name: 'Déjà Vu', 
    description: 'Pozwala na powtórzenie pytania po złej odpowiedzi', 
    effect: 'Gracz dostaje szansę odpowiedzieć ponownie na to samo pytanie.' 
  },
  'kontra': { 
    name: 'Kontra', 
    description: 'Przekazuje pytanie innemu graczowi', 
    effect: 'Pytanie zostaje przekazane wybranemu przeciwnikowi.' 
  },
  'reanimacja': { 
    name: 'Reanimacja', 
    description: 'Zapobiega utracie życia w Rundzie 2', 
    effect: 'Gracz nie traci życia przy błędnej odpowiedzi.' 
  },
  'skip': { 
    name: 'Skip', 
    description: 'Pomija aktualne pytanie', 
    effect: 'Pytanie zostaje pominięte bez kary.' 
  },
  'turbo': { 
    name: 'Turbo', 
    description: 'Podwaja zdobyte punkty', 
    effect: 'Punkty za poprawną odpowiedź zostają podwojone.' 
  },
  'refleks2': { 
    name: 'Refleks x2', 
    description: 'Podwaja czas na odpowiedź', 
    effect: 'Czas na odpowiedź zostaje podwojony.' 
  },
  'refleks3': { 
    name: 'Refleks x3', 
    description: 'Potraja czas na odpowiedź', 
    effect: 'Czas na odpowiedź zostaje potrojony.' 
  },
  'lustro': { 
    name: 'Lustro', 
    description: 'Usuwa jedną błędną odpowiedź', 
    effect: 'Jedna niepoprawna odpowiedź zostaje usunięta z opcji.' 
  },
  'oswiecenie': { 
    name: 'Oświecenie', 
    description: 'Daje wskazówkę do pytania', 
    effect: 'Gracz otrzymuje dodatkową wskazówkę.' 
  }
};

export default function SpecialCardsTab() {
  const { state } = useGame();
  const { handleUseCard } = useGameControl();
  const { actions } = useGameHistory();
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isCardDialogOpen, setIsCardDialogOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  
  // Filter actions to only show card-related actions
  const cardActions = actions.filter(action => 
    action.type === 'USE_CARD' || action.type === 'AWARD_CARD'
  );
  
  const handleSelectPlayer = (player: Player) => {
    setSelectedPlayer(player);
  };
  
  const handleAwardCard = (player: Player, cardType: CardType) => {
    // This would call a method to award a card to a player
    // For now we'll just show a toast
    toast.success(`Przyznano kartę ${cardDetails[cardType].name} dla gracza ${player.name}`);
    setIsCardDialogOpen(false);
  };
  
  const handleActivateCard = (playerId: string, cardType: CardType) => {
    handleUseCard(playerId, cardType);
    toast.success(`Aktywowano kartę ${cardDetails[cardType].name}`);
  };
  
  const getCardColorClass = (cardType: CardType) => {
    switch (cardType) {
      case 'dejavu':
      case 'refleks2':
      case 'refleks3':
        return 'bg-blue-500/20 border-blue-500';
      case 'kontra':
      case 'lustro':
        return 'bg-purple-500/20 border-purple-500';
      case 'reanimacja':
        return 'bg-green-500/20 border-green-500';
      case 'skip':
        return 'bg-red-500/20 border-red-500';
      case 'turbo':
        return 'bg-amber-500/20 border-amber-500';
      case 'oswiecenie':
        return 'bg-cyan-500/20 border-cyan-500';
      default:
        return 'bg-gray-500/20 border-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Players and their cards */}
      <Card className="bg-gameshow-card shadow-md">
        <CardContent className="p-4">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <CreditCard size={18} />
            Karty graczy
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {state.players.map(player => (
              <div 
                key={player.id}
                className="border rounded-lg p-4 hover:bg-gameshow-primary/5 transition-colors cursor-pointer"
                onClick={() => handleSelectPlayer(player)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: player.color || '#ff5722' }}
                    />
                    <span className="font-medium">{player.name}</span>
                  </div>
                  <Badge variant="outline">
                    {player.eliminated ? 'Wyeliminowany' : 'Aktywny'}
                  </Badge>
                </div>
                
                {player.cards.length > 0 ? (
                  <div className="space-y-2">
                    {player.cards.map((card, idx) => (
                      <div 
                        key={idx} 
                        className={`flex justify-between items-center p-2 rounded border ${
                          card.isUsed ? 'opacity-50' : getCardColorClass(card.type)
                        }`}
                      >
                        <div>
                          <div className="font-medium">{cardDetails[card.type].name}</div>
                          <div className="text-xs">{cardDetails[card.type].description}</div>
                        </div>
                        {!card.isUsed && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleActivateCard(player.id, card.type);
                            }}
                          >
                            Aktywuj
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gameshow-muted">
                    Brak kart
                  </div>
                )}
                
                <div className="mt-3">
                  <Dialog open={isCardDialogOpen && selectedPlayer?.id === player.id} onOpenChange={(open) => {
                    setIsCardDialogOpen(open);
                    if (!open) setSelectedCard(null);
                  }}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPlayer(player);
                          setIsCardDialogOpen(true);
                        }}
                      >
                        <Gift size={16} className="mr-2" />
                        Przyznaj kartę
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          Przyznaj kartę dla gracza {player.name}
                        </DialogTitle>
                        <DialogDescription>
                          Wybierz kartę, aby przyznać ją graczowi.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        {Object.entries(cardDetails).map(([type, details]) => (
                          <div
                            key={type}
                            className={`border rounded p-3 cursor-pointer transition-colors ${
                              selectedCard === type ? 
                              getCardColorClass(type as CardType) : 
                              'hover:bg-gameshow-primary/5'
                            }`}
                            onClick={() => setSelectedCard(type as CardType)}
                          >
                            <div className="font-bold mb-1">{details.name}</div>
                            <div className="text-xs">{details.description}</div>
                          </div>
                        ))}
                      </div>
                      
                      <DialogFooter>
                        <Button 
                          onClick={() => selectedCard && handleAwardCard(player, selectedCard)}
                          disabled={!selectedCard}
                        >
                          Przyznaj
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Card history log */}
      <Card className="bg-gameshow-card shadow-md">
        <CardContent className="p-4">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <History size={18} />
            Historia użycia kart
          </h3>
          
          {cardActions.length > 0 ? (
            <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
              {cardActions.map(action => {
                const player = state.players.find(p => p.id === action.playerIds[0]);
                const cardType = action.data?.cardType;
                const timeAgo = formatDistance(new Date(action.timestamp), new Date(), { 
                  addSuffix: true,
                  locale: pl 
                });
                
                return (
                  <div 
                    key={action.id}
                    className={`p-3 rounded border ${
                      action.type === 'USE_CARD' 
                        ? 'bg-blue-500/10 border-blue-500/30'
                        : 'bg-green-500/10 border-green-500/30'
                    }`}
                  >
                    <div className="flex justify-between">
                      <div className="font-medium">
                        {player?.name || 'Nieznany gracz'} 
                        {action.type === 'USE_CARD' ? ' użył karty ' : ' otrzymał kartę '}
                        {cardType && cardDetails[cardType as CardType]?.name}
                      </div>
                      <div className="text-xs text-gameshow-muted">
                        {timeAgo}
                      </div>
                    </div>
                    <div className="text-sm mt-1">
                      {action.description}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gameshow-muted">
              Brak historii użycia kart
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Card rules */}
      <Card className="bg-gameshow-card shadow-md">
        <CardContent className="p-4">
          <h3 className="text-xl font-bold mb-4">Zasady przyznawania kart</h3>
          <CardDescription className="mb-4">
            Karty mogą być przyznawane graczom automatycznie przy spełnieniu określonych warunków 
            lub ręcznie przez hosta.
          </CardDescription>
          
          <div className="space-y-4">
            <div className="p-3 border rounded">
              <h4 className="font-medium">Automatyczne przyznawanie</h4>
              <ul className="list-disc list-inside space-y-1 text-sm mt-2">
                <li>Za 3 poprawne odpowiedzi z rzędu</li>
                <li>Dla najlepszego gracza po każdej rundzie</li>
                <li>Dla gracza z najmniejszą liczbą punktów jako wsparcie</li>
                <li>Po eliminacji, jako szansa powrotu</li>
              </ul>
            </div>
            
            <div className="p-3 border rounded">
              <h4 className="font-medium">Ręczne przyznawanie</h4>
              <div className="text-sm mt-2">
                Host może przyznać kartę w dowolnym momencie gry, klikając przycisk "Przyznaj kartę"
                przy wybranym graczu.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
