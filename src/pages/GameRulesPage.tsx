
import React from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CardType } from '@/types/gameTypes';
import { CARD_DETAILS } from '@/constants/gameConstants';

const GameRulesPage: React.FC = () => {
  // Convert CARD_DETAILS to array for easier mapping
  const cardDetailsArray = Object.entries(CARD_DETAILS).map(([type, details]) => ({
    type: type as CardType,
    ...details
  }));

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Zasady Gry</h1>
      
      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="general">Ogólne</TabsTrigger>
          <TabsTrigger value="rounds">Rundy</TabsTrigger>
          <TabsTrigger value="cards">Karty Specjalne</TabsTrigger>
          <TabsTrigger value="points">Punktacja</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Ogólne zasady gry</h2>
            <p className="mb-4">
              GameShow to interaktywny teleturniej wiedzy, gdzie uczestnicy rywalizują odpowiadając na pytania
              z różnych dziedzin. Gra składa się z trzech rund o różnym charakterze.
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Każdy gracz zaczyna z 3 życiami</li>
              <li>Za poprawną odpowiedź zdobywa się punkty</li>
              <li>Błędna odpowiedź może kosztować utratę życia (zależnie od rundy)</li>
              <li>Gracze mogą zdobywać i używać kart specjalnych</li>
              <li>Wygrywa osoba z największą liczbą punktów po ostatniej rundzie</li>
            </ul>
          </Card>
        </TabsContent>
        
        <TabsContent value="rounds">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Rundy</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold">Runda 1: Wiedzy</h3>
                <p>Każdy gracz odpowiada na pytania po kolei. Poprawna odpowiedź dodaje punkty, błędna kosztuje życie.</p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold">Runda 2: Szybka</h3>
                <p>Ograniczony czas na odpowiedź. Tempo jest szybsze, a punktacja wyższa.</p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold">Runda 3: Koło Fortuny</h3>
                <p>Gracze kręcą kołem by wylosować kategorię pytania. Specjalna punktacja i zasady.</p>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="cards">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Karty Specjalne</h2>
            <p className="mb-4">
              W trakcie rozgrywki gracze mogą zdobywać i używać specjalnych kart, które dają im różne korzyści.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {cardDetailsArray.map((card) => (
                <div 
                  key={card.type} 
                  className="border rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <h3 className="text-lg font-bold">{card.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{card.description}</p>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="points">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">System punktacji</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold">Punkty za pytania</h3>
                <ul className="list-disc list-inside">
                  <li>Pytanie łatwe: 5-10 punktów</li>
                  <li>Pytanie średnie: 10-15 punktów</li>
                  <li>Pytanie trudne: 15-20 punktów</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-bold">Bonusy punktowe</h3>
                <ul className="list-disc list-inside">
                  <li>Szybka odpowiedź: +5 punktów</li>
                  <li>Seria poprawnych odpowiedzi: rosnący bonus</li>
                  <li>Bonus za ostatnie życie: +10 punktów</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-bold">Karty wpływające na punkty</h3>
                <ul className="list-disc list-inside">
                  <li>Turbo: podwaja zdobyte punkty</li>
                </ul>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GameRulesPage;
