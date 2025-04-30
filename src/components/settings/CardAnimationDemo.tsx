
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CardType } from '@/types/gameTypes';
import CardActivationAnimation from '../animations/CardActivationAnimation';
import { CARD_DETAILS } from '@/constants/gameConstants';
import { CARD_IMAGES } from '@/constants/cardImages';
import { toast } from 'sonner';

interface CardAnimationDemoProps {
  cardType: CardType;
}

const CardAnimationDemo: React.FC<CardAnimationDemoProps> = ({ cardType }) => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const handlePlay = () => {
    setShowAnimation(true);
  };
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      toast.error('Plik musi być obrazem (JPEG, PNG, GIF, SVG)');
      return;
    }
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Obraz nie może być większy niż 2MB');
      return;
    }
    
    setUploadingImage(true);
    
    // Read file as data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      
      try {
        // Get existing custom images
        const customCardImages = JSON.parse(localStorage.getItem('customCardImages') || '{}');
        
        // Add/update this card's image
        customCardImages[cardType] = dataUrl;
        
        // Save back to localStorage
        localStorage.setItem('customCardImages', JSON.stringify(customCardImages));
        
        toast.success('Obraz karty zaktualizowany');
        
        // Force refresh the page to update all card images
        setTimeout(() => window.location.reload(), 1000);
      } catch (error) {
        console.error('Error saving card image:', error);
        toast.error('Wystąpił błąd podczas zapisywania obrazu');
      } finally {
        setUploadingImage(false);
      }
    };
    
    reader.onerror = () => {
      toast.error('Nie udało się odczytać pliku');
      setUploadingImage(false);
    };
    
    reader.readAsDataURL(file);
  };
  
  return (
    <>
      <div className="bg-gray-800 rounded-lg h-40 flex items-center justify-center">
        <Button onClick={handlePlay} disabled={showAnimation}>
          Odtwórz animację
        </Button>
      </div>
      
      <div className="mt-4 flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Obraz karty:</span>
          <div className="flex gap-2">
            <div className="h-12 w-12 rounded-md overflow-hidden bg-gray-700 border border-gray-600">
              {CARD_IMAGES[cardType] && (
                <img 
                  src={CARD_IMAGES[cardType]} 
                  alt={CARD_DETAILS[cardType].name} 
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <label className="cursor-pointer">
              <input 
                type="file" 
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={uploadingImage}
              />
              <Button 
                variant="outline" 
                size="sm"
                disabled={uploadingImage}
                className="h-full"
              >
                {uploadingImage ? 'Wgrywanie...' : 'Zmień obraz'}
              </Button>
            </label>
          </div>
        </div>
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
