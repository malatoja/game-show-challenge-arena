
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { 
  Clock, 
  AlertCircle,
  Activity,
  Sparkles,
  Play,
  Pause,
  RotateCw,
  Check,
  X
} from 'lucide-react';

type AutomationRule = {
  id: string;
  name: string;
  trigger: string;
  action: string;
  enabled: boolean;
  condition?: string;
};

export const AutomationTab = () => {
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([
    {
      id: '1',
      name: 'Automatyczny timer',
      trigger: 'questionDisplay',
      action: 'startTimer',
      enabled: true
    },
    {
      id: '2',
      name: 'Dźwięk po czasie',
      trigger: 'timerEnd',
      action: 'playSound',
      enabled: true
    },
    {
      id: '3',
      name: 'Następne pytanie po poprawnej odpowiedzi',
      trigger: 'correctAnswer',
      action: 'nextQuestion',
      enabled: false,
      condition: 'roundType=speed'
    }
  ]);
  
  const [activeIntegrations, setActiveIntegrations] = useState({
    discord: true,
    twitch: false,
    obs: true,
    streamElements: false
  });
  
  const [editingRule, setEditingRule] = useState<AutomationRule | null>(null);
  
  const triggerTypes = [
    { id: 'questionDisplay', name: 'Wyświetlenie pytania' },
    { id: 'timerEnd', name: 'Koniec odliczania' },
    { id: 'correctAnswer', name: 'Poprawna odpowiedź' },
    { id: 'incorrectAnswer', name: 'Błędna odpowiedź' },
    { id: 'playerEliminated', name: 'Eliminacja gracza' },
    { id: 'roundStart', name: 'Początek rundy' },
    { id: 'roundEnd', name: 'Koniec rundy' },
    { id: 'cardUsed', name: 'Użycie karty' },
    { id: 'wheelSpin', name: 'Kręcenie kołem' }
  ];
  
  const actionTypes = [
    { id: 'startTimer', name: 'Uruchom timer' },
    { id: 'stopTimer', name: 'Zatrzymaj timer' },
    { id: 'nextQuestion', name: 'Następne pytanie' },
    { id: 'playSound', name: 'Odtwórz dźwięk' },
    { id: 'showAnimation', name: 'Pokaż animację' },
    { id: 'updateInfoBar', name: 'Aktualizuj pasek info' },
    { id: 'sendToDiscord', name: 'Wyślij do Discord' },
    { id: 'sendToTwitch', name: 'Wyślij do Twitch' },
    { id: 'triggerOBS', name: 'Steruj OBS' }
  ];
  
  const handleSaveSettings = () => {
    try {
      localStorage.setItem('automationRules', JSON.stringify(automationRules));
      localStorage.setItem('activeIntegrations', JSON.stringify(activeIntegrations));
      toast.success('Ustawienia automatyzacji zostały zapisane');
    } catch (error) {
      console.error('Error saving automation settings:', error);
      toast.error('Wystąpił błąd podczas zapisywania ustawień');
    }
  };
  
  const handleToggleRule = (ruleId: string) => {
    setAutomationRules(automationRules.map(rule => 
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };
  
  const handleAddRule = () => {
    const newRule: AutomationRule = {
      id: Date.now().toString(),
      name: 'Nowa reguła',
      trigger: 'questionDisplay',
      action: 'startTimer',
      enabled: false
    };
    
    setAutomationRules([...automationRules, newRule]);
    setEditingRule(newRule);
  };
  
  const handleDeleteRule = (ruleId: string) => {
    if (confirm('Czy na pewno chcesz usunąć tę regułę automatyzacji?')) {
      setAutomationRules(automationRules.filter(rule => rule.id !== ruleId));
      toast.success('Reguła została usunięta');
    }
  };
  
  const handleSaveRule = () => {
    if (!editingRule) return;
    
    setAutomationRules(automationRules.map(rule => 
      rule.id === editingRule.id ? editingRule : rule
    ));
    
    setEditingRule(null);
    toast.success('Reguła została zaktualizowana');
  };
  
  const handleToggleIntegration = (integration: keyof typeof activeIntegrations) => {
    setActiveIntegrations({
      ...activeIntegrations,
      [integration]: !activeIntegrations[integration]
    });
  };
  
  const handleTestAllRules = () => {
    toast.info('Testowanie wszystkich włączonych reguł automatyzacji...');
    
    // Symulacja testu
    setTimeout(() => {
      const enabledRules = automationRules.filter(rule => rule.enabled).length;
      toast.success(`Przetestowano ${enabledRules} reguł automatyzacji`);
    }, 2000);
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Automatyzacja i integracje</h2>
      <p className="text-gray-600 mb-6">
        Konfiguracja automatycznych akcji i integracji z zewnętrznymi platformami.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Reguły automatyzacji */}
        <div className="space-y-6">
          <div className="bg-gameshow-background/30 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Reguły automatyzacji</h3>
              <Button size="sm" onClick={handleAddRule}>
                Dodaj regułę
              </Button>
            </div>
            
            {automationRules.length === 0 ? (
              <div className="text-center p-6 text-gameshow-muted">
                Brak zdefiniowanych reguł automatyzacji
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {automationRules.map((rule) => (
                  <div 
                    key={rule.id}
                    className="flex items-center justify-between p-3 bg-gameshow-background/20 rounded"
                  >
                    <div>
                      <div className="font-medium">{rule.name}</div>
                      <div className="text-xs text-gameshow-muted flex items-center gap-1">
                        <span>Wyzwalacz: {triggerTypes.find(t => t.id === rule.trigger)?.name || rule.trigger}</span>
                        {rule.condition && (
                          <>
                            <AlertCircle size={10} className="mx-1" />
                            <span>z warunkiem</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={rule.enabled}
                        onCheckedChange={() => handleToggleRule(rule.id)}
                      />
                      
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingRule(rule)}
                      >
                        Edytuj
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={handleTestAllRules}
              >
                Testuj wszystkie włączone reguły
              </Button>
            </div>
          </div>
          
          {/* Edycja reguły */}
          {editingRule && (
            <div className="bg-gameshow-background/30 p-4 rounded-lg">
              <h3 className="font-medium mb-4">Edycja reguły</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">Nazwa reguły</label>
                  <Input
                    value={editingRule.name}
                    onChange={(e) => setEditingRule({ ...editingRule, name: e.target.value })}
                    placeholder="np. Automatyczny timer"
                  />
                </div>
                
                <div>
                  <label className="block text-sm mb-1">Wyzwalacz</label>
                  <select
                    className="w-full p-2 rounded bg-gameshow-background"
                    value={editingRule.trigger}
                    onChange={(e) => setEditingRule({ ...editingRule, trigger: e.target.value })}
                  >
                    {triggerTypes.map((trigger) => (
                      <option key={trigger.id} value={trigger.id}>
                        {trigger.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm mb-1">Akcja</label>
                  <select
                    className="w-full p-2 rounded bg-gameshow-background"
                    value={editingRule.action}
                    onChange={(e) => setEditingRule({ ...editingRule, action: e.target.value })}
                  >
                    {actionTypes.map((action) => (
                      <option key={action.id} value={action.id}>
                        {action.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="flex items-center gap-2 text-sm mb-1">
                    <span>Warunek (opcjonalnie)</span>
                    <AlertCircle size={14} className="text-gameshow-muted" />
                  </label>
                  <Input
                    value={editingRule.condition || ''}
                    onChange={(e) => setEditingRule({ ...editingRule, condition: e.target.value })}
                    placeholder="np. roundType=speed"
                  />
                  <p className="text-xs text-gameshow-muted mt-1">
                    Format: nazwa_zmiennej=wartość, np. roundType=speed
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="flex items-center gap-2">
                      <Switch
                        checked={editingRule.enabled}
                        onCheckedChange={(checked) => setEditingRule({ ...editingRule, enabled: checked })}
                      />
                      <span>Włączona</span>
                    </label>
                  </div>
                  
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteRule(editingRule.id)}
                    className="text-red-500"
                  >
                    Usuń
                  </Button>
                </div>
                
                <div className="pt-2 flex justify-end gap-2">
                  <Button 
                    variant="outline"
                    onClick={() => setEditingRule(null)}
                  >
                    Anuluj
                  </Button>
                  
                  <Button onClick={handleSaveRule}>
                    Zapisz regułę
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Integracje */}
        <div className="space-y-6">
          <div className="bg-gameshow-background/30 p-4 rounded-lg">
            <h3 className="font-medium mb-4">Dostępne integracje</h3>
            
            <div className="space-y-4">
              {/* Discord integration */}
              <div className="flex items-center justify-between p-3 bg-gameshow-background/20 rounded">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#5865F2] rounded-full flex items-center justify-center text-white font-bold">
                    D
                  </div>
                  <div>
                    <div className="font-medium">Discord</div>
                    <div className="text-xs text-gameshow-muted">
                      {activeIntegrations.discord ? 'Połączono' : 'Nie połączono'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Switch
                    checked={activeIntegrations.discord}
                    onCheckedChange={() => handleToggleIntegration('discord')}
                  />
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => toast.info('Konfiguracja Discord będzie dostępna wkrótce')}
                  >
                    Konfiguruj
                  </Button>
                </div>
              </div>
              
              {/* Twitch integration */}
              <div className="flex items-center justify-between p-3 bg-gameshow-background/20 rounded">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#9146FF] rounded-full flex items-center justify-center text-white font-bold">
                    T
                  </div>
                  <div>
                    <div className="font-medium">Twitch</div>
                    <div className="text-xs text-gameshow-muted">
                      {activeIntegrations.twitch ? 'Połączono' : 'Nie połączono'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Switch
                    checked={activeIntegrations.twitch}
                    onCheckedChange={() => handleToggleIntegration('twitch')}
                  />
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => toast.info('Konfiguracja Twitch będzie dostępna wkrótce')}
                  >
                    Konfiguruj
                  </Button>
                </div>
              </div>
              
              {/* OBS integration */}
              <div className="flex items-center justify-between p-3 bg-gameshow-background/20 rounded">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#302E31] rounded-full flex items-center justify-center text-white font-bold">
                    O
                  </div>
                  <div>
                    <div className="font-medium">OBS</div>
                    <div className="text-xs text-gameshow-muted">
                      {activeIntegrations.obs ? 'Połączono' : 'Nie połączono'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Switch
                    checked={activeIntegrations.obs}
                    onCheckedChange={() => handleToggleIntegration('obs')}
                  />
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => toast.info('Konfiguracja OBS będzie dostępna wkrótce')}
                  >
                    Konfiguruj
                  </Button>
                </div>
              </div>
              
              {/* StreamElements integration */}
              <div className="flex items-center justify-between p-3 bg-gameshow-background/20 rounded">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#00C8C8] rounded-full flex items-center justify-center text-white font-bold">
                    S
                  </div>
                  <div>
                    <div className="font-medium">StreamElements</div>
                    <div className="text-xs text-gameshow-muted">
                      {activeIntegrations.streamElements ? 'Połączono' : 'Nie połączono'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Switch
                    checked={activeIntegrations.streamElements}
                    onCheckedChange={() => handleToggleIntegration('streamElements')}
                  />
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => toast.info('Konfiguracja StreamElements będzie dostępna wkrótce')}
                  >
                    Konfiguruj
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gameshow-background/30 p-4 rounded-lg">
            <h3 className="font-medium mb-4">Typowe automatyzacje</h3>
            
            <div className="space-y-3">
              <div className="p-3 bg-gameshow-background/20 rounded">
                <div className="flex items-center gap-2 mb-1">
                  <Clock size={16} className="text-gameshow-muted" />
                  <h4 className="font-medium">Timer dla każdego pytania</h4>
                </div>
                <p className="text-sm text-gameshow-muted mb-2">
                  Automatycznie uruchamia timer przy wyświetleniu pytania
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const existingRule = automationRules.find(r => 
                      r.trigger === 'questionDisplay' && r.action === 'startTimer'
                    );
                    
                    if (existingRule) {
                      setAutomationRules(automationRules.map(r => 
                        r.id === existingRule.id ? {...r, enabled: true} : r
                      ));
                      toast.success('Włączono istniejącą regułę automatycznego timera');
                    } else {
                      const newRule = {
                        id: Date.now().toString(),
                        name: 'Automatyczny timer',
                        trigger: 'questionDisplay',
                        action: 'startTimer',
                        enabled: true
                      };
                      setAutomationRules([...automationRules, newRule]);
                      toast.success('Dodano regułę automatycznego timera');
                    }
                  }}
                >
                  Włącz
                </Button>
              </div>
              
              <div className="p-3 bg-gameshow-background/20 rounded">
                <div className="flex items-center gap-2 mb-1">
                  <Activity size={16} className="text-gameshow-muted" />
                  <h4 className="font-medium">Automatyczne przejście po odpowiedzi</h4>
                </div>
                <p className="text-sm text-gameshow-muted mb-2">
                  Przechodzi do następnego pytania po udzieleniu poprawnej odpowiedzi
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const existingRule = automationRules.find(r => 
                      r.trigger === 'correctAnswer' && r.action === 'nextQuestion'
                    );
                    
                    if (existingRule) {
                      setAutomationRules(automationRules.map(r => 
                        r.id === existingRule.id ? {...r, enabled: true} : r
                      ));
                      toast.success('Włączono istniejącą regułę automatycznego przejścia');
                    } else {
                      const newRule = {
                        id: Date.now().toString(),
                        name: 'Auto przejście po poprawnej odpowiedzi',
                        trigger: 'correctAnswer',
                        action: 'nextQuestion',
                        enabled: true
                      };
                      setAutomationRules([...automationRules, newRule]);
                      toast.success('Dodano regułę automatycznego przejścia');
                    }
                  }}
                >
                  Włącz
                </Button>
              </div>
              
              <div className="p-3 bg-gameshow-background/20 rounded">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles size={16} className="text-gameshow-muted" />
                  <h4 className="font-medium">Automatyczne animacje</h4>
                </div>
                <p className="text-sm text-gameshow-muted mb-2">
                  Pokazuje animacje po poprawnych/błędnych odpowiedziach
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toast.info('Ta funkcja będzie dostępna wkrótce')}
                >
                  Włącz
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 bg-gameshow-background/30 p-4 rounded-lg">
        <h3 className="font-medium mb-4">Status automatyzacji</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 bg-gameshow-background/20 rounded">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">System automatyzacji</h4>
              <span className="text-green-500 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Aktywny
              </span>
            </div>
            <p className="text-sm text-gameshow-muted mt-1">
              {automationRules.filter(r => r.enabled).length} aktywnych reguł
            </p>
          </div>
          
          <div className="p-3 bg-gameshow-background/20 rounded">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Integracje</h4>
              <span className="text-green-500 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Połączone
              </span>
            </div>
            <p className="text-sm text-gameshow-muted mt-1">
              {Object.values(activeIntegrations).filter(Boolean).length} aktywnych połączeń
            </p>
          </div>
          
          <div className="p-3 bg-gameshow-background/20 flex justify-between items-center">
            <div>
              <h4 className="font-medium">System automatyzacji</h4>
              <p className="text-sm text-gameshow-muted mt-1">
                Włącz lub wyłącz wszystkie automatyzacje
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex items-center gap-1">
                <Play size={14} />
                <span>Start</span>
              </Button>
              <Button size="sm" variant="outline" className="flex items-center gap-1">
                <Pause size={14} />
                <span>Pauza</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end">
        <Button onClick={handleSaveSettings}>
          Zapisz ustawienia
        </Button>
      </div>
    </div>
  );
};
