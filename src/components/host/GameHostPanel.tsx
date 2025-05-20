
import React from 'react';
import { EventsProvider } from './EventsContext';
import { TimerProvider } from './TimerContext';
import { GameHistoryProvider } from './context/GameHistoryContext';
import GameController from './GameController';
import ConnectionStatus from './ConnectionStatus';

export function GameHostPanel() {
  return (
    <>
      <div className="absolute top-4 right-4 z-10">
        <ConnectionStatus />
      </div>
      <GameHistoryProvider>
        <EventsProvider>
          <TimerProvider>
            <GameController />
          </TimerProvider>
        </EventsProvider>
      </GameHistoryProvider>
    </>
  );
}

export default GameHostPanel;
