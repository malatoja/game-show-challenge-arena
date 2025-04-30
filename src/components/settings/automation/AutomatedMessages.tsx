
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

// Define a type for our automated messages
interface AutomatedMessagesData {
  roundStart: string;
  correctAnswer: string;
  cardUsage: string;
}

// Default messages to use if none are saved
const defaultMessages: AutomatedMessagesData = {
  roundStart: "Rozpoczynamy rundę {round}! Powodzenia wszystkim graczom.",
  correctAnswer: "{player} odpowiada poprawnie i zdobywa {points} punktów!",
  cardUsage: "{player} używa karty {card}! {effect}"
};

export const AutomatedMessages: React.FC = () => {
  const [messages, setMessages] = useState<AutomatedMessagesData>(defaultMessages);
  const [isSaving, setIsSaving] = useState(false);

  // Load saved messages from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('automatedMessages');
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (error) {
        console.error('Error parsing saved messages:', error);
        toast.error('Błąd podczas wczytywania zapisanych wiadomości');
      }
    }
  }, []);

  // Handle input changes
  const handleChange = (key: keyof AutomatedMessagesData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessages(prev => ({
      ...prev,
      [key]: e.target.value
    }));
  };

  // Save messages to localStorage
  const handleSave = () => {
    setIsSaving(true);
    
    try {
      localStorage.setItem('automatedMessages', JSON.stringify(messages));
      toast.success('Wiadomości zostały zapisane');
    } catch (error) {
      console.error('Error saving messages:', error);
      toast.error('Błąd podczas zapisywania wiadomości');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-gameshow-background/20 p-4 rounded-lg">
      <h3 className="text-lg font-medium mb-3">Automatyczne wiadomości</h3>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Start rundy</label>
          <Input
            placeholder="np. Rozpoczynamy rundę {round}!"
            value={messages.roundStart}
            onChange={handleChange('roundStart')}
          />
        </div>
        
        <div>
          <label className="block text-sm mb-1">Poprawna odpowiedź</label>
          <Input
            placeholder="np. {player} odpowiada poprawnie!"
            value={messages.correctAnswer}
            onChange={handleChange('correctAnswer')}
          />
        </div>
        
        <div>
          <label className="block text-sm mb-1">Użycie karty</label>
          <Input
            placeholder="np. {player} używa karty {card}!"
            value={messages.cardUsage}
            onChange={handleChange('cardUsage')}
          />
        </div>
        
        <div className="pt-3">
          <Button 
            size="sm" 
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Zapisywanie...' : 'Zapisz wiadomości'}
          </Button>
        </div>
      </div>
    </div>
  );
};
