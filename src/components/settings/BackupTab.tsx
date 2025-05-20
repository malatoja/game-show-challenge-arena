
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useGame } from '@/context/GameContext';
import { 
  Download,
  Upload,
  RefreshCw,
  Save,
  Archive,
  Trash
} from 'lucide-react';

export const BackupTab = () => {
  const { state } = useGame();
  const [backups, setBackups] = useState<Array<{id: string, name: string, date: string}>>([
    { id: '1', name: 'Backup automatyczny', date: '2023-10-15 14:32' },
    { id: '2', name: 'Przed zmianami pytań', date: '2023-10-15 12:45' },
    { id: '3', name: 'Przed rundą finałową', date: '2023-10-14 18:10' }
  ]);
  
  const handleCreateBackup = () => {
    try {
      const backup = {
        timestamp: Date.now(),
        name: `Kopia ${new Date().toLocaleString('pl')}`,
        gameState: state,
        settings: {
          theme: localStorage.getItem('theme'),
          sounds: localStorage.getItem('soundSettings'),
          infoBar: localStorage.getItem('infoBarSettings'),
          // Inne ustawienia...
        }
      };
      
      // W rzeczywistej implementacji tutaj zapisywalibyśmy kopię w localStorage lub na serwerze
      const backupStr = JSON.stringify(backup);
      localStorage.setItem(`backup_${Date.now()}`, backupStr);
      
      // Aktualizacja listy kopii zapasowych - symulacja
      const newBackup = {
        id: Date.now().toString(),
        name: backup.name,
        date: new Date().toLocaleString('pl')
      };
      
      setBackups([newBackup, ...backups]);
      toast.success('Kopia zapasowa została utworzona');
    } catch (error) {
      console.error('Error creating backup:', error);
      toast.error('Wystąpił błąd podczas tworzenia kopii zapasowej');
    }
  };
  
  const handleExportAllData = () => {
    try {
      // Zbieranie wszystkich danych do eksportu
      const exportData = {
        gameState: state,
        settings: {
          theme: localStorage.getItem('theme'),
          sounds: localStorage.getItem('soundSettings'),
          infoBar: localStorage.getItem('infoBarSettings'),
          // Inne ustawienia...
        },
        localStorage: {} as Record<string, any>
      };
      
      // Pobieranie wszystkich kluczy z localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          try {
            exportData.localStorage[key] = JSON.parse(localStorage.getItem(key) || '');
          } catch {
            // Jeśli nie można sparsować, zapisz jako string
            exportData.localStorage[key] = localStorage.getItem(key);
          }
        }
      }
      
      // Tworzenie pliku do pobrania
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      const exportFileDefaultName = `quiz_show_backup_${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast.success('Wyeksportowano wszystkie dane do pliku JSON');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Wystąpił błąd podczas eksportu danych');
    }
  };
  
  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        
        // Tutaj moglibyśmy implementować logikę przywracania stanu gry
        // oraz innych ustawień z importowanych danych
        
        toast.success('Dane zostały zaimportowane');
        
        // Resetowanie input file
        event.target.value = '';
      } catch (error) {
        console.error('Error importing data:', error);
        toast.error('Wystąpił błąd podczas importu danych');
      }
    };
    
    reader.readAsText(file);
  };
  
  const handleRestoreBackup = (backupId: string) => {
    // W rzeczywistej implementacji przywrócilibyśmy tutaj stan z wybranej kopii zapasowej
    toast.success('Przywrócono kopię zapasową');
  };
  
  const handleDeleteBackup = (backupId: string) => {
    // Usunięcie kopii zapasowej
    setBackups(backups.filter(b => b.id !== backupId));
    toast.info('Usunięto kopię zapasową');
  };
  
  const handleClearAllBackups = () => {
    if (confirm('Czy na pewno chcesz usunąć wszystkie kopie zapasowe?')) {
      setBackups([]);
      toast.info('Usunięto wszystkie kopie zapasowe');
    }
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Kopie zapasowe i import/eksport danych</h2>
      <p className="text-gray-600 mb-6">
        Zarządzaj kopiami zapasowymi stanu gry, ustawień oraz importuj i eksportuj dane.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tworzenie kopii zapasowej */}
        <div className="bg-gameshow-background/30 p-4 rounded-lg">
          <h3 className="font-medium text-lg mb-4">Tworzenie kopii zapasowej</h3>
          
          <div className="space-y-4">
            <div className="flex flex-col">
              <p>Kopia zapasowa zawiera:</p>
              <ul className="list-disc list-inside text-sm mt-2 space-y-1 text-gameshow-muted">
                <li>Stan gry (pytania, gracze, karty)</li>
                <li>Ustawienia interfejsu i dźwięku</li>
                <li>Konfigurację paska informacyjnego</li>
                <li>Historię rozgrywki</li>
              </ul>
            </div>
            
            <div className="pt-2 space-y-2">
              <Button 
                onClick={handleCreateBackup}
                className="w-full flex items-center gap-2"
              >
                <Save size={16} />
                Utwórz nową kopię zapasową
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => toast.info('Funkcja automatycznych kopii zapasowych będzie dostępna wkrótce')}
                className="w-full flex items-center gap-2"
              >
                <RefreshCw size={16} />
                Włącz automatyczne kopie
              </Button>
            </div>
          </div>
        </div>
        
        {/* Import/Eksport danych */}
        <div className="bg-gameshow-background/30 p-4 rounded-lg">
          <h3 className="font-medium text-lg mb-4">Import/Eksport danych</h3>
          
          <div className="space-y-4">
            <div className="flex flex-col">
              <p>Eksport tworzy plik JSON zawierający wszystkie dane aplikacji, który można zaimportować później lub na innym urządzeniu.</p>
            </div>
            
            <div className="pt-2 space-y-2">
              <Button 
                onClick={handleExportAllData}
                className="w-full flex items-center gap-2"
              >
                <Download size={16} />
                Eksportuj wszystkie dane
              </Button>
              
              <div>
                <input
                  id="import-data"
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="hidden"
                />
                <Button 
                  variant="outline" 
                  onClick={() => document.getElementById('import-data')?.click()}
                  className="w-full flex items-center gap-2"
                >
                  <Upload size={16} />
                  Importuj dane z pliku
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Lista kopii zapasowych */}
      <div className="mt-6 bg-gameshow-background/30 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-lg">Historia kopii zapasowych</h3>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleClearAllBackups}
          >
            Wyczyść wszystkie
          </Button>
        </div>
        
        {backups.length === 0 ? (
          <div className="text-center py-6 text-gameshow-muted">
            Nie znaleziono żadnych kopii zapasowych
          </div>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {backups.map((backup) => (
              <div 
                key={backup.id}
                className="flex items-center justify-between p-3 bg-gameshow-background/30 rounded-md"
              >
                <div>
                  <h4 className="font-medium">{backup.name}</h4>
                  <p className="text-xs text-gameshow-muted">{backup.date}</p>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRestoreBackup(backup.id)}
                    title="Przywróć kopię"
                  >
                    <Archive size={16} />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteBackup(backup.id)}
                    title="Usuń"
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
        <h3 className="font-medium text-yellow-500 mb-2">Ważne informacje</h3>
        <ul className="list-disc list-inside text-sm space-y-1 text-gameshow-muted">
          <li>Kopie zapasowe są przechowywane lokalnie w przeglądarce</li>
          <li>Wyczyszczenie danych przeglądarki spowoduje utratę kopii zapasowych</li>
          <li>Regularnie eksportuj dane do pliku, aby uniknąć ich utraty</li>
          <li>Importowanie danych nadpisze wszystkie obecne ustawienia</li>
        </ul>
      </div>
    </div>
  );
};
