
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
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const roundName = ROUND_NAMES[currentRound];
  
  return (
    <div className="bg-gameshow-card/90 backdrop-blur-sm border-b border-neon-blue/30 shadow-[0_0_15px_rgba(46,156,202,0.3)]">
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Round Title */}
          <div>
            <h1 className="text-4xl font-bold animate-neon-pulse text-white">
              AKTUALNA RUNDA: {roundName}
            </h1>
          </div>
          
          {/* Timer and Controls */}
          <div className="flex items-center space-x-6">
            {/* Timer Display */}
            <div className="relative">
              <div className={`
                w-24 h-24 rounded-full flex items-center justify-center
                bg-gameshow-card border-2 border-neon-orange
                ${timer <= 5 ? 'animate-pulse' : ''}
                shadow-[0_0_15px_rgba(255,107,53,0.3)]
              `}>
                <span className="text-3xl font-bold text-neon-orange">
                  {formatTime(timer)}
                </span>
              </div>
            </div>
            
            {/* Timer Controls */}
            <div className="flex space-x-2 bg-gameshow-card/50 p-2 rounded-lg border border-neon-blue/30">
              {!isTimerRunning ? (
                <Button 
                  onClick={onStartTimer}
                  className="bg-neon-green/20 hover:bg-neon-green/30 border border-neon-green text-neon-green shadow-[0_0_10px_rgba(57,255,20,0.3)]"
                >
                  <Play className="h-5 w-5" />
                  <span className="ml-2">Start</span>
                </Button>
              ) : (
                <Button 
                  onClick={onStopTimer}
                  className="bg-neon-red/20 hover:bg-neon-red/30 border border-neon-red text-neon-red shadow-[0_0_10px_rgba(255,41,87,0.3)]"
                >
                  <Pause className="h-5 w-5" />
                  <span className="ml-2">Stop</span>
                </Button>
              )}
              
              <Button 
                onClick={onResetTimer}
                variant="outline"
                className="border-neon-blue text-neon-blue hover:bg-neon-blue/10"
              >
                <RefreshCw className="h-5 w-5" />
                <span className="ml-2">Reset</span>
              </Button>
            </div>
          </div>
          
          {/* Round Selection */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                disabled={!canStartRound}
                className="bg-neon-purple/20 hover:bg-neon-purple/30 border border-neon-purple text-white animate-glow-pulse"
              >
                Zmień Rundę <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gameshow-card/95 backdrop-blur-sm border border-neon-purple/30">
              <DropdownMenuItem 
                onClick={() => onStartRound('knowledge')}
                className="hover:bg-neon-purple/20 text-white"
              >
                1: Wiedza
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onStartRound('speed')}
                className="hover:bg-neon-purple/20 text-white"
              >
                2: Szybka Runda
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onStartRound('wheel')}
                className="hover:bg-neon-purple/20 text-white"
              >
                3: Koło Fortuny
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

export default TopBar;
