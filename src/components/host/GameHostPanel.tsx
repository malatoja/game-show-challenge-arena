
import React from 'react';
import { EventsProvider } from './EventsContext';
import { TimerProvider } from './TimerContext';
import GameController from './GameController';
import ConnectionStatus from './ConnectionStatus';

export function GameHostPanel() {
  return (
    <>
      <div className="absolute top-4 right-16 z-10">
        <ConnectionStatus />
      </div>
      <EventsProvider>
        <TimerProvider>
          <GameController />
        </TimerProvider>
      </EventsProvider>
    </>
  );
}

export default GameHostPanel;
