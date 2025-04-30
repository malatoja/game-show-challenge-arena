
import React from 'react';
import { Button } from '@/components/ui/button';
import { Gift } from 'lucide-react';

interface NoCardsViewProps {
  onOpenAwardDialog: () => void;
}

export const NoCardsView: React.FC<NoCardsViewProps> = ({ onOpenAwardDialog }) => {
  return (
    <div className="text-center py-4 text-gameshow-muted">
      <p className="mb-3">Gracz nie posiada kart specjalnych</p>
      <Button 
        className="bg-neon-pink/20 hover:bg-neon-pink/30 border border-neon-pink text-neon-pink shadow-[0_0_10px_rgba(255,56,100,0.3)]"
        onClick={onOpenAwardDialog}
      >
        <Gift className="h-5 w-5 mr-2" />
        Przyznaj kartę
      </Button>
    </div>
  );
};

export default NoCardsView;
