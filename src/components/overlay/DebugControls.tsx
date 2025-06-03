
import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCcw, Eye, EyeOff, Zap, Database, ZapOff } from 'lucide-react';
import { useSocket } from '@/context/SocketContext';
import { toast } from 'sonner';

interface DebugControlsProps {
  demoMode: boolean;
  connected: boolean;
  mockMode: boolean;
  onToggleDemoMode: () => void;
}

export const DebugControls: React.FC<DebugControlsProps> = ({
  demoMode,
  connected,
  mockMode,
  onToggleDemoMode
}) => {
  const { setMockMode, connect } = useSocket();
  
  // Only show in development environment
  if (!import.meta.env.DEV) return null;
  
  const handleToggleDemoMode = () => {
    // If turning demo mode off, also turn off mock mode and reconnect socket
    if (demoMode) {
      setMockMode(false);
      connect();
      toast.success('Przełączono na tryb live - łączenie z rzeczywistym serwerem');
    } else {
      setMockMode(true);
      toast.info('Przełączono na tryb demo - używanie symulowanych danych');
    }
    
    // Call the provided toggle function to update parent state
    onToggleDemoMode();
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-4 right-4 bg-black/80 backdrop-blur-sm p-4 rounded-lg border border-white/10 shadow-lg z-50"
    >
      <div className="flex flex-col gap-3">
        <div className="text-white text-xs mb-1 font-semibold">TRYB DEBUGOWANIA</div>
        
        <button 
          onClick={handleToggleDemoMode}
          className={`px-3 py-2 ${demoMode ? 'bg-red-500/80' : 'bg-green-500/80'} text-white rounded flex items-center gap-2 text-xs font-semibold transition-colors hover:opacity-90`}
        >
          {demoMode ? (
            <>
              <EyeOff size={14} />
              Demo Mode: ON
            </>
          ) : (
            <>
              <Eye size={14} />
              Demo Mode: OFF
            </>
          )}
        </button>
        
        {!demoMode && (
          <div className="flex items-center gap-2 text-white text-xs bg-black/60 p-2 rounded">
            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'} ${connected ? 'animate-pulse' : ''}`}></div>
            <span>
              Socket: {connected ? 'Connected' : 'Disconnected'} 
              {mockMode && (
                <span className="ml-1 bg-yellow-500/20 text-yellow-300 px-1 rounded text-[10px]">
                  <Database size={10} className="inline mr-1" />
                  MOCK
                </span>
              )}
            </span>
          </div>
        )}
        
        <div className="mt-2 text-gray-400 text-[10px] flex items-center gap-1">
          <RefreshCcw size={10} />
          <span>Last update: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </motion.div>
  );
};
