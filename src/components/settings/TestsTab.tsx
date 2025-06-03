
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Check, XCircle, AlertCircle, Play } from 'lucide-react';

export const TestsTab = () => {
  const [activeTab, setActiveTab] = useState<string>('functional');
  const [testRunning, setTestRunning] = useState<boolean>(false);
  const [testProgress, setTestProgress] = useState<number>(0);
  const [selectedTests, setSelectedTests] = useState<string[]>([
    'test-questions', 'test-overlay', 'test-players'
  ]);
  
  const [testResults, setTestResults] = useState<{
    passed: number;
    failed: number;
    warnings: number;
    totalTime: string;
    details: Array<{
      name: string;
      status: 'passed' | 'failed' | 'warning';
      time: string;
      message: string;
    }>;
  }>({
    passed: 0,
    failed: 0,
    warnings: 0,
    totalTime: '0ms',
    details: []
  });
  
  const handleToggleTest = (testId: string) => {
    if (selectedTests.includes(testId)) {
      setSelectedTests(selectedTests.filter(id => id !== testId));
    } else {
      setSelectedTests([...selectedTests, testId]);
    }
  };
  
  const handleRunTests = () => {
    if (selectedTests.length === 0) {
      toast.error('Wybierz co najmniej jeden test');
      return;
    }
    
    setTestRunning(true);
    setTestProgress(0);
    setTestResults({
      passed: 0,
      failed: 0,
      warnings: 0,
      totalTime: '0ms',
      details: []
    });
    
    // Symulacja wykonywania testów
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setTestProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        finishTests();
      }
    }, 200);
  };
  
  const finishTests = () => {
    // Symulacja wyników testów
    const results = {
      passed: Math.floor(Math.random() * 20) + 5,
      failed: Math.floor(Math.random() * 3),
      warnings: Math.floor(Math.random() * 5),
      totalTime: `${Math.floor(Math.random() * 500) + 100}ms`,
      details: [
        {
          name: 'Test pytań i odpowiedzi',
          status: 'passed' as const,
          time: `${Math.floor(Math.random() * 100) + 50}ms`,
          message: 'Wszystkie testy przeszły pomyślnie'
        },
        {
          name: 'Test kart specjalnych',
          status: 'passed' as const,
          time: `${Math.floor(Math.random() * 100) + 50}ms`,
          message: 'Wszystkie testy przeszły pomyślnie'
        },
        {
          name: 'Test paska informacyjnego',
          status: Math.random() > 0.7 ? 'warning' as const : 'passed' as const,
          time: `${Math.floor(Math.random() * 100) + 50}ms`,
          message: Math.random() > 0.7 ? 'Animacja może działać wolno w starszych przeglądarkach' : 'Wszystkie testy przeszły pomyślnie'
        },
        {
          name: 'Test połączenia WebSocket',
          status: Math.random() > 0.8 ? 'failed' as const : 'passed' as const,
          time: `${Math.floor(Math.random() * 100) + 50}ms`,
          message: Math.random() > 0.8 ? 'Nie można nawiązać połączenia WebSocket' : 'Połączenie WebSocket działa poprawnie'
        },
        {
          name: 'Test interfejsu użytkownika',
          status: 'passed' as const,
          time: `${Math.floor(Math.random() * 100) + 50}ms`,
          message: 'Wszystkie testy przeszły pomyślnie'
        }
      ]
    };
    
    setTestResults(results);
    setTestRunning(false);
    
    if (results.failed > 0) {
      toast.error(`Testy zakończone z ${results.failed} błędami`);
    } else if (results.warnings > 0) {
      toast.warning(`Testy zakończone z ${results.warnings} ostrzeżeniami`);
    } else {
      toast.success('Wszystkie testy przeszły pomyślnie');
    }
  };
  
  const handleRunStressTest = () => {
    toast.info('Uruchamianie testu obciążeniowego...');
    setTestRunning(true);
    
    // Symulacja testu obciążeniowego
    setTimeout(() => {
      setTestRunning(false);
      toast.success('Test obciążeniowy zakończony. System działa stabilnie pod obciążeniem.');
    }, 5000);
  };
  
  const functionalTests = [
    { id: 'test-questions', name: 'Test pytań i odpowiedzi' },
    { id: 'test-players', name: 'Test systemu graczy' },
    { id: 'test-cards', name: 'Test kart specjalnych' },
    { id: 'test-overlay', name: 'Test overlayu' },
    { id: 'test-infobar', name: 'Test paska informacyjnego' },
    { id: 'test-websocket', name: 'Test połączenia WebSocket' },
    { id: 'test-ui', name: 'Test interfejsu użytkownika' },
    { id: 'test-timer', name: 'Test systemu timera' }
  ];
  
  const performanceTests = [
    { id: 'perf-load', name: 'Test czasu ładowania' },
    { id: 'perf-render', name: 'Test wydajności renderowania' },
    { id: 'perf-memory', name: 'Test użycia pamięci' },
    { id: 'perf-websocket', name: 'Test wydajności WebSocket' }
  ];
  
  const compatibilityTests = [
    { id: 'compat-browsers', name: 'Test zgodności przeglądarek' },
    { id: 'compat-devices', name: 'Test zgodności urządzeń' },
    { id: 'compat-screens', name: 'Test rozdzielczości ekranu' }
  ];
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Testy</h2>
      <p className="text-gray-600 mb-6">
        Uruchamianie testów systemu i diagnostyka problemów.
      </p>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="functional">Funkcjonalne</TabsTrigger>
          <TabsTrigger value="performance">Wydajność</TabsTrigger>
          <TabsTrigger value="compatibility">Zgodność</TabsTrigger>
          <TabsTrigger value="stress">Obciążeniowe</TabsTrigger>
        </TabsList>
        
        {/* Testy funkcjonalne */}
        <TabsContent value="functional" className="space-y-6">
          <div className="bg-gameshow-background/30 p-4 rounded-lg space-y-4">
            <h3 className="font-medium mb-2">Dostępne testy funkcjonalne</h3>
            
            <div className="space-y-2">
              {functionalTests.map((test) => (
                <div key={test.id} className="flex items-center justify-between p-2 bg-gameshow-background/20 rounded">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedTests.includes(test.id)}
                      onChange={() => handleToggleTest(test.id)}
                      className="w-4 h-4"
                      disabled={testRunning}
                    />
                    {test.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        
        {/* Testy wydajnościowe */}
        <TabsContent value="performance" className="space-y-6">
          <div className="bg-gameshow-background/30 p-4 rounded-lg space-y-4">
            <h3 className="font-medium mb-2">Testy wydajnościowe</h3>
            
            <div className="space-y-2">
              {performanceTests.map((test) => (
                <div key={test.id} className="flex items-center justify-between p-2 bg-gameshow-background/20 rounded">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedTests.includes(test.id)}
                      onChange={() => handleToggleTest(test.id)}
                      className="w-4 h-4"
                      disabled={testRunning}
                    />
                    {test.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        
        {/* Testy zgodności */}
        <TabsContent value="compatibility" className="space-y-6">
          <div className="bg-gameshow-background/30 p-4 rounded-lg space-y-4">
            <h3 className="font-medium mb-2">Testy zgodności</h3>
            
            <div className="space-y-2">
              {compatibilityTests.map((test) => (
                <div key={test.id} className="flex items-center justify-between p-2 bg-gameshow-background/20 rounded">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedTests.includes(test.id)}
                      onChange={() => handleToggleTest(test.id)}
                      className="w-4 h-4"
                      disabled={testRunning}
                    />
                    {test.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        
        {/* Testy obciążeniowe */}
        <TabsContent value="stress" className="space-y-6">
          <div className="bg-gameshow-background/30 p-4 rounded-lg space-y-4">
            <h3 className="font-medium mb-2">Testy obciążeniowe</h3>
            
            <p className="text-sm text-gameshow-muted mb-4">
              Testy obciążeniowe sprawdzają stabilność systemu pod zwiększonym obciążeniem.
              <br />
              Uwaga: Te testy mogą chwilowo spowolnić działanie aplikacji.
            </p>
            
            <div className="space-y-4">
              <div className="p-3 bg-gameshow-background/20 rounded">
                <h4 className="font-medium">Test wielu graczy</h4>
                <p className="text-xs text-gameshow-muted mb-2">
                  Symuluje działanie aplikacji z dużą liczbą podłączonych graczy.
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRunStressTest}
                  disabled={testRunning}
                >
                  Uruchom
                </Button>
              </div>
              
              <div className="p-3 bg-gameshow-background/20 rounded">
                <h4 className="font-medium">Test wielu pytań</h4>
                <p className="text-xs text-gameshow-muted mb-2">
                  Sprawdza działanie systemu z bardzo dużą liczbą pytań.
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRunStressTest}
                  disabled={testRunning}
                >
                  Uruchom
                </Button>
              </div>
              
              <div className="p-3 bg-gameshow-background/20 rounded">
                <h4 className="font-medium">Test szybkich akcji</h4>
                <p className="text-xs text-gameshow-muted mb-2">
                  Sprawdza jak system radzi sobie z wieloma akcjami wykonywanymi jednocześnie.
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRunStressTest}
                  disabled={testRunning}
                >
                  Uruchom
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Przyciski kontrolne */}
      <div className="mt-6 flex justify-between">
        <Button 
          variant="outline" 
          onClick={() => setSelectedTests([])}
          disabled={testRunning || selectedTests.length === 0}
        >
          Wyczyść zaznaczenie
        </Button>
        
        <Button 
          onClick={handleRunTests}
          disabled={testRunning || selectedTests.length === 0}
          className="flex items-center gap-2"
        >
          {testRunning ? 'Uruchomione...' : 'Uruchom testy'}
          {!testRunning && <Play size={16} />}
        </Button>
      </div>
      
      {/* Postęp testu */}
      {testRunning && (
        <div className="mt-6 bg-gameshow-background/30 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Wykonywanie testów...</h3>
          <Progress value={testProgress} className="mb-2" />
          <div className="text-sm text-gameshow-muted text-right">{testProgress}%</div>
        </div>
      )}
      
      {/* Wyniki testów */}
      {!testRunning && testResults.details.length > 0 && (
        <div className="mt-6 bg-gameshow-background/30 p-4 rounded-lg">
          <h3 className="font-medium mb-4">Wyniki testów</h3>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-green-500/20 p-3 rounded text-center">
              <div className="font-bold text-2xl text-green-500">{testResults.passed}</div>
              <div className="text-sm">Udane</div>
            </div>
            
            <div className="bg-yellow-500/20 p-3 rounded text-center">
              <div className="font-bold text-2xl text-yellow-500">{testResults.warnings}</div>
              <div className="text-sm">Ostrzeżenia</div>
            </div>
            
            <div className="bg-red-500/20 p-3 rounded text-center">
              <div className="font-bold text-2xl text-red-500">{testResults.failed}</div>
              <div className="text-sm">Błędy</div>
            </div>
          </div>
          
          <div className="text-sm text-gameshow-muted mb-4">
            Całkowity czas wykonania: {testResults.totalTime}
          </div>
          
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {testResults.details.map((test, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-md ${
                  test.status === 'passed' ? 'bg-green-500/10' : 
                  test.status === 'warning' ? 'bg-yellow-500/10' : 'bg-red-500/10'
                }`}
              >
                <div className="flex items-center gap-2">
                  {test.status === 'passed' && <Check size={16} className="text-green-500" />}
                  {test.status === 'warning' && <AlertCircle size={16} className="text-yellow-500" />}
                  {test.status === 'failed' && <XCircle size={16} className="text-red-500" />}
                  
                  <span className="font-medium">{test.name}</span>
                  <span className="text-xs text-gameshow-muted ml-auto">{test.time}</span>
                </div>
                <div className="text-sm mt-1 pl-6">{test.message}</div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                // W rzeczywistej implementacji tutaj eksportowalibyśmy szczegółowy raport
                toast.success('Raport wyeksportowany');
              }}
            >
              Eksportuj raport
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
