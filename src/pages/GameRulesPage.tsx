
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Target, 
  Clock, 
  Trophy, 
  Star, 
  Zap,
  ArrowLeft 
} from 'lucide-react';

const GameRulesPage = () => {
  return (
    <div className="min-h-screen bg-gameshow-background p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <Button asChild variant="outline" className="mb-4">
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft size={16} />
              Powrót do strony głównej
            </Link>
          </Button>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gameshow-primary to-gameshow-secondary bg-clip-text text-transparent mb-4">
            Zasady gry
          </h1>
          <p className="text-gameshow-muted text-lg">
            Kompletny przewodnik po regułach teleturnieju Quiz Show Arena
          </p>
        </div>

        <div className="space-y-8">
          {/* Round 1 */}
          <Card className="bg-gameshow-card border-blue-500/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Target className="h-6 w-6 text-blue-400" />
                <CardTitle className="text-2xl">Runda 1: Eliminacje</CardTitle>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  Wiedza ogólna
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gameshow-text">
                W pierwszej rundzie gracze odpowiadają na pytania z wiedzy ogólnej. 
                Każdy gracz rozpoczyna z 3 życiami.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2 text-blue-400">Zasady:</h4>
                  <ul className="space-y-1 text-sm text-gameshow-muted">
                    <li>• Każdy gracz ma 3 życia na start</li>
                    <li>• Za błędną odpowiedź tracisz 1 życie</li>
                    <li>• Gracz bez żyć zostaje wyeliminowany</li>
                    <li>• Poprawna odpowiedź = brak konsekwencji</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-blue-400">Cel:</h4>
                  <p className="text-sm text-gameshow-muted">
                    Przetrwanie do końca rundy z przynajmniej 1 życiem
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Round 2 */}
          <Card className="bg-gameshow-card border-amber-500/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Clock className="h-6 w-6 text-amber-400" />
                <CardTitle className="text-2xl">Runda 2: Szybka odpowiedź</CardTitle>
                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                  Na czas
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gameshow-text">
                Runda szybkości, gdzie liczy się nie tylko poprawność, ale też tempo odpowiedzi.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2 text-amber-400">Zasady:</h4>
                  <ul className="space-y-1 text-sm text-gameshow-muted">
                    <li>• Masz 5 sekund na odpowiedź</li>
                    <li>• Pierwszy poprawny dostaje punkty</li>
                    <li>• Błędna odpowiedź = utrata życia</li>
                    <li>• Brak odpowiedzi = brak konsekwencji</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-amber-400">Punktacja:</h4>
                  <p className="text-sm text-gameshow-muted">
                    Punkty zdobywasz tylko za pierwsze poprawne odpowiedzi
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Round 3 */}
          <Card className="bg-gameshow-card border-purple-500/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Trophy className="h-6 w-6 text-purple-400" />
                <CardTitle className="text-2xl">Runda 3: Koło fortuny</CardTitle>
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                  Finał
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gameshow-text">
                Runda finałowa decyduje o zwycięzcy całego teleturnieju.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2 text-purple-400">Zasady:</h4>
                  <ul className="space-y-1 text-sm text-gameshow-muted">
                    <li>• Koło losuje kategorię pytania</li>
                    <li>• Poprawna odpowiedź = punkty</li>
                    <li>• Błędna odpowiedź = utrata życia</li>
                    <li>• Wygrywa gracz z największą liczbą punktów</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-purple-400">Zwycięstwo:</h4>
                  <p className="text-sm text-gameshow-muted">
                    Gracz z najwyższym wynikiem punktowym wygrywa teleturniej
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Special Cards */}
          <Card className="bg-gameshow-card border-green-500/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Zap className="h-6 w-6 text-green-400" />
                <CardTitle className="text-2xl">Karty specjalne</CardTitle>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  Power-ups
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gameshow-text">
                Podczas gry gracze mogą otrzymywać karty specjalne z unikalnymi efektami.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <h5 className="font-semibold text-green-400 mb-2">Ochronne:</h5>
                  <ul className="space-y-1 text-gameshow-muted">
                    <li>• <strong>Reanimacja</strong> - przywraca życie</li>
                    <li>• <strong>Kontra</strong> - blokuje karty przeciwników</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-green-400 mb-2">Wspomagające:</h5>
                  <ul className="space-y-1 text-gameshow-muted">
                    <li>• <strong>Refleks 2x/3x</strong> - wydłuża czas</li>
                    <li>• <strong>Oświecenie</strong> - pokazuje odpowiedź</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-green-400 mb-2">Ofensywne:</h5>
                  <ul className="space-y-1 text-gameshow-muted">
                    <li>• <strong>Lustro</strong> - przekierowuje efekt</li>
                    <li>• <strong>Skip</strong> - pomija pytanie</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lucky Loser */}
          <Card className="bg-gameshow-card border-yellow-500/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Star className="h-6 w-6 text-yellow-400" />
                <CardTitle className="text-2xl">Lucky Loser</CardTitle>
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                  Druga szansa
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gameshow-text">
                Specjalna reguła pozwalająca na powrót jednego wyeliminowanego gracza.
              </p>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-yellow-400">Jak działa:</h4>
                <ul className="space-y-1 text-sm text-gameshow-muted">
                  <li>• Prowadzący może wybrać jednego wyeliminowanego gracza</li>
                  <li>• Najczęściej wybierany jest gracz z najwyższym wynikiem</li>
                  <li>• Gracz wraca do gry z 1 życiem</li>
                  <li>• Może być użyte tylko raz podczas całej gry</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GameRulesPage;
