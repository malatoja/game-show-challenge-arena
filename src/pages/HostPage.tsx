
import React from 'react';
import { GameProvider } from '@/context/GameContext';
import HostPanel from '@/components/host/HostPanel';
import { motion } from 'framer-motion';

const HostPage = () => {
  return (
    <GameProvider>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <HostPanel />
      </motion.div>
    </GameProvider>
  );
};

export default HostPage;
