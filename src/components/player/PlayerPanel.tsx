
import React, { useState, useEffect } from 'react';
import { useSocket } from '@/context/SocketContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Gamepad2, Wifi, WifiOff, Heart, Trophy } from 'lucide-react';
import { toast } from 'sonner';

interface PlayerPanelProps {
  playerToken?: string;
}

export default function PlayerPanel({ playerToken }: PlayerPanelProps) {
  const { connected, emit, on } = useSocket();
  const [playerName, setPlayerName] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [playerData, setPlayerData] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  useEffect(() => {
    if (playerToken) {
      // Auto-join with token
      handleJoinGame();
    }

    // Listen for game events
    const unsubscribeQuestion = on('question:show', (data: any) => {
      setCurrentQuestion(data.question);
      setHasAnswered(false);
      setSelectedAnswer(null);
    });

    const unsubscribeUpdate = on('player:update', (data: any) => {
      if (data.player) {
        setPlayerData(data.player);
      }
    });

    return () => {
      unsubscribeQuestion();
      unsubscribeUpdate();
    };
  }, [playerToken, on]);

  const handleJoinGame = () => {
    if (!playerName.trim() && !playerToken) {
      toast.error('Wprowadź swoje imię');
      return;
    }

    const finalName = playerToken ? `Gracz-${playerToken.slice(0, 6)}` : playerName;
    
    emit('player:connected', {
      playerId: playerToken || Date.now().toString(),
      name: finalName
    });
    
    setIsJoined(true);
    toast.success('Dołączono do gry!');
  };

  const handleAnswer = (answerIndex: number) => {
    if (hasAnswered) return;
    
    setSelectedAnswer(answerIndex);
    setHasAnswered(true);
    
    emit('player:answer', {
      playerId: playerData?.id || playerToken || 'unknown',
      answerId: answerIndex
    });
    
    toast.success('Odpowiedź wysłana!');
  };

  if (!isJoined) {
    return (
      <div className="min-h-screen bg-gameshow-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gameshow-card border-gameshow-primary/30">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-gameshow-text">
              <Gamepad2 className="h-6 w-6 text-neon-green" />
              Dołącz do Gry
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              {connected ? (
                <Badge className="bg-green-500/20 text-green-400">
                  <Wifi className="h-3 w-3 mr-1" />
                  Połączono
                </Badge>
              ) : (
                <Badge className="bg-red-500/20 text-red-400">
                  <WifiOff className="h-3 w-3 mr-1" />
                  Rozłączono
                </Badge>
              )}
            </div>
            
            {!playerToken && (
              <Input
                placeholder="Wprowadź swoje imię"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="bg-gameshow-background border-gameshow-primary/30 text-gameshow-text"
              />
            )}
            
            <Button 
              onClick={handleJoinGame}
              disabled={!connected || (!playerName.trim() && !playerToken)}
              className="w-full bg-neon-green/20 hover:bg-neon-green/30 border border-neon-green text-neon-green"
            >
              Dołącz do Gry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gameshow-background p-4">
      <div className="container max-w-2xl mx-auto space-y-6">
        {/* Player Status */}
        <Card className="bg-gameshow-card border-gameshow-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-gameshow-text">
              <span className="flex items-center gap-2">
                <Gamepad2 className="h-5 w-5 text-neon-green" />
                {playerData?.name || playerName}
              </span>
              {connected ? (
                <Badge className="bg-green-500/20 text-green-400">
                  <Wifi className="h-3 w-3 mr-1" />
                  LIVE
                </Badge>
              ) : (
                <Badge className="bg-red-500/20 text-red-400">
                  <WifiOff className="h-3 w-3 mr-1" />
                  Offline
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Trophy className="h-4 w-4 text-neon-orange" />
                  <span className="text-gameshow-text">{playerData?.points || 0} pkt</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span className="text-gameshow-text">{playerData?.lives || 3} życia</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Question */}
        {currentQuestion && (
          <Card className="bg-gameshow-card border-gameshow-primary/30">
            <CardHeader>
              <CardTitle className="text-gameshow-text">Aktualne Pytanie</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg text-gameshow-text">{currentQuestion.text}</p>
              
              <div className="grid grid-cols-1 gap-2">
                {currentQuestion.answers?.map((answer: any, index: number) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={hasAnswered}
                    variant="outline"
                    className={`p-4 text-left justify-start h-auto ${
                      selectedAnswer === index
                        ? 'bg-neon-blue/20 border-neon-blue text-neon-blue'
                        : 'bg-gameshow-background border-gameshow-primary/30 text-gameshow-text hover:bg-gameshow-primary/10'
                    }`}
                  >
                    <span className="mr-2 font-bold">{String.fromCharCode(65 + index)}.</span>
                    {answer.text}
                  </Button>
                ))}
              </div>
              
              {hasAnswered && (
                <div className="text-center">
                  <Badge className="bg-green-500/20 text-green-400">
                    Odpowiedź wysłana!
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Waiting State */}
        {!currentQuestion && (
          <Card className="bg-gameshow-card border-gameshow-primary/30">
            <CardContent className="text-center py-8">
              <p className="text-gameshow-muted">Oczekiwanie na następne pytanie...</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
