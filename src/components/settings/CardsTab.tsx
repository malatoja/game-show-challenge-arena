
import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { CardType } from '@/types/gameTypes';
import { CARD_DETAILS, createCard } from '@/constants/gameConstants';
import { CARD_IMAGES, DEFAULT_CARD_IMAGES_PATHS, CARD_ANIMATIONS, DEFAULT_CARD_ANIMATIONS_PATHS } from '@/constants/cardImages';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

import CardRulesTab from './cards/CardRulesTab';
import CardAnimationTestTab from './cards/CardAnimationTestTab';
import AssignCardTab from './cards/AssignCardTab';
import CardImagesTab from './cards/CardImagesTab';
import CardAnimationsTab from './cards/CardAnimationsTab';

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

  const handleResetAllImages = () => {
    if (confirm('Czy na pewno chcesz przywrócić domyślne obrazy wszystkich kart?')) {
      localStorage.removeItem('customCardImages');
      toast.success('Przywrócono domyślne obrazy kart');
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  const handleResetCardImage = (cardType: CardType) => {
    try {
      const customCardImages = JSON.parse(localStorage.getItem('customCardImages') || '{}');
      
      if (customCardImages[cardType]) {
        delete customCardImages[cardType];
        localStorage.setItem('customCardImages', JSON.stringify(customCardImages));
        toast.success(`Przywrócono domyślny obraz karty ${CARD_DETAILS[cardType].name}`);
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (error) {
      console.error('Error resetting card image:', error);
      toast.error('Wystąpił błąd podczas resetowania obrazu karty');
    }
  };

  const handleResetAllAnimations = () => {
    if (confirm('Czy na pewno chcesz przywrócić domyślne animacje wszystkich kart?')) {
      localStorage.removeItem('customCardAnimations');
      toast.success('Przywrócono domyślne animacje kart');
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  const handleResetCardAnimation = (cardType: CardType) => {
    try {
      const customCardAnimations = JSON.parse(localStorage.getItem('customCardAnimations') || '{}');
      
      if (customCardAnimations[cardType]) {
        delete customCardAnimations[cardType];
        localStorage.setItem('customCardAnimations', JSON.stringify(customCardAnimations));
        toast.success(`Przywrócono domyślną animację karty ${CARD_DETAILS[cardType].name}`);
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (error) {
      console.error('Error resetting card animation:', error);
      toast.error('Wystąpił błąd podczas resetowania animacji karty');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6 text-gameshow-text">Karty Specjalne</h2>

      <Tabs defaultValue="rules">
        <TabsList>
          <TabsTrigger value="rules">Zasady przyznawania</TabsTrigger>
          <TabsTrigger value="test">Test animacji</TabsTrigger>
          <TabsTrigger value="assign">Przydziel kartę</TabsTrigger>
          <TabsTrigger value="images">Obrazy kart</TabsTrigger>
          <TabsTrigger value="animations">Animacje kart</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-6 pt-4">
          <CardRulesTab 
            cardRules={cardRules}
            handleToggleRule={handleToggleRule}
          />
        </TabsContent>

        <TabsContent value="test" className="pt-4">
          <CardAnimationTestTab 
            cardTypes={cardTypes}
            selectedCardType={selectedCardType}
            setSelectedCardType={setSelectedCardType}
          />
        </TabsContent>

        <TabsContent value="assign" className="pt-4">
          <AssignCardTab
            players={state.players}
            selectedPlayer={selectedPlayer}
            setSelectedPlayer={setSelectedPlayer}
            cardTypes={cardTypes}
            handleAwardCard={handleAwardCard}
          />
        </TabsContent>

        <TabsContent value="images" className="pt-4">
          <CardImagesTab
            cardTypes={cardTypes}
            handleResetAllImages={handleResetAllImages}
            handleResetCardImage={handleResetCardImage}
          />
        </TabsContent>

        <TabsContent value="animations" className="pt-4">
          <CardAnimationsTab
            cardTypes={cardTypes}
            handleResetAllAnimations={handleResetAllAnimations}
            handleResetCardAnimation={handleResetCardAnimation}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default CardsTab;
