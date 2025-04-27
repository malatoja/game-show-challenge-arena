
import React, { useEffect, useRef, useState } from 'react';

interface BottomBarProps {
  events: string[];
}

export function BottomBar({ events }: BottomBarProps) {
  const [showNotification, setShowNotification] = useState(false);
  const previousEventsLength = useRef(events.length);
  
  // Detect when new events are added
  useEffect(() => {
    if (events.length > previousEventsLength.current) {
      setShowNotification(true);
      
      // Hide notification after 3 seconds
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
    
    previousEventsLength.current = events.length;
  }, [events]);
  
  const eventsText = events.join(' • ');
  const displayText = events.length > 0 
    ? eventsText 
    : 'Witamy w panelu hosta. Tutaj będą wyświetlane wydarzenia z gry.';
  
  return (
    <div className="panel-section mt-auto relative overflow-hidden">
      <div className="flex items-center gap-4">
        <div className={`bg-gameshow-primary px-3 py-1 rounded text-black font-bold text-sm flex items-center ${showNotification ? 'animate-pulse' : ''}`}>
          WYDARZENIA
          {showNotification && (
            <span className="ml-2 relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          )}
        </div>
        
        <div className="overflow-hidden flex-1 max-w-full">
          <div className={`whitespace-nowrap text-gameshow-text/90 ${events.length > 0 ? 'animate-marquee' : ''}`}>
            {displayText}
          </div>
        </div>
      </div>
      
      {/* Last event popup notification */}
      {showNotification && events.length > 0 && (
        <div className="absolute top-0 right-4 transform -translate-y-full mb-2 bg-gameshow-card px-4 py-2 rounded border border-gameshow-primary shadow-lg animate-fade-in">
          <div className="text-sm font-medium">Nowe wydarzenie:</div>
          <div className="text-gameshow-primary">{events[0]}</div>
        </div>
      )}
    </div>
  );
}

export default BottomBar;
