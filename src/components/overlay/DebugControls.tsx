
import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCcw, Eye, EyeOff, Zap, Database } from 'lucide-react';

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
  if (!import.meta.env.DEV) return null;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ 
        position: 'fixed', 
        bottom: '10px', 
        right: '10px', 
        backgroundColor: 'rgba(0,0,0,0.7)', 
        padding: '15px', 
        borderRadius: '8px',
        zIndex: 1000,
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
      }}
    >
      <div className="flex flex-col gap-3">
        <div className="text-white text-xs mb-1 font-semibold">TRYB DEBUGOWANIA</div>
        
        <button 
          onClick={onToggleDemoMode}
          style={{ 
            padding: '8px 12px', 
            backgroundColor: demoMode ? 'rgba(255,56,100,0.8)' : 'rgba(57,255,20,0.8)', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontWeight: 'bold',
            fontSize: '12px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
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
          <div className="flex items-center gap-2 text-white text-xs bg-black/30 p-2 rounded">
            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
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
