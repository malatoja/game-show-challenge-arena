
import React from 'react';
import { GameProvider } from '@/context/GameContext';
import HostPanel from '@/components/host/HostPanel';

const HostPage = () => {
  return (
    <GameProvider>
      <HostPanel />
    </GameProvider>
  );
};

export default HostPage;
