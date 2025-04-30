
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { CardType } from '@/types/gameTypes';
import { CARD_DETAILS } from '@/constants/gameConstants';
import { CARD_IMAGES } from '@/constants/cardImages';
import CardAnimationDemo from '../CardAnimationDemo';

interface CardAnimationTestTabProps {
  cardTypes: CardType[];
  selectedCardType: CardType;
  setSelectedCardType: (type: CardType) => void;
}

export function CardAnimationTestTab({
  cardTypes,
  selectedCardType,
  setSelectedCardType
}: CardAnimationTestTabProps) {
  return (
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
  );
}

export default CardAnimationTestTab;
