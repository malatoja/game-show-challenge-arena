
import React from 'react';
import { Button } from '@/components/ui/button';
import { RoundType } from '@/types/gameTypes';
import { ROUND_NAMES } from '@/constants/gameConstants';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Play, Pause, RefreshCw, ChevronDown } from 'lucide-react';

interface TopBarProps {
  currentRound: RoundType;
  timer: number;
  isTimerRunning: boolean;
  canStartRound: boolean;
  onStartRound: (roundType: RoundType) => void;
  onStartTimer: () => void;
  onStopTimer: () => void;
  onResetTimer: () => void;
}

export function TopBar({
  currentRound,
  timer,
  isTimerRunning,
  canStartRound,
  onStartRound,
  onStartTimer,
  onStopTimer,
  onResetTimer
}: TopBarProps) {
  // Format timer display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Get round name from constants
  const roundName = ROUND_NAMES[currentRound];
  
  return (
    <div className="bg-gameshow-card p-4 border-b-2 border-gameshow-primary/30 shadow-lg">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 items-center justify-between">
          {/* Current Round Display */}
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gameshow-primary to-gameshow-accent bg-clip-text text-transparent animate-pulse-glow">
              AKTUALNA RUNDA: {roundName}
            </h1>
          </div>
          
          {/* Timer Controls */}
          <div className="flex items-center space-x-4">
            <div className="bg-gameshow-primary/20 px-6 py-3 rounded-lg shadow-inner text-center min-w-32">
              <div className="text-3xl font-bold text-gameshow-text animate-float">
                {formatTime(timer)}
              </div>
              <div className="text-xs text-gameshow-muted">
                {currentRound === 'speed' ? 'SZYBKA RUNDA' : 
                 currentRound === 'wheel' ? 'KOŁO FORTUNY' : 'WIEDZA'}
              </div>
            </div>
            
            <div className="flex space-x-2">
              {!isTimerRunning ? (
                <Button 
                  onClick={onStartTimer}
                  variant="default"
                  size="lg"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Play className="mr-1" /> Start
                </Button>
              ) : (
                <Button 
                  onClick={onStopTimer}
                  variant="default"
                  size="lg"
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Pause className="mr-1" /> Stop
                </Button>
              )}
              
              <Button 
                onClick={onResetTimer}
                variant="outline"
                size="lg"
                className="bg-gameshow-accent/10 border-gameshow-accent/30 text-gameshow-accent hover:bg-gameshow-accent/20"
              >
                <RefreshCw className="mr-1" /> Reset
              </Button>
            </div>
          </div>
          
          {/* Round Selection */}
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="bg-gameshow-primary/10 border-gameshow-primary/30 hover:bg-gameshow-primary/20"
                  disabled={!canStartRound}
                >
                  Zmień Rundę <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onStartRound('knowledge')}>
                  1: Wiedza
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStartRound('speed')}>
                  2: Szybka Runda
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStartRound('wheel')}>
                  3: Koło Fortuny
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopBar;
