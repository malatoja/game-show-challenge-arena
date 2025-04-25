
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CARD_DETAILS, ROUND_NAMES } from '@/constants/gameConstants';
import { TabsContent, Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SpecialCard from '@/components/cards/SpecialCard';
import { motion } from 'framer-motion';

export default function GameRulesPage() {
  // Create card objects from CARD_DETAILS for display purposes
  const cardExamples = Object.entries(CARD_DETAILS).map(([type, details]) => ({
    type: type as any,
    name: details.name,
    description: details.description,
    isUsed: false
  }));

  return (
    <div className="container mx-auto p-4 bg-gameshow-background min-h-screen">
      <motion.div 
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="mb-8 bg-gameshow-card">
          <CardHeader className="bg-gradient-to-r from-gameshow-primary/30 to-gameshow-secondary/30">
            <CardTitle className="text-3xl text-center">Zasady Gry</CardTitle>
            <CardDescription className="text-center">
              Wszystko, co musisz wiedzieć o teleturnieju
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6">
            <Tabs defaultValue="rounds" className="w-full">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="rounds">Rundy</TabsTrigger>
                <TabsTrigger value="cards">Karty Specjalne</TabsTrigger>
                <TabsTrigger value="mechanics">Mechanika</TabsTrigger>
              </TabsList>
              
              <TabsContent value="rounds">
                <div className="space-y-6">
                  <div className="bg-gameshow-card p-4 rounded-lg border border-gameshow-primary/30">
                    <h3 className="text-xl font-bold mb-3">Runda 1: {ROUND_NAMES.knowledge}</h3>
                    <p className="mb-3">
                      W pierwszej rundzie gracze odpowiadają na pytania z różnych kategorii związanych z polskim internetem.
                      Każda poprawna odpowiedź to 10 punktów. Na odpowiedź masz 30 sekund.
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Top 5 graczy z najwyższą punktacją przechodzi do Rundy 2.</li>
                      <li>Dodatkowy gracz z najwyższą punktacją wśród przegranych dostaje szansę jako "Lucky Loser".</li>
                      <li>Gracze, którzy odpowiedzą poprawnie 3 razy z rzędu, otrzymują losową Kartę Specjalną.</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gameshow-card p-4 rounded-lg border border-gameshow-secondary/30">
                    <h3 className="text-xl font-bold mb-3">Runda 2: {ROUND_NAMES.speed}</h3>
                    <p className="mb-3">
                      W drugiej rundzie wszyscy gracze zaczynają z pełnymi życiami. Pytania są prostsze, ale czas na odpowiedź to tylko 5 sekund!
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Błędna odpowiedź oznacza utratę jednego życia.</li>
                      <li>Gdy gracz straci wszystkie życia, zostaje wyeliminowany.</li>
                      <li>Gracze z życiem na koniec rundy przechodzą do finału.</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gameshow-card p-4 rounded-lg border border-gameshow-accent/30">
                    <h3 className="text-xl font-bold mb-3">Runda 3: {ROUND_NAMES.wheel}</h3>
                    <p className="mb-3">
                      W finałowej rundzie kategorie pytań są wybierane przez Koło Fortuny. Punkty zdobywane w tej rundzie są podwojone!
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Koło Fortuny wybiera kategorię dla każdego pytania.</li>
                      <li>Błędne odpowiedzi oznaczają utratę życia.</li>
                      <li>Gracze mogą używać Kart Specjalnych dla strategicznej przewagi.</li>
                      <li>Zwycięzcą zostaje gracz z najwyższą liczbą punktów na koniec rundy, który nie został wyeliminowany.</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="cards">
                <div className="space-y-6">
                  <p className="mb-4">
                    Karty Specjalne dają graczom unikalne możliwości, które mogą zmienić przebieg gry. Można je zdobyć za serie poprawnych odpowiedzi, wysokie wyniki w rundach lub inne osiągnięcia.
                  </p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {cardExamples.map((card) => (
                      <div key={card.type} className="flex flex-col items-center">
                        <SpecialCard card={card} showAnimation={true} />
                        <p className="mt-2 text-center text-sm">{card.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="mechanics">
                <div className="space-y-6">
                  <h3 className="text-xl font-bold">Podstawowe mechaniki gry</h3>
                  
                  <div className="bg-gameshow-card p-4 rounded-lg border border-gameshow-primary/30">
                    <h4 className="font-bold mb-2">Życia graczy</h4>
                    <p>
                      Każdy gracz rozpoczyna z 3 życiami. W Rundzie 2 i 3, błędna odpowiedź oznacza utratę jednego życia.
                      Gdy gracz straci wszystkie życia, zostaje wyeliminowany z gry.
                    </p>
                  </div>
                  
                  <div className="bg-gameshow-card p-4 rounded-lg border border-gameshow-primary/30">
                    <h4 className="font-bold mb-2">Punktacja</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Runda 1: 10 punktów za poprawną odpowiedź</li>
                      <li>Runda 2: Brak punktów, liczy się tylko przetrwanie</li>
                      <li>Runda 3: 20 punktów za poprawną odpowiedź</li>
                      <li>Karta Turbo podwaja zdobywane punkty</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gameshow-card p-4 rounded-lg border border-gameshow-primary/30">
                    <h4 className="font-bold mb-2">Lucky Loser</h4>
                    <p>
                      Po Rundzie 1, gracz z najwyższym wynikiem poza Top 5 otrzymuje szansę jako "Lucky Loser" i przechodzi do Rundy 2.
                      Otrzymuje również specjalną kartę "Na Ratunek".
                    </p>
                  </div>
                  
                  <div className="bg-gameshow-card p-4 rounded-lg border border-gameshow-primary/30">
                    <h4 className="font-bold mb-2">Zwycięstwo</h4>
                    <p>
                      Zwycięzcą zostaje gracz, który na koniec Rundy 3 ma najwyższą łączną liczbę punktów ze wszystkich rund i nie został wyeliminowany.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          
          <CardFooter className="flex justify-center">
            <Link to="/" className="game-btn">
              Powrót do strony głównej
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
