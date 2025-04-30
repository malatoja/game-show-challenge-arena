
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardType } from '@/types/gameTypes';
import { CARD_DETAILS } from '@/constants/gameConstants';
import { CARD_IMAGES, DEFAULT_CARD_IMAGES_PATHS } from '@/constants/cardImages';
import { toast } from 'sonner';

interface CardImagesTabProps {
  cardTypes: CardType[];
  handleResetAllImages: () => void;
  handleResetCardImage: (cardType: CardType) => void;
}

export function CardImagesTab({
  cardTypes,
  handleResetAllImages,
  handleResetCardImage
}: CardImagesTabProps) {
  return (
    <div className="bg-gameshow-card rounded-lg p-6 shadow-lg">
      <h3 className="text-xl font-semibold mb-4">Zarządzanie obrazami kart</h3>
      
      <div className="mb-6">
        <p className="text-sm text-gameshow-muted mb-2">
          Tutaj możesz dostosować obrazy używane dla poszczególnych kart. Wybierz kartę, aby zmienić jej obraz.
        </p>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleResetAllImages}
          className="mt-2"
        >
          Przywróć wszystkie domyślne obrazy
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cardTypes.map(cardType => {
          const isCustomImage = CARD_IMAGES[cardType] !== DEFAULT_CARD_IMAGES_PATHS[cardType];
          
          return (
            <div 
              key={cardType} 
              className={`p-4 rounded-lg border ${
                isCustomImage ? 'border-gameshow-primary' : 'border-gray-600'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">{CARD_DETAILS[cardType].name}</h4>
                {isCustomImage && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleResetCardImage(cardType)}
                    className="text-xs h-7 px-2"
                  >
                    Przywróć domyślny
                  </Button>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <div className="h-16 w-16 rounded-md overflow-hidden bg-gray-700 border border-gray-600">
                  {CARD_IMAGES[cardType] && (
                    <img 
                      src={CARD_IMAGES[cardType]} 
                      alt={CARD_DETAILS[cardType].name} 
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                
                <div className="flex-1">
                  <label className="cursor-pointer">
                    <input 
                      type="file" 
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        
                        if (!file.type.startsWith('image/')) {
                          toast.error('Plik musi być obrazem');
                          return;
                        }
                        
                        if (file.size > 2 * 1024 * 1024) {
                          toast.error('Obraz nie może być większy niż 2MB');
                          return;
                        }
                        
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          const dataUrl = e.target?.result as string;
                          
                          try {
                            const customCardImages = JSON.parse(localStorage.getItem('customCardImages') || '{}');
                            customCardImages[cardType] = dataUrl;
                            localStorage.setItem('customCardImages', JSON.stringify(customCardImages));
                            
                            toast.success('Obraz karty zaktualizowany');
                            setTimeout(() => window.location.reload(), 1000);
                          } catch (error) {
                            console.error('Error saving card image:', error);
                            toast.error('Wystąpił błąd podczas zapisywania obrazu');
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
                      Zmień obraz
                    </Button>
                  </label>
                  
                  <div className="mt-2 text-xs text-gameshow-muted">
                    {isCustomImage ? 'Niestandardowy obraz' : 'Domyślny obraz'}
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

export default CardImagesTab;
