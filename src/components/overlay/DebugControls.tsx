
import React from 'react';

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
    <div style={{ 
      position: 'fixed', 
      bottom: '10px', 
      right: '10px', 
      backgroundColor: 'rgba(0,0,0,0.7)', 
      padding: '10px', 
      borderRadius: '5px',
      zIndex: 1000
    }}>
      <div className="flex flex-col gap-2">
        <button 
          onClick={onToggleDemoMode}
          style={{ 
            padding: '5px 10px', 
            backgroundColor: demoMode ? '#FF3864' : '#39FF14', 
            color: 'white', 
            border: 'none', 
            borderRadius: '3px', 
            cursor: 'pointer' 
          }}
        >
          {demoMode ? 'Demo Mode: ON' : 'Demo Mode: OFF'}
        </button>
        
        {!demoMode && (
          <div className="text-white text-xs">
            Socket: {connected ? 'Connected' : 'Disconnected'} 
            {mockMode && ' (Mock)'}
          </div>
        )}
      </div>
    </div>
  );
};
