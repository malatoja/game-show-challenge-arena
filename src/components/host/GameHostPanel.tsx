
import React from 'react';
import { EventsProvider } from './EventsContext';
import { TimerProvider } from './TimerContext';
import GameController from './GameController';
import GameLayout from './GameLayout';

export function GameHostPanel() {
  return (
    <EventsProvider>
      <TimerProvider>
        <GameController>
          <GameLayout />
        </GameController>
      </TimerProvider>
    </EventsProvider>
  );
}

export default GameHostPanel;
