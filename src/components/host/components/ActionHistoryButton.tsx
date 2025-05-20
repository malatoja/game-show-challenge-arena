
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { History } from 'lucide-react';
import { HistoryPanel } from '../HistoryPanel';
import { useGameHistory } from '@/hooks/useGameHistory';

export function ActionHistoryButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { actions, undoLastAction, clearHistory, hasActions } = useGameHistory();

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="flex items-center gap-2"
        size="sm"
      >
        <History size={16} />
        Historia akcji {hasActions && <span className="rounded-full bg-red-500 w-2 h-2"></span>}
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <HistoryPanel 
            actions={actions}
            onUndoLast={undoLastAction}
            onClearHistory={clearHistory}
            onClose={() => setIsOpen(false)}
          />
        </div>
      )}
    </>
  );
}
