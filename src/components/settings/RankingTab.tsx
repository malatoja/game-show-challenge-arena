
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useGame } from '@/context/GameContext';
import { toast } from 'sonner';

export const RankingTab = () => {
  const { state } = useGame();
  const [activeEdition, setActiveEdition] = useState('current');
  
  // Mock data for previous editions
  const editions = [
    { id: 'current', name: 'Bieżąca edycja' },
    { id: 'edition-1', name: 'Quiz Show #1' },
    { id: 'edition-2', name: 'Quiz Show #2' }
  ];
  
  // Sort players by points (highest first)
  const sortedPlayers = [...state.players].sort((a, b) => b.points - a.points);
  
  const handleExportPDF = () => {
    // In a real implementation, this would generate a PDF
    toast.info('Funkcja eksportu do PDF będzie dostępna wkrótce');
  };
  
  const handleExportCSV = () => {
    // Create CSV content
    const headers = ["Nick", "Punkty", "Karty użyte", "Runda eliminacji"];
    
    const csvRows = [
      headers.join(','),
      ...sortedPlayers.map(player => {
        const roundEliminated = player.eliminated ? state.currentRound : 'N/A';
        const cardsUsed = player.cards.filter(card => card.isUsed).length;
        return `"${player.name}",${player.points},${cardsUsed},"${roundEliminated}"`;
      })
    ];
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    // Create download link
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quiz_show_ranking.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast.success('Ranking wyeksportowany do CSV');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Ranking</h2>
      <p className="text-gray-600 mb-6">
        Zestawienie wyników i przebiegu rozgrywek.
      </p>

      <div className="space-y-6">
        {/* Edition selector */}
        <div className="flex items-center gap-2 mb-4">
          <span className="font-medium">Edycja:</span>
          <select
            className="bg-gameshow-background text-gameshow-text p-2 rounded"
            value={activeEdition}
            onChange={(e) => setActiveEdition(e.target.value)}
          >
            {editions.map(edition => (
              <option key={edition.id} value={edition.id}>
                {edition.name}
              </option>
            ))}
          </select>
          
          <div className="ml-auto">
            <Button variant="outline" size="sm" onClick={handleExportPDF}>
              Eksportuj do PDF
            </Button>
            <Button variant="outline" size="sm" className="ml-2" onClick={handleExportCSV}>
              Eksportuj do CSV
            </Button>
          </div>
        </div>
        
        {/* Rankings table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gameshow-background/70">
              <tr>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Nick</th>
                <th className="p-3 text-center">Punkty</th>
                <th className="p-3 text-center">Karty użyte</th>
                <th className="p-3 text-center">Runda eliminacji</th>
              </tr>
            </thead>
            <tbody>
              {sortedPlayers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-4 text-gray-500">
                    Brak danych do wyświetlenia
                  </td>
                </tr>
              ) : (
                sortedPlayers.map((player, index) => {
                  const isFirstPlace = index === 0;
                  const cardsUsed = player.cards.filter(card => card.isUsed).length;
                  
                  return (
                    <tr 
                      key={player.id} 
                      className={`
                        border-b border-gameshow-background/20
                        ${isFirstPlace ? 'bg-yellow-500/20 font-bold' : ''}
                        ${player.eliminated ? 'text-gray-500' : ''}
                      `}
                    >
                      <td className="p-3">
                        {isFirstPlace ? '🏆' : index + 1}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: player.color || '#ff5722' }}
                          />
                          {player.name}
                        </div>
                      </td>
                      <td className="p-3 text-center">{player.points}</td>
                      <td className="p-3 text-center">{cardsUsed}</td>
                      <td className="p-3 text-center">
                        {player.eliminated ? state.currentRound : '-'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* Player statistics */}
        <div className="mt-8">
          <h3 className="text-xl font-medium mb-4">Statystyki graczy</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedPlayers.length === 0 ? (
              <div className="col-span-full text-center p-4 bg-gameshow-background/20 rounded text-gray-500">
                Brak danych statystycznych
              </div>
            ) : (
              sortedPlayers.map(player => {
                // Calculate stats
                const correctAnswers = player.points / 10; // Assuming 10 points per correct answer
                const totalCards = player.cards.length;
                const usedCards = player.cards.filter(card => card.isUsed).length;
                
                return (
                  <div 
                    key={player.id}
                    className="bg-gameshow-background/20 p-4 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{player.name}</h4>
                      <span 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: player.color || '#ff5722' }}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Poprawne odpowiedzi:</span>
                        <span>{correctAnswers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Punkty:</span>
                        <span>{player.points}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Karty zdobyte:</span>
                        <span>{totalCards}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Karty użyte:</span>
                        <span>{usedCards} / {totalCards}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Status:</span>
                        <span>
                          {player.eliminated 
                            ? <span className="text-red-500">Wyeliminowany</span> 
                            : <span className="text-green-500">Aktywny</span>}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
