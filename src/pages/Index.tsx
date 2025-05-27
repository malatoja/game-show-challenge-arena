
import React, { useEffect } from 'react';
import { GameHostPanel } from '@/components/host/GameHostPanel';
import { useSupabaseGame } from '@/hooks/useSupabaseGame';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { loading, loadGameData } = useSupabaseGame();

  useEffect(() => {
    // Initialize game data when component mounts
    loadGameData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gameshow-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gameshow-primary mx-auto mb-4" />
          <p className="text-gameshow-text">Ładowanie Discord Game Show...</p>
        </div>
      </div>
    );
  }

  return <GameHostPanel />;
};

export default Index;
