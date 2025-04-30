
import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { Card, CardType } from '@/types/gameTypes';
import { CARD_DETAILS, createCard } from '@/constants/gameConstants';
import { CARD_IMAGES } from '@/constants/cardImages';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import CardActivationAnimation from '../animations/CardActivationAnimation';
import CardAnimationDemo from './CardAnimationDemo';
import PlayerCardIndicator from '../players/PlayerCardIndicator';
import { toast } from 'sonner';

export function CardsTab() {
  const { state, dispatch } = useGame();
  const [selectedCardType, setSelectedCardType] = useState<CardType>('dejavu');
  const [selectedPlayer, setSelectedPlayer] = useState(state.players[0]?.id || '');
  const [cardRules, setCardRules] = useState({
    consecutiveCorrect: true,
    pointsThreshold: true,
    noLifeLoss: true,
    topPoints: true,
    advanceRound: true,
    lowestPoints: true,
    lowestLives: true
  });

  const cardTypes = Object.keys(CARD_DETAILS) as CardType[];

  const handleToggleRule = (rule: keyof typeof cardRules) => {
    setCardRules(prev => ({
      ...prev,
      [rule]: !prev[rule]
    }));
  };

  const handleAwardCard = (playerId: string, cardType: CardType) => {
    if (!playerId) {
      toast.error("Wybierz gracza");
      return;
    }

    dispatch({
      type: 'AWARD_CARD',
      playerId,
      cardType
    });

    toast.success(`Karta ${CARD_DETAILS[cardType].name} przyznana!`);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6 text-gameshow-text">Karty Specjalne</h2>

      <Tabs defaultValue="rules">
        <TabsList>
          <TabsTrigger value="rules">Zasady przyznawania</TabsTrigger>
          <TabsTrigger value="test">Test animacji</TabsTrigger>
          <TabsTrigger value="assign">Przydziel kartę</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-6 pt-4">
          <div className="bg-gameshow-card rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Automatyczne przyznawanie kart</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="rule-consecutive" className="font-medium">3 poprawne odpowiedzi z rzędu</Label>
                  <p className="text-sm text-gameshow-muted">Karta: Déjà Vu</p>
                </div>
                <Switch
                  id="rule-consecutive"
                  checked={cardRules.consecutiveCorrect}
                  onCheckedChange={() => handleToggleRule('consecutiveCorrect')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="rule-points" className="font-medium">50+ punktów w Rundzie 1</Label>
                  <p className="text-sm text-gameshow-muted">Karta: Turbo</p>
                </div>
                <Switch
                  id="rule-points"
                  checked={cardRules.pointsThreshold}
                  onCheckedChange={() => handleToggleRule('pointsThreshold')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="rule-lives" className="font-medium">Runda bez utraty życia</Label>
                  <p className="text-sm text-gameshow-muted">Karta: Na Ratunek</p>
                </div>
                <Switch
                  id="rule-lives"
                  checked={cardRules.noLifeLoss}
                  onCheckedChange={() => handleToggleRule('noLifeLoss')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="rule-top" className="font-medium">Najwięcej punktów w Rundzie 1</Label>
                  <p className="text-sm text-gameshow-muted">Karta: Refleks x2</p>
                </div>
                <Switch
                  id="rule-top"
                  checked={cardRules.topPoints}
                  onCheckedChange={() => handleToggleRule('topPoints')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="rule-advance" className="font-medium">Awans z rundy</Label>
                  <p className="text-sm text-gameshow-muted">Karta: Kontra</p>
                </div>
                <Switch
                  id="rule-advance"
                  checked={cardRules.advanceRound}
                  onCheckedChange={() => handleToggleRule('advanceRound')}
                />
              </div>
            </div>
          </div>

          <div className="bg-gameshow-card rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Karty "Na Ratunek"</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="rule-lowest-points" className="font-medium">Po R1 - gracz z najmniejszą liczbą punktów</Label>
                </div>
                <Switch
                  id="rule-lowest-points"
                  checked={cardRules.lowestPoints}
                  onCheckedChange={() => handleToggleRule('lowestPoints')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="rule-lowest-lives" className="font-medium">Na start R3 - gracz z najmniejszą liczbą żyć</Label>
                </div>
                <Switch
                  id="rule-lowest-lives"
                  checked={cardRules.lowestLives}
                  onCheckedChange={() => handleToggleRule('lowestLives')}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="test" className="pt-4">
          <div className="bg-gameshow-card rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Test animacji kart</h3>
            <div className="space-y-4">
              <Label className="font-medium">Wybierz kartę do przetestowania</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {cardTypes.map(type => (
                  <Button
                    key={type}
                    variant={selectedCardType === type ? "default" : "outline"}
                    className={`flex items-center gap-2 ${selectedCardType === type ? 'bg-gameshow-primary' : 'bg-gameshow-card'}`}
                    onClick={() => setSelectedCardType(type)}
                  >
                    <div className="w-6 h-6 relative">
                      {CARD_IMAGES[type] && (
                        <img
                          src={CARD_IMAGES[type]}
                          alt={CARD_DETAILS[type].name}
                          className="w-full h-full object-cover rounded-full"
                        />
                      )}
                    </div>
                    <span>{CARD_DETAILS[type].name}</span>
                  </Button>
                ))}
              </div>

              <div className="mt-6">
                <Label className="font-medium mb-2 block">Podgląd animacji</Label>
                <CardAnimationDemo cardType={selectedCardType} />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="assign" className="pt-4">
          <div className="bg-gameshow-card rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Przydziel kartę graczowi</h3>
            <div className="space-y-4">
              <div>
                <Label className="font-medium mb-2 block">Wybierz gracza</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {state.players.map(player => (
                    <Button
                      key={player.id}
                      variant={selectedPlayer === player.id ? "default" : "outline"}
                      className={`${selectedPlayer === player.id ? 'bg-gameshow-primary' : 'bg-gameshow-card'}`}
                      onClick={() => setSelectedPlayer(player.id)}
                    >
                      {player.name}
                    </Button>
                  ))}
                  
                  {state.players.length === 0 && (
                    <p className="text-gameshow-muted col-span-full text-center py-2">
                      Brak graczy. Dodaj graczy w zakładce "Gracze"
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label className="font-medium mb-2 block">Wybierz kartę</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {cardTypes.map(type => (
                    <Button
                      key={type}
                      variant="outline"
                      className="bg-gameshow-card flex items-center gap-2"
                      onClick={() => handleAwardCard(selectedPlayer, type)}
                      disabled={!selectedPlayer}
                    >
                      <div className="w-6 h-6 relative">
                        {CARD_IMAGES[type] && (
                          <img
                            src={CARD_IMAGES[type]}
                            alt={CARD_DETAILS[type].name}
                            className="w-full h-full object-cover rounded-full"
                          />
                        )}
                      </div>
                      <span className="truncate">{CARD_DETAILS[type].name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {selectedPlayer && (
                <div>
                  <Label className="font-medium mb-2 block">Karty gracza</Label>
                  <div className="bg-gameshow-background p-3 rounded-lg flex flex-wrap gap-2">
                    {state.players
                      .find(p => p.id === selectedPlayer)
                      ?.cards.map(card => (
                        <div key={card.id} className="flex items-center gap-1">
                          <PlayerCardIndicator card={card} />
                        </div>
                      ))}
                    
                    {(!state.players.find(p => p.id === selectedPlayer)?.cards.length) && (
                      <p className="text-gameshow-muted text-sm">Gracz nie posiada żadnych kart</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default CardsTab;
