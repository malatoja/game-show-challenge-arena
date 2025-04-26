
import React from 'react';

interface BottomBarProps {
  events: string[];
}

export function BottomBar({ events }: BottomBarProps) {
  // Convert events array into a string for marquee
  const eventsText = events.join(' • ');
  
  // If no events, provide placeholder
  const displayText = events.length > 0 
    ? eventsText 
    : 'Witamy w panelu hosta. Tutaj będą wyświetlane wydarzenia z gry.';
  
  return (
    <div className="bg-gameshow-card border-t border-gameshow-primary/30 py-2 overflow-hidden">
      <div className="flex items-center">
        <div className="bg-gameshow-primary px-3 py-1 text-white font-bold text-sm mr-3">
          WYDARZENIA
        </div>
        
        <div className="overflow-hidden flex-1">
          <div className="animate-marquee whitespace-nowrap">
            <span className="text-gameshow-text">
              {displayText}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BottomBar;
