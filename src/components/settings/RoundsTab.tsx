
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Save, MoveUp, MoveDown, Timer, Heart, Dice } from 'lucide-react';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { RoundType } from '@/types/gameTypes';

// Define round settings schema
const roundSettingsSchema = z.object({
  name: z.string().min(3, 'Nazwa rundy musi mieć co najmniej 3 znaki'),
  timeLimit: z.number().min(10, 'Minimalny czas to 10 sekund'),
  pointsPerQuestion: z.number().min(10, 'Minimum 10 punktów'),
  lifeValue: z.number().min(0, 'Minimum 0').max(3, 'Maksimum 3'),
  eliminateOnFailure: z.boolean().optional(),
  randomQuestions: z.boolean().optional(),
  enableCards: z.boolean().optional(),
  questionsPerPlayer: z.number().min(1, 'Minimum 1 pytanie').max(10, 'Maksimum 10 pytań'),
});

type RoundSettingsFormValues = z.infer<typeof roundSettingsSchema>;

// Define Round Configuration
interface RoundConfig {
  id: RoundType;
  name: string;
  timeLimit: number;
  pointsPerQuestion: number;
  lifeValue: number;
  eliminateOnFailure: boolean;
  randomQuestions: boolean;
  enableCards: boolean;
  questionsPerPlayer: number;
}

export function RoundsTab() {
  const [activeTab, setActiveTab] = useState<RoundType>('knowledge');
  const [roundOrder, setRoundOrder] = useState<RoundType[]>(['knowledge', 'speed', 'wheel']);
  const [saved, setSaved] = useState(false);
  const [roundConfigs, setRoundConfigs] = useState<Record<RoundType, RoundConfig>>({
    knowledge: {
      id: 'knowledge',
      name: 'Runda Wiedzy',
      timeLimit: 60,
      pointsPerQuestion: 100,
      lifeValue: 1,
      eliminateOnFailure: true,
      randomQuestions: true,
      enableCards: true,
      questionsPerPlayer: 3
    },
    speed: {
      id: 'speed',
      name: 'Szybka Odpowiedź',
      timeLimit: 30,
      pointsPerQuestion: 150,
      lifeValue: 1,
      eliminateOnFailure: false,
      randomQuestions: true,
      enableCards: true,
      questionsPerPlayer: 2
    },
    wheel: {
      id: 'wheel',
      name: 'Koło Fortuny',
      timeLimit: 45,
      pointsPerQuestion: 200,
      lifeValue: 1,
      eliminateOnFailure: false,
      randomQuestions: true,
      enableCards: true,
      questionsPerPlayer: 1
    },
    standard: {
      id: 'standard',
      name: 'Runda Standardowa',
      timeLimit: 60,
      pointsPerQuestion: 100,
      lifeValue: 1,
      eliminateOnFailure: false,
      randomQuestions: true,
      enableCards: true,
      questionsPerPlayer: 1
    },
    all: {
      id: 'all',
      name: 'Wszystkie Rundy',
      timeLimit: 60,
      pointsPerQuestion: 100,
      lifeValue: 1,
      eliminateOnFailure: false,
      randomQuestions: true,
      enableCards: true,
      questionsPerPlayer: 1
    }
  });

  // Load round settings from localStorage
  useEffect(() => {
    try {
      // Load round order
      const savedRoundOrder = localStorage.getItem('gameshow-round-order');
      if (savedRoundOrder) {
        setRoundOrder(JSON.parse(savedRoundOrder));
      }

      // Load round configs
      const savedRoundConfigs = localStorage.getItem('gameshow-round-configs');
      if (savedRoundConfigs) {
        setRoundConfigs(JSON.parse(savedRoundConfigs));
      }
    } catch (error) {
      console.error('Error loading round settings:', error);
    }
  }, []);

  // Set up form
  const form = useForm<RoundSettingsFormValues>({
    resolver: zodResolver(roundSettingsSchema),
    defaultValues: roundConfigs[activeTab]
  });

  // Update form when active tab changes
  useEffect(() => {
    form.reset(roundConfigs[activeTab]);
  }, [activeTab, roundConfigs, form]);

  // Save round settings
  const onSubmit = (values: RoundSettingsFormValues) => {
    const updatedConfigs = { 
      ...roundConfigs, 
      [activeTab]: { 
        ...roundConfigs[activeTab],
        ...values 
      } 
    };
    
    setRoundConfigs(updatedConfigs);
    
    try {
      localStorage.setItem('gameshow-round-configs', JSON.stringify(updatedConfigs));
      toast.success(`Zapisano ustawienia rundy "${values.name}"`);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Error saving round settings:', error);
      toast.error('Nie udało się zapisać ustawień rundy');
    }
  };

  // Save round order
  const saveRoundOrder = () => {
    try {
      localStorage.setItem('gameshow-round-order', JSON.stringify(roundOrder));
      toast.success('Zapisano kolejność rund');
    } catch (error) {
      console.error('Error saving round order:', error);
      toast.error('Nie udało się zapisać kolejności rund');
    }
  };

  // Move round up in the order
  const moveRoundUp = (index: number) => {
    if (index <= 0) return;
    const newOrder = [...roundOrder];
    [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
    setRoundOrder(newOrder);
  };

  // Move round down in the order
  const moveRoundDown = (index: number) => {
    if (index >= roundOrder.length - 1) return;
    const newOrder = [...roundOrder];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    setRoundOrder(newOrder);
  };

  // Get round name for display
  const getRoundName = (roundType: RoundType) => {
    return roundConfigs[roundType]?.name || roundType;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4 text-gameshow-text">Ustawienia rund</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Round Order Section */}
        <Card className="bg-gameshow-card shadow-lg">
          <CardHeader>
            <CardTitle>Kolejność rund</CardTitle>
            <CardDescription>Przeciągnij lub użyj strzałek, aby zmienić kolejność</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {roundOrder.map((roundType, index) => (
                <div 
                  key={roundType}
                  className="flex items-center justify-between p-3 bg-gameshow-background rounded-lg"
                >
                  <span className="text-lg font-medium">{index + 1}. {getRoundName(roundType)}</span>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveRoundUp(index)}
                      disabled={index === 0}
                      className="h-8 w-8 p-0"
                    >
                      <MoveUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveRoundDown(index)}
                      disabled={index === roundOrder.length - 1}
                      className="h-8 w-8 p-0"
                    >
                      <MoveDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={saveRoundOrder} className="w-full">
              Zapisz kolejność
            </Button>
          </CardFooter>
        </Card>
        
        {/* Round Configuration Section */}
        <div className="md:col-span-2">
          <Card className="bg-gameshow-card shadow-lg">
            <CardHeader>
              <CardTitle>Konfiguracja rund</CardTitle>
              <CardDescription>Dostosuj ustawienia dla każdej rundy</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as RoundType)}>
                <TabsList className="mb-4">
                  <TabsTrigger value="knowledge">Wiedza</TabsTrigger>
                  <TabsTrigger value="speed">Szybka</TabsTrigger>
                  <TabsTrigger value="wheel">Koło</TabsTrigger>
                  <TabsTrigger value="standard">Standardowa</TabsTrigger>
                </TabsList>
                
                <TabsContent value={activeTab}>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      {/* Round Name */}
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nazwa rundy</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Wpisz nazwę rundy" 
                                {...field} 
                                className="bg-gameshow-background"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          {/* Time Limit */}
                          <FormField
                            control={form.control}
                            name="timeLimit"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center justify-between">
                                  <FormLabel>Limit czasu</FormLabel>
                                  <span className="text-sm">{field.value} sekund</span>
                                </div>
                                <FormControl>
                                  <Slider
                                    defaultValue={[field.value]}
                                    min={10}
                                    max={120}
                                    step={5}
                                    onValueChange={(value) => field.onChange(value[0])}
                                  />
                                </FormControl>
                                <FormDescription className="flex items-center text-xs">
                                  <Timer className="h-3 w-3 mr-1" /> Czas na odpowiedź
                                </FormDescription>
                              </FormItem>
                            )}
                          />
                          
                          {/* Points Per Question */}
                          <FormField
                            control={form.control}
                            name="pointsPerQuestion"
                            render={({ field }) => (
                              <FormItem className="mt-4">
                                <div className="flex items-center justify-between">
                                  <FormLabel>Punkty za pytanie</FormLabel>
                                  <span className="text-sm">{field.value} pkt</span>
                                </div>
                                <FormControl>
                                  <Slider
                                    defaultValue={[field.value]}
                                    min={10}
                                    max={500}
                                    step={10}
                                    onValueChange={(value) => field.onChange(value[0])}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div>
                          {/* Life Value */}
                          <FormField
                            control={form.control}
                            name="lifeValue"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center justify-between">
                                  <FormLabel>Utrata żyć</FormLabel>
                                  <span className="text-sm">{field.value}</span>
                                </div>
                                <FormControl>
                                  <Slider
                                    defaultValue={[field.value]}
                                    min={0}
                                    max={3}
                                    step={1}
                                    onValueChange={(value) => field.onChange(value[0])}
                                  />
                                </FormControl>
                                <FormDescription className="flex items-center text-xs">
                                  <Heart className="h-3 w-3 mr-1" /> Ile żyć gracz traci za błąd
                                </FormDescription>
                              </FormItem>
                            )}
                          />
                          
                          {/* Questions Per Player */}
                          <FormField
                            control={form.control}
                            name="questionsPerPlayer"
                            render={({ field }) => (
                              <FormItem className="mt-4">
                                <div className="flex items-center justify-between">
                                  <FormLabel>Pytań na gracza</FormLabel>
                                  <span className="text-sm">{field.value}</span>
                                </div>
                                <FormControl>
                                  <Slider
                                    defaultValue={[field.value]}
                                    min={1}
                                    max={10}
                                    step={1}
                                    onValueChange={(value) => field.onChange(value[0])}
                                  />
                                </FormControl>
                                <FormDescription className="flex items-center text-xs">
                                  <Dice className="h-3 w-3 mr-1" /> Liczba pytań dla każdego gracza
                                </FormDescription>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        {/* Eliminate On Failure */}
                        <FormField
                          control={form.control}
                          name="eliminateOnFailure"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                              <div className="space-y-0.5">
                                <FormLabel>Eliminacja po błędzie</FormLabel>
                                <FormDescription>
                                  Eliminuj graczy po błędnej odpowiedzi
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        {/* Random Questions */}
                        <FormField
                          control={form.control}
                          name="randomQuestions"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                              <div className="space-y-0.5">
                                <FormLabel>Losowe pytania</FormLabel>
                                <FormDescription>
                                  Losuj pytania dla graczy
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        {/* Enable Cards */}
                        <FormField
                          control={form.control}
                          name="enableCards"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                              <div className="space-y-0.5">
                                <FormLabel>Włącz karty</FormLabel>
                                <FormDescription>
                                  Pozwól na użycie kart w rundzie
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        className={`w-full mt-4 ${saved ? 'bg-green-500' : ''}`}
                      >
                        <Save className="h-4 w-4 mr-2" /> 
                        {saved ? 'Zapisano!' : 'Zapisz ustawienia rundy'}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Round Description Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gameshow-card shadow-lg">
          <CardHeader>
            <CardTitle>Runda Wiedzy</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Tradycyjna runda z pytaniami i odpowiedziami sprawdzająca wiedzę uczestników. Gracze odpowiadają na pytania po kolei, a za błędne odpowiedzi mogą zostać wyeliminowani.</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gameshow-card shadow-lg">
          <CardHeader>
            <CardTitle>Szybka Odpowiedź</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Szybka runda, w której liczy się czas odpowiedzi. Im szybciej uczestnik odpowie, tym więcej punktów zdobędzie. Krótki czas na odpowiedź zwiększa presję.</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gameshow-card shadow-lg">
          <CardHeader>
            <CardTitle>Koło Fortuny</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Kręcenie kołem decyduje o kategorii pytania. Różne sektory koła mogą również przynosić bonusy lub kary. Wprowadza element losowości.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
