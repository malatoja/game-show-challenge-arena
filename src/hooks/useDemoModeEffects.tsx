
import { useEffect } from 'react';
import { Player, Question } from '@/types/gameTypes';

interface UseDemoModeEffectsProps {
  demoMode: boolean;
  setCurrentTime: (time: number) => void;
  setTimerPulsing: (pulsing: boolean) => void;
  setPlayers: (players: Player[]) => void;
  setSelectedCategory: (category: string) => void;
  setSelectedDifficulty: (difficulty: number) => void;
  setShowCategoryTable: (show: boolean) => void;
  setQuestion: (question: Question | null) => void;
  categories: string[];
  difficulties: number[];
}

export const useDemoModeEffects = (
  demoMode: boolean,
  setCurrentTime: (time: number) => void,
  setTimerPulsing: (pulsing: boolean) => void,
  setPlayers: (players: Player[]) => void,
  setSelectedCategory: (category: string) => void,
  setSelectedDifficulty: (difficulty: number) => void,
  setShowCategoryTable: (show: boolean) => void,
  setQuestion: (question: Question | null) => void,
  categories: string[],
  difficulties: number[]
) => {
  useEffect(() => {
    if (!demoMode) return;

    // Demo players
    const demoPlayers: Player[] = [
      {
        id: '1',
        name: 'Gracz1',
        lives: 3,
        points: 45,
        cards: [],
        isActive: true,
        eliminated: false,
        color: '#FF6B6B'
      },
      {
        id: '2',
        name: 'Gracz2',
        lives: 2,
        points: 30,
        cards: [],
        isActive: false,
        eliminated: false,
        color: '#4ECDC4'
      },
      {
        id: '3',
        name: 'Gracz3',
        lives: 3,
        points: 60,
        cards: [],
        isActive: false,
        eliminated: false,
        color: '#45B7D1'
      }
    ];

    // Demo question
    const demoQuestion: Question = {
      id: 'demo-1',
      text: 'Jak nazywa się najpopularniejszy mem z kotkiem, który stał się symbolem internetu?',
      category: 'MEMY',
      answers: [
        { text: 'Grumpy Cat', isCorrect: false },
        { text: 'Keyboard Cat', isCorrect: false },
        { text: 'Nyan Cat', isCorrect: true },
        { text: 'LOL Cat', isCorrect: false }
      ],
      correctAnswerIndex: 2,
      round: 'knowledge',
      difficulty: 'medium',
      points: 15
    };

    setPlayers(demoPlayers);
    setSelectedCategory(categories[0] || 'MEMY');
    setSelectedDifficulty(difficulties[1] || 10);
    
    // Simulate a timer countdown
    let timeLeft = 30;
    const timer = setInterval(() => {
      setCurrentTime(timeLeft);
      if (timeLeft <= 5) {
        setTimerPulsing(true);
      }
      timeLeft--;
      if (timeLeft < 0) {
        clearInterval(timer);
        setTimerPulsing(false);
        // Show demo question after timer ends
        setQuestion(demoQuestion);
        setShowCategoryTable(false);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [demoMode, setCurrentTime, setTimerPulsing, setPlayers, setSelectedCategory, setSelectedDifficulty, setShowCategoryTable, setQuestion, categories, difficulties]);
};
