
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CardType } from '@/types/gameTypes';
import CardActivationAnimation from '../animations/CardActivationAnimation';
import { CARD_DETAILS } from '@/constants/gameConstants';

interface CardAnimationDemoProps {
  cardType: CardType;
}

const CardAnimationDemo: React.FC<CardAnimationDemoProps> = ({ cardType }) => {
  const [showAnimation, setShowAnimation] = useState(false);
  
  const handlePlay = () => {
    setShowAnimation(true);
  };
  
  return (
    <>
      <div className="bg-gray-800 rounded-lg h-40 flex items-center justify-center">
        <Button onClick={handlePlay} disabled={showAnimation}>
          Odtwórz animację
        </Button>
      </div>
      
      <CardActivationAnimation
        cardType={cardType}
        show={showAnimation}
        playerName="Demonstracja"
        onComplete={() => setShowAnimation(false)}
      />
    </>
  );
};

export default CardAnimationDemo;
