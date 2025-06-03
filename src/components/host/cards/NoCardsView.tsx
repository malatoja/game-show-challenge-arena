
import React from 'react';
import { Button } from '@/components/ui/button';
import { Gift, CreditCard } from 'lucide-react';

interface NoCardsViewProps {
  onOpenAwardDialog: () => void;
}

const NoCardsView: React.FC<NoCardsViewProps> = ({ onOpenAwardDialog }) => {
  return (
    <div className="py-6 border border-dashed border-gameshow-primary/20 rounded-lg text-center">
      <CreditCard className="w-10 h-10 mx-auto mb-2 opacity-40" />
      <p className="text-gameshow-muted mb-3">
        Gracz nie ma jeszcze żadnych kart
      </p>
      <Button 
        variant="outline" 
        className="border-neon-pink text-neon-pink hover:bg-neon-pink/10"
        onClick={onOpenAwardDialog}
      >
        <Gift className="h-4 w-4 mr-2" />
        Przyznaj pierwszą kartę
      </Button>
    </div>
  );
};

export default NoCardsView;
