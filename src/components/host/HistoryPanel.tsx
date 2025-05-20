
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { GameAction } from '@/types/historyTypes';
import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';
import { Undo, History, X } from 'lucide-react';

interface HistoryPanelProps {
  actions: GameAction[];
  onUndoLast: () => void;
  onClearHistory: () => void;
  onClose: () => void;
}

export function HistoryPanel({ actions, onUndoLast, onClearHistory, onClose }: HistoryPanelProps) {
  return (
    <div className="bg-gameshow-card rounded-lg border border-gameshow-primary/20 p-4 w-full max-w-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <History size={20} />
          Historia akcji
        </h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X size={18} />
        </Button>
      </div>
      
      <div className="flex items-center gap-2 mb-4">
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={onUndoLast}
          disabled={actions.length === 0}
        >
          <Undo size={16} />
          Cofnij ostatnią akcję
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onClearHistory}
          disabled={actions.length === 0}
          className="text-gameshow-muted"
        >
          Wyczyść
        </Button>
      </div>
      
      {actions.length === 0 ? (
        <div className="text-center py-8 text-gameshow-muted">
          Brak akcji w historii
        </div>
      ) : (
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-2">
            {actions.map((action) => (
              <div 
                key={action.id} 
                className="p-3 rounded-md bg-gameshow-background/50 border border-gameshow-primary/10"
              >
                <div className="flex justify-between items-start">
                  <div className="text-sm font-medium">{action.description}</div>
                  <span className="text-xs text-gameshow-muted">
                    {formatDistanceToNow(new Date(action.timestamp), { addSuffix: true, locale: pl })}
                  </span>
                </div>
                <div className="text-xs text-gameshow-muted mt-1">
                  Typ akcji: {action.type}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
