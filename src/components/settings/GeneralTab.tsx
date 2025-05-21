
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// Define the schema for general settings
const generalSettingsSchema = z.object({
  gameName: z.string().min(3, 'Nazwa teleturnieju musi mieć przynajmniej 3 znaki').max(50),
  maxPlayers: z.number().min(2, 'Minimum 2 graczy').max(20, 'Maksymalnie 20 graczy'),
  initialLives: z.number().min(1, 'Minimum 1 życie').max(10, 'Maksymalnie 10 żyć'),
  roundTimeMin: z.number().min(10, 'Minimum 10 sekund').max(300, 'Maksymalnie 5 minut'),
  roundTimeMax: z.number().min(30, 'Minimum 30 sekund').max(600, 'Maksymalnie 10 minut'),
  maxPoints: z.number().min(100, 'Minimum 100 punktów').max(10000, 'Maksymalnie 10000 punktów'),
  showPoints: z.boolean(),
  showLives: z.boolean(),
  showTimer: z.boolean(),
  allowSounds: z.boolean(),
});

type GeneralSettingsFormValues = z.infer<typeof generalSettingsSchema>;

export function GeneralTab() {
  const [saved, setSaved] = useState(false);

  // Load settings from localStorage
  const getDefaultValues = (): GeneralSettingsFormValues => {
    try {
      const savedSettings = localStorage.getItem('gameshow-general-settings');
      if (savedSettings) {
        return JSON.parse(savedSettings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }

    // Default values
    return {
      gameName: 'Discord Game Show',
      maxPlayers: 10,
      initialLives: 3,
      roundTimeMin: 30,
      roundTimeMax: 120,
      maxPoints: 1000,
      showPoints: true,
      showLives: true,
      showTimer: true,
      allowSounds: true,
    };
  };

  const form = useForm<GeneralSettingsFormValues>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: getDefaultValues(),
  });

  // Save settings to localStorage
  const onSubmit = (values: GeneralSettingsFormValues) => {
    try {
      localStorage.setItem('gameshow-general-settings', JSON.stringify(values));
      toast.success('Zapisano ustawienia ogólne');
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Nie udało się zapisać ustawień');
    }
  };

  // Reset to defaults
  const handleReset = () => {
    if (confirm('Czy na pewno chcesz przywrócić domyślne ustawienia? Ta operacja nie może zostać cofnięta.')) {
      const defaultValues = {
        gameName: 'Discord Game Show',
        maxPlayers: 10,
        initialLives: 3,
        roundTimeMin: 30,
        roundTimeMax: 120,
        maxPoints: 1000,
        showPoints: true,
        showLives: true,
        showTimer: true,
        allowSounds: true,
      };
      
      form.reset(defaultValues);
      localStorage.setItem('gameshow-general-settings', JSON.stringify(defaultValues));
      toast.success('Przywrócono domyślne ustawienia');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4 text-gameshow-text">Ustawienia ogólne</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="bg-gameshow-card shadow-lg">
            <CardHeader>
              <CardTitle>Podstawowe ustawienia</CardTitle>
              <CardDescription>Skonfiguruj podstawowe parametry teleturnieju</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Game Name */}
              <FormField
                control={form.control}
                name="gameName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nazwa teleturnieju</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Wpisz nazwę teleturnieju" 
                        {...field} 
                        className="bg-gameshow-background"
                      />
                    </FormControl>
                    <FormDescription>
                      Nazwa będzie widoczna na wszystkich ekranach
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Max Players */}
              <FormField
                control={form.control}
                name="maxPlayers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maksymalna liczba graczy: {field.value}</FormLabel>
                    <FormControl>
                      <Slider
                        defaultValue={[field.value]}
                        min={2}
                        max={20}
                        step={1}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Initial Lives */}
              <FormField
                control={form.control}
                name="initialLives"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Początkowa liczba żyć: {field.value}</FormLabel>
                    <FormControl>
                      <Slider
                        defaultValue={[field.value]}
                        min={1}
                        max={10}
                        step={1}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          <Card className="bg-gameshow-card shadow-lg">
            <CardHeader>
              <CardTitle>Czas i punktacja</CardTitle>
              <CardDescription>Skonfiguruj ustawienia czasu i punktacji</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Round Time Min */}
              <FormField
                control={form.control}
                name="roundTimeMin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimalny czas rundy: {field.value} sekund</FormLabel>
                    <FormControl>
                      <Slider
                        defaultValue={[field.value]}
                        min={10}
                        max={300}
                        step={5}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Round Time Max */}
              <FormField
                control={form.control}
                name="roundTimeMax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maksymalny czas rundy: {field.value} sekund</FormLabel>
                    <FormControl>
                      <Slider
                        defaultValue={[field.value]}
                        min={30}
                        max={600}
                        step={10}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Max Points */}
              <FormField
                control={form.control}
                name="maxPoints"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maksymalna liczba punktów: {field.value}</FormLabel>
                    <FormControl>
                      <Slider
                        defaultValue={[field.value]}
                        min={100}
                        max={10000}
                        step={100}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          <Card className="bg-gameshow-card shadow-lg">
            <CardHeader>
              <CardTitle>Interfejs użytkownika</CardTitle>
              <CardDescription>Skonfiguruj wyświetlane elementy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Show Points */}
                <FormField
                  control={form.control}
                  name="showPoints"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4"
                        />
                      </FormControl>
                      <FormLabel>Pokaż punkty</FormLabel>
                    </FormItem>
                  )}
                />
                
                {/* Show Lives */}
                <FormField
                  control={form.control}
                  name="showLives"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4"
                        />
                      </FormControl>
                      <FormLabel>Pokaż życia</FormLabel>
                    </FormItem>
                  )}
                />
                
                {/* Show Timer */}
                <FormField
                  control={form.control}
                  name="showTimer"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4"
                        />
                      </FormControl>
                      <FormLabel>Pokaż timer</FormLabel>
                    </FormItem>
                  )}
                />
                
                {/* Allow Sounds */}
                <FormField
                  control={form.control}
                  name="allowSounds"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4"
                        />
                      </FormControl>
                      <FormLabel>Włącz dźwięki</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleReset}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" /> Przywróć domyślne
              </Button>
              <Button 
                type="submit" 
                className={`flex items-center gap-2 ${saved ? 'bg-green-500' : ''}`}
              >
                <Save className="h-4 w-4" /> {saved ? 'Zapisano!' : 'Zapisz ustawienia'}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
