
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardType } from '@/types/gameTypes';
import { CARD_DETAILS } from '@/constants/gameConstants';
import { CARD_ANIMATIONS, DEFAULT_CARD_ANIMATIONS_PATHS } from '@/constants/cardImages';
import { toast } from 'sonner';

interface CardAnimationsTabProps {
  cardTypes: CardType[];
  handleResetAllAnimations: () => void;
  handleResetCardAnimation: (cardType: CardType) => void;
}

export function CardAnimationsTab({
  cardTypes,
  handleResetAllAnimations,
  handleResetCardAnimation
}: CardAnimationsTabProps) {
  return (
    <div className="bg-gameshow-card rounded-lg p-6 shadow-lg">
      <h3 className="text-xl font-semibold mb-4">Zarządzanie animacjami kart</h3>
      
      <div className="mb-6">
        <p className="text-sm text-gameshow-muted mb-2">
          Tutaj możesz dostosować animacje używane dla poszczególnych kart. Wybierz kartę, aby zmienić jej animację.
        </p>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleResetAllAnimations}
          className="mt-2"
        >
          Przywróć wszystkie domyślne animacje
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cardTypes.map(cardType => {
          const isCustomAnimation = CARD_ANIMATIONS[cardType] !== DEFAULT_CARD_ANIMATIONS_PATHS[cardType];
          
          return (
            <div 
              key={cardType} 
              className={`p-4 rounded-lg border ${
                isCustomAnimation ? 'border-gameshow-primary' : 'border-gray-600'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">{CARD_DETAILS[cardType].name}</h4>
                {isCustomAnimation && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleResetCardAnimation(cardType)}
                    className="text-xs h-7 px-2"
                  >
                    Przywróć domyślną
                  </Button>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <div className="h-16 w-16 rounded-md overflow-hidden bg-gray-700 border border-gray-600 flex items-center justify-center">
                  {isCustomAnimation ? (
                    <span className="text-xs text-center">Własna<br/>animacja</span>
                  ) : (
                    <span className="text-xs text-center">Domyślna<br/>animacja</span>
                  )}
                </div>
                
                <div className="flex-1">
                  <label className="cursor-pointer">
                    <input 
                      type="file" 
                      accept="video/mp4,video/webm"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        
                        if (!file.type.startsWith('video/')) {
                          toast.error('Plik musi być wideo (MP4, WEBM)');
                          return;
                        }
                        
                        if (file.size > 5 * 1024 * 1024) {
                          toast.error('Animacja nie może być większa niż 5MB');
                          return;
                        }
                        
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          const dataUrl = e.target?.result as string;
                          
                          try {
                            const customCardAnimations = JSON.parse(localStorage.getItem('customCardAnimations') || '{}');
                            customCardAnimations[cardType] = dataUrl;
                            localStorage.setItem('customCardAnimations', JSON.stringify(customCardAnimations));
                            
                            toast.success('Animacja karty zaktualizowana');
                            setTimeout(() => window.location.reload(), 1000);
                          } catch (error) {
                            console.error('Error saving card animation:', error);
                            toast.error('Wystąpił błąd podczas zapisywania animacji');
                          }
                        };
                        
                        reader.readAsDataURL(file);
                      }}
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full"
                    >
                      Zmień animację
                    </Button>
                  </label>
                  
                  <div className="mt-2 text-xs text-gameshow-muted">
                    {isCustomAnimation ? 'Niestandardowa animacja' : 'Domyślna animacja'}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CardAnimationsTab;
