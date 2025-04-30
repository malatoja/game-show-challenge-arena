
import React from 'react';
import { EventsProvider } from './EventsContext';
import { TimerProvider } from './TimerContext';
import GameController from './GameController';

export function GameHostPanel() {
  return (
    <EventsProvider>
      <TimerProvider>
        <GameController />
      </TimerProvider>
    </EventsProvider>
  );
}

export default GameHostPanel;
