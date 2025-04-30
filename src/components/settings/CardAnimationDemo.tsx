
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CardType } from '@/types/gameTypes';
import CardActivationAnimation from '../animations/CardActivationAnimation';
import { CARD_DETAILS } from '@/constants/gameConstants';
import { CARD_IMAGES, CARD_ANIMATIONS, DEFAULT_CARD_ANIMATIONS_PATHS } from '@/constants/cardImages';
import { toast } from 'sonner';

interface CardAnimationDemoProps {
  cardType: CardType;
}

const CardAnimationDemo: React.FC<CardAnimationDemoProps> = ({ cardType }) => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingAnimation, setUploadingAnimation] = useState(false);
  
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
  
  const handleAnimationUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Check if file is a video
    if (!file.type.startsWith('video/')) {
      toast.error('Plik musi być animacją wideo (MP4, WEBM)');
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Animacja nie może być większa niż 5MB');
      return;
    }
    
    setUploadingAnimation(true);
    
    // Read file as data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      
      try {
        // Get existing custom animations
        const customCardAnimations = JSON.parse(localStorage.getItem('customCardAnimations') || '{}');
        
        // Add/update this card's animation
        customCardAnimations[cardType] = dataUrl;
        
        // Save back to localStorage
        localStorage.setItem('customCardAnimations', JSON.stringify(customCardAnimations));
        
        toast.success('Animacja karty zaktualizowana');
        
        // Force refresh the page to update all card animations
        setTimeout(() => window.location.reload(), 1000);
      } catch (error) {
        console.error('Error saving card animation:', error);
        toast.error('Wystąpił błąd podczas zapisywania animacji');
      } finally {
        setUploadingAnimation(false);
      }
    };
    
    reader.onerror = () => {
      toast.error('Nie udało się odczytać pliku');
      setUploadingAnimation(false);
    };
    
    reader.readAsDataURL(file);
  };
  
  // Check if the animation is custom (not default)
  const isCustomAnimation = CARD_ANIMATIONS[cardType] !== DEFAULT_CARD_ANIMATIONS_PATHS[cardType];
  
  const handleResetAnimation = () => {
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
        
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm font-medium">Animacja karty:</span>
          <div className="flex gap-2">
            <div className="h-12 w-12 rounded-md overflow-hidden bg-gray-700 border border-gray-600 flex items-center justify-center text-xs">
              {isCustomAnimation ? 'Własna' : 'Domyślna'}
            </div>
            <div className="flex flex-col gap-1">
              <label className="cursor-pointer">
                <input 
                  type="file" 
                  accept="video/mp4,video/webm"
                  className="hidden"
                  onChange={handleAnimationUpload}
                  disabled={uploadingAnimation}
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={uploadingAnimation}
                  className="w-full"
                >
                  {uploadingAnimation ? 'Wgrywanie...' : 'Zmień animację'}
                </Button>
              </label>
              {isCustomAnimation && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleResetAnimation}
                  className="text-xs"
                >
                  Przywróć domyślną
                </Button>
              )}
            </div>
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
