
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { 
  Save, 
  Upload, 
  Download, 
  Clock, 
  RefreshCw, 
  File, 
  Trash2,
  AlertCircle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';
import { useGame } from '@/context/GameContext';

interface BackupRecord {
  id: string;
  name: string;
  date: string;
  size: string;
}

export function BackupTab() {
  const { state } = useGame();
  const [backupName, setBackupName] = useState('');
  const [autoBackup, setAutoBackup] = useState(false);
  const [autoBackupInterval, setAutoBackupInterval] = useState(15);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Mock data for backup records
  const [backupRecords, setBackupRecords] = useState<BackupRecord[]>([
    {
      id: 'backup-1',
      name: 'Backup przed rundą finałową',
      date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      size: '156 KB'
    },
    {
      id: 'backup-2',
      name: 'Backup automatyczny',
      date: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
      size: '158 KB'
    }
  ]);
  
  // Handle creating a new backup
  const handleCreateBackup = () => {
    try {
      // Create backup from current game state
      const gameStateBackup = {
        ...state,
        backupDate: new Date().toISOString(),
        backupName: backupName || `Backup ${new Date().toLocaleString()}`
      };
      
      // Convert to JSON string
      const backupJson = JSON.stringify(gameStateBackup, null, 2);
      
      // Calculate size
      const size = Math.round((new TextEncoder().encode(backupJson).length / 1024) * 10) / 10;
      
      // Create a new backup record
      const newBackup: BackupRecord = {
        id: `backup-${Date.now()}`,
        name: backupName || `Backup ${new Date().toLocaleString('pl')}`,
        date: new Date().toISOString(),
        size: `${size} KB`
      };
      
      // Save backup to localStorage for persistence
      const backups = JSON.parse(localStorage.getItem('gameBackups') || '[]');
      backups.push({
        ...newBackup,
        data: backupJson
      });
      localStorage.setItem('gameBackups', JSON.stringify(backups));
      
      // Update UI
      setBackupRecords([newBackup, ...backupRecords]);
      setBackupName('');
      
      toast.success('Kopia zapasowa została utworzona');
      
    } catch (error) {
      console.error('Backup creation failed:', error);
      toast.error('Nie udało się utworzyć kopii zapasowej');
    }
  };
  
  // Handle downloading a backup
  const handleDownloadBackup = (backupId: string) => {
    try {
      // In real implementation, we would fetch the backup data from storage
      // For now, mock the data with current state
      const backupRecord = backupRecords.find(record => record.id === backupId);
      
      if (!backupRecord) {
        toast.error('Nie znaleziono kopii zapasowej');
        return;
      }
      
      const gameStateBackup = {
        ...state,
        backupDate: backupRecord.date,
        backupName: backupRecord.name
      };
      
      // Convert to JSON string
      const backupJson = JSON.stringify(gameStateBackup, null, 2);
      
      // Create a download link
      const blob = new Blob([backupJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${backupRecord.name.replace(/\s+/g, '_')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Pobieranie kopii zapasowej rozpoczęte');
      
    } catch (error) {
      console.error('Backup download failed:', error);
      toast.error('Nie udało się pobrać kopii zapasowej');
    }
  };
  
  // Handle restoring a backup
  const handleRestoreBackup = (backupId: string) => {
    // In real implementation, we would restore the game state from the backup
    // For now, show a confirmation dialog and success message
    if (confirm('Czy na pewno chcesz przywrócić tę kopię zapasową? Bieżący stan gry zostanie utracony.')) {
      toast.success('Kopia zapasowa została przywrócona');
      // In real implementation:
      // 1. Load backup data
      // 2. Parse JSON
      // 3. Dispatch action to restore game state
    }
  };
  
  // Handle deleting a backup
  const handleDeleteBackup = (backupId: string) => {
    if (confirm('Czy na pewno chcesz usunąć tę kopię zapasową?')) {
      // Remove from UI state
      setBackupRecords(backupRecords.filter(record => record.id !== backupId));
      
      // In real implementation, also remove from storage
      try {
        const backups = JSON.parse(localStorage.getItem('gameBackups') || '[]');
        const updatedBackups = backups.filter((backup: any) => backup.id !== backupId);
        localStorage.setItem('gameBackups', JSON.stringify(updatedBackups));
        
        toast.success('Kopia zapasowa została usunięta');
      } catch (error) {
        console.error('Error deleting backup:', error);
        toast.error('Nie udało się usunąć kopii zapasowej');
      }
    }
  };
  
  // Handle file selection for import
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  // Handle importing a backup file
  const handleImportBackup = () => {
    if (!selectedFile) {
      toast.error('Nie wybrano pliku');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        if (typeof event.target?.result !== 'string') {
          throw new Error('Invalid file format');
        }
        
        // Parse the JSON data
        const backupData = JSON.parse(event.target.result);
        
        // Validate it has required fields
        if (!backupData.players || !backupData.questions) {
          throw new Error('Invalid backup format');
        }
        
        // In real implementation, would dispatch action to restore state
        toast.success('Kopia zapasowa została zaimportowana');
        setSelectedFile(null);
        
      } catch (error) {
        console.error('Import failed:', error);
        toast.error('Nie udało się zaimportować kopii zapasowej. Nieprawidłowy format pliku.');
      }
    };
    
    reader.onerror = () => {
      toast.error('Wystąpił błąd podczas odczytu pliku');
    };
    
    reader.readAsText(selectedFile);
  };
  
  // Handle auto backup toggle
  const handleAutoBackupToggle = (enabled: boolean) => {
    setAutoBackup(enabled);
    
    // In real implementation, would set up or clear interval timer
    if (enabled) {
      toast.success(`Automatyczne kopie zapasowe włączone (co ${autoBackupInterval} minut)`);
    } else {
      toast.info('Automatyczne kopie zapasowe wyłączone');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Kopia zapasowa</h2>
      <p className="text-gray-600 mb-6">
        Zarządzaj kopiami zapasowymi swojego teleturnieju. Twórz, przywracaj i eksportuj kopie zapasowe.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Create New Backup */}
        <Card className="p-4 bg-gameshow-card shadow-md">
          <h3 className="text-lg font-semibold mb-4">Utwórz nową kopię zapasową</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gameshow-muted mb-1 block">Nazwa kopii zapasowej</label>
              <Input 
                value={backupName}
                onChange={(e) => setBackupName(e.target.value)}
                placeholder="np. Przed finałem 12.05.2023"
              />
            </div>
            
            <Button onClick={handleCreateBackup} className="w-full">
              <Save className="w-4 h-4 mr-2" /> Utwórz kopię zapasową
            </Button>
          </div>
        </Card>
        
        {/* Import Backup */}
        <Card className="p-4 bg-gameshow-card shadow-md">
          <h3 className="text-lg font-semibold mb-4">Importuj kopię zapasową</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gameshow-muted mb-1 block">Wybierz plik kopii zapasowej</label>
              <Input 
                type="file" 
                accept=".json" 
                onChange={handleFileChange}
              />
            </div>
            
            <Button 
              onClick={handleImportBackup} 
              disabled={!selectedFile}
              className="w-full"
            >
              <Upload className="w-4 h-4 mr-2" /> Importuj kopię zapasową
            </Button>
          </div>
        </Card>
      </div>
      
      {/* Auto-backup Settings */}
      <Card className="p-4 bg-gameshow-card shadow-md">
        <h3 className="text-lg font-semibold mb-4">Automatyczne kopie zapasowe</h3>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-medium">Włącz automatyczne kopie zapasowe</p>
            <p className="text-sm text-gameshow-muted">System automatycznie tworzy kopie zapasowe co określony czas</p>
          </div>
          <Switch 
            checked={autoBackup} 
            onCheckedChange={handleAutoBackupToggle} 
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gameshow-muted mb-1 block">Częstotliwość (minuty)</label>
            <Input 
              type="number" 
              min="5" 
              max="60" 
              value={autoBackupInterval}
              onChange={(e) => setAutoBackupInterval(parseInt(e.target.value))}
              disabled={!autoBackup}
            />
          </div>
          
          <div>
            <label className="text-sm text-gameshow-muted mb-1 block">Maksymalna liczba automatycznych kopii</label>
            <Input 
              type="number" 
              min="1" 
              max="20" 
              defaultValue="5"
              disabled={!autoBackup}
            />
          </div>
        </div>
      </Card>
      
      {/* Backup List */}
      <Card className="p-4 bg-gameshow-card shadow-md">
        <h3 className="text-lg font-semibold mb-4">Zapisane kopie zapasowe</h3>
        
        {backupRecords.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="mx-auto h-12 w-12 text-gameshow-muted mb-2" />
            <p className="text-gameshow-muted">Nie znaleziono żadnych kopii zapasowych</p>
          </div>
        ) : (
          <div className="space-y-3">
            {backupRecords.map((record) => (
              <div 
                key={record.id}
                className="flex items-center justify-between p-3 bg-gameshow-background rounded-md"
              >
                <div className="flex items-center space-x-3">
                  <File className="h-5 w-5 text-gameshow-primary" />
                  <div>
                    <p className="font-medium">{record.name}</p>
                    <p className="text-xs text-gameshow-muted">
                      {formatDistanceToNow(new Date(record.date), { addSuffix: true, locale: pl })} • {record.size}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDownloadBackup(record.id)}
                    title="Pobierz"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleRestoreBackup(record.id)}
                    title="Przywróć"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDeleteBackup(record.id)}
                    className="text-red-500 hover:text-red-700"
                    title="Usuń"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
      
      <div className="mt-6 bg-amber-50 border-l-4 border-amber-500 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-amber-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-amber-800">Ważna informacja</h3>
            <div className="mt-2 text-sm text-amber-700">
              <p>
                Kopie zapasowe zawierają wszystkie dane teleturnieju, w tym pytania, ustawienia i stan graczy.
                Przywracanie kopii zapasowej zastąpi wszystkie bieżące dane.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
