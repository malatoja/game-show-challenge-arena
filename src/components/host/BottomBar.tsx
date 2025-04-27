
import React from 'react';

interface BottomBarProps {
  events: string[];
}

export function BottomBar({ events }: BottomBarProps) {
  const eventsText = events.join(' • ');
  const displayText = events.length > 0 
    ? eventsText 
    : 'Witamy w panelu hosta. Tutaj będą wyświetlane wydarzenia z gry.';
  
  return (
    <div className="panel-section mt-auto">
      <div className="flex items-center gap-4">
        <div className="bg-gameshow-primary px-3 py-1 rounded text-black font-bold text-sm">
          WYDARZENIA
        </div>
        
        <div className="overflow-hidden flex-1">
          <div className="animate-marquee whitespace-nowrap text-gameshow-text/90">
            {displayText}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BottomBar;
