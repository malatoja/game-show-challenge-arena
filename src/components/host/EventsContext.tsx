
import React, { createContext, useContext, useState } from 'react';

type EventsContextType = {
  events: string[];
  addEvent: (event: string) => void;
};

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export function EventsProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<string[]>([]);

  const addEvent = (event: string) => {
    setEvents(prev => [event, ...prev].slice(0, 10)); // Keep last 10 events
    // Log to console for reference
    console.log(`[Event]: ${event}`);
  };

  return (
    <EventsContext.Provider value={{ events, addEvent }}>
      {children}
    </EventsContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventsContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventsProvider');
  }
  return context;
}
