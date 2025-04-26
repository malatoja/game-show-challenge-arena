
import React from 'react';
import { GameProvider } from '@/context/GameContext';
import GameHostPanel from '@/components/host/GameHostPanel';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const HostPage = () => {
  return (
    <GameProvider>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        <div className="absolute top-4 right-4 z-10">
          <Button asChild variant="outline">
            <Link to="/settings" className="flex items-center gap-2">
              <Settings size={16} />
              Ustawienia
            </Link>
          </Button>
        </div>
        <GameHostPanel />
      </motion.div>
    </GameProvider>
  );
};

export default HostPage;
