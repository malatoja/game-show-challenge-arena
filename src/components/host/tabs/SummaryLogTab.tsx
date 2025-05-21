
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useGameHistory } from '@/components/host/context/GameHistoryContext';
import { useGame } from '@/context/GameContext';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { 
  Clock, 
  RotateCcw, 
  Trash2,
  Download,
  Filter,
  Star
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

export default function SummaryLogTab() {
  const { actions, undoLastAction, clearHistory } = useGameHistory();
  const { state } = useGame();
  const [filter, setFilter] = useState<string[]>([]);
  
  const handleExportLogs = () => {
    try {
      // Create a JSON file with action history
      const exportData = {
        timestamp: new Date().toISOString(),
        gameState: state,
        actionHistory: actions
      };
      
      const json = JSON.stringify(exportData, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create a link and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = `game-log-${format(new Date(), 'yyyy-MM-dd-HH-mm')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("Log gry został wyeksportowany");
    } catch (error) {
      console.error('Export error:', error);
      toast.error("Błąd podczas eksportowania logów");
    }
  };
  
  const handleExportCsv = () => {
    try {
      // Create CSV header
      const headers = ['Timestamp', 'Type', 'Description', 'Players'];
      
      // Map actions to CSV rows
      const rows = actions.map(action => [
        format(new Date(action.timestamp), 'yyyy-MM-dd HH:mm:ss'),
        action.type,
        action.description,
        action.playerIds.map(id => {
          const player = state.players.find(p => p.id === id);
          return player ? player.name : 'Unknown';
        }).join(', ')
      ]);
      
      // Combine headers and rows
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');
      
      // Create download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `game-log-${format(new Date(), 'yyyy-MM-dd-HH-mm')}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("Log gry został wyeksportowany jako CSV");
    } catch (error) {
      console.error('CSV export error:', error);
      toast.error("Błąd podczas eksportowania CSV");
    }
  };
  
  const handleClearHistory = () => {
    if (confirm('Czy na pewno chcesz wyczyścić całą historię akcji?')) {
      clearHistory();
    }
  };
  
  // Filter actions based on selected filter types
  const filteredActions = filter.length > 0
    ? actions.filter(action => filter.includes(action.type))
    : actions;
  
  const actionColors: Record<string, string> = {
    'ANSWER_QUESTION': 'bg-blue-500/10 border-blue-500/30',
    'USE_CARD': 'bg-purple-500/10 border-purple-500/30',
    'AWARD_CARD': 'bg-green-500/10 border-green-500/30',
    'UPDATE_POINTS': 'bg-amber-500/10 border-amber-500/30',
    'UPDATE_LIVES': 'bg-red-500/10 border-red-500/30',
    'ELIMINATE_PLAYER': 'bg-red-500/10 border-red-500/30',
    'RESTORE_PLAYER': 'bg-green-500/10 border-green-500/30',
    'RESET_PLAYERS': 'bg-gray-500/10 border-gray-500/30'
  };
  
  // Get unique action types for filter
  const actionTypes = Array.from(new Set(actions.map(action => action.type)));
  
  // Count players with lives > 0
  const activePlayers = state.players.filter(p => !p.eliminated).length;
  
  // Calculate total points
  const totalPoints = state.players.reduce((sum, player) => sum + player.points, 0);
  
  // Get top player
  const topPlayer = [...state.players].sort((a, b) => b.points - a.points)[0];
  
  // Calculate game duration (based on action timestamps)
  const gameDuration = actions.length > 0 ? 
    (Date.now() - actions[actions.length - 1].timestamp) / (1000 * 60) : 0;
  
  return (
    <div className="space-y-6">
      {/* Game Summary */}
      <Card className="bg-gameshow-card shadow-md">
        <CardContent className="p-4">
          <h3 className="text-xl font-bold mb-4">Podsumowanie gry</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gameshow-background/20 rounded p-3">
              <div className="text-sm text-gameshow-muted">Aktywnych graczy</div>
              <div className="text-2xl font-bold">{activePlayers} / {state.players.length}</div>
            </div>
            
            <div className="bg-gameshow-background/20 rounded p-3">
              <div className="text-sm text-gameshow-muted">Łącznie punktów</div>
              <div className="text-2xl font-bold">{totalPoints}</div>
            </div>
            
            <div className="bg-gameshow-background/20 rounded p-3">
              <div className="text-sm text-gameshow-muted">Najlepszy gracz</div>
              <div className="text-lg font-medium">{topPlayer?.name || "N/A"}</div>
              <div className="text-sm">{topPlayer?.points || 0} pkt</div>
            </div>
            
            <div className="bg-gameshow-background/20 rounded p-3">
              <div className="text-sm text-gameshow-muted">Czas gry</div>
              <div className="text-2xl font-bold">{Math.floor(gameDuration)} min</div>
            </div>
          </div>
          
          {/* Game Status */}
          <div className="mt-4 p-3 border rounded">
            <h4 className="font-medium mb-2">Status gry</h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gameshow-muted">Aktualna runda</div>
                <div className="font-medium">
                  {state.currentRound === 'knowledge' && 'Runda 1: Eliminacje'}
                  {state.currentRound === 'speed' && 'Runda 2: Szybka odpowiedź'}
                  {state.currentRound === 'wheel' && 'Runda 3: Koło fortuny'}
                </div>
              </div>
              <div>
                <div className="text-sm text-gameshow-muted">Status rundy</div>
                <div className="font-medium">
                  {state.roundStarted && !state.roundEnded && 'W trakcie'}
                  {!state.roundStarted && !state.roundEnded && 'Nie rozpoczęta'}
                  {state.roundEnded && 'Zakończona'}
                </div>
              </div>
              <div>
                <div className="text-sm text-gameshow-muted">Pozostało pytań</div>
                <div className="font-medium">{state.remainingQuestions.length}</div>
              </div>
            </div>
          </div>
          
          {/* Player Rankings */}
          <div className="mt-4">
            <h4 className="font-medium mb-2 flex items-center gap-1">
              <Star size={16} className="text-yellow-400" />
              Ranking graczy
            </h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pozycja</TableHead>
                  <TableHead>Gracz</TableHead>
                  <TableHead>Punkty</TableHead>
                  <TableHead>Życia</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...state.players]
                  .sort((a, b) => b.points - a.points)
                  .map((player, index) => (
                    <TableRow key={player.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: player.color || '#ff5722' }}
                          />
                          {player.name}
                        </div>
                      </TableCell>
                      <TableCell>{player.points}</TableCell>
                      <TableCell>{player.lives}</TableCell>
                      <TableCell>
                        {player.eliminated ? (
                          <span className="text-xs bg-red-500/20 text-red-500 px-2 py-1 rounded">
                            Wyeliminowany
                          </span>
                        ) : (
                          <span className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded">
                            Aktywny
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Action Log */}
      <Card className="bg-gameshow-card shadow-md">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Clock size={18} />
              Historia akcji
            </h3>
            
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter size={16} className="mr-2" />
                    Filtruj
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {actionTypes.map(type => (
                    <DropdownMenuCheckboxItem
                      key={type}
                      checked={filter.includes(type)}
                      onCheckedChange={(checked) => {
                        setFilter(prev => 
                          checked 
                            ? [...prev, type] 
                            : prev.filter(t => t !== type)
                        );
                      }}
                    >
                      {type}
                    </DropdownMenuCheckboxItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={filter.length === 0}
                    onCheckedChange={() => setFilter([])}
                  >
                    Pokaż wszystkie
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button 
                variant="outline"
                size="sm"
                onClick={handleExportLogs}
              >
                <Download size={16} className="mr-2" />
                Eksportuj JSON
              </Button>
              
              <Button 
                variant="outline"
                size="sm"
                onClick={handleExportCsv}
              >
                <Download size={16} className="mr-2" />
                Eksportuj CSV
              </Button>
            </div>
          </div>
          
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
            {filteredActions.length > 0 ? (
              filteredActions.map((action, index) => (
                <div 
                  key={action.id}
                  className={`p-3 rounded border ${actionColors[action.type] || 'border-gray-300'}`}
                >
                  <div className="flex justify-between">
                    <div className="font-medium">{action.description}</div>
                    <div className="text-xs text-gameshow-muted">
                      {format(new Date(action.timestamp), 'HH:mm:ss', { locale: pl })}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-1">
                    <div className="text-xs">
                      <span className="font-medium">Typ: </span>
                      <span className="bg-gameshow-background/50 rounded px-1">{action.type}</span>
                      
                      {action.playerIds.length > 0 && (
                        <>
                          <span className="ml-2 font-medium">Gracze: </span>
                          {action.playerIds.map(playerId => {
                            const player = state.players.find(p => p.id === playerId);
                            return player?.name || 'Unknown';
                          }).join(', ')}
                        </>
                      )}
                    </div>
                    
                    {index === 0 && action.undoable && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => undoLastAction()}
                        className="h-8 px-2"
                      >
                        <RotateCcw size={14} className="mr-1" />
                        Cofnij
                      </Button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-gameshow-muted">
                {actions.length === 0 ? 
                  "Historia akcji jest pusta" : 
                  "Brak akcji spełniających kryteria filtrowania"}
              </div>
            )}
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gameshow-muted">
              {filteredActions.length} {filteredActions.length === 1 ? 'akcja' : 'akcji'} 
              {filter.length > 0 ? ' (z filtrami)' : ''}
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleClearHistory}
              className="text-red-500 border-red-500/50 hover:bg-red-500/10"
              disabled={actions.length === 0}
            >
              <Trash2 size={14} className="mr-2" />
              Wyczyść historię
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
