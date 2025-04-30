
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface CardRulesProps {
  cardRules: {
    consecutiveCorrect: boolean;
    pointsThreshold: boolean;
    noLifeLoss: boolean;
    topPoints: boolean;
    advanceRound: boolean;
    lowestPoints: boolean;
    lowestLives: boolean;
  };
  handleToggleRule: (rule: string) => void;
}

export function CardRulesTab({ cardRules, handleToggleRule }: CardRulesProps) {
  return (
    <div className="space-y-6">
      <div className="bg-gameshow-card rounded-lg p-6 shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Automatyczne przyznawanie kart</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="rule-consecutive" className="font-medium">3 poprawne odpowiedzi z rzędu</Label>
              <p className="text-sm text-gameshow-muted">Karta: Déjà Vu</p>
            </div>
            <Switch
              id="rule-consecutive"
              checked={cardRules.consecutiveCorrect}
              onCheckedChange={() => handleToggleRule('consecutiveCorrect')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="rule-points" className="font-medium">50+ punktów w Rundzie 1</Label>
              <p className="text-sm text-gameshow-muted">Karta: Turbo</p>
            </div>
            <Switch
              id="rule-points"
              checked={cardRules.pointsThreshold}
              onCheckedChange={() => handleToggleRule('pointsThreshold')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="rule-lives" className="font-medium">Runda bez utraty życia</Label>
              <p className="text-sm text-gameshow-muted">Karta: Na Ratunek</p>
            </div>
            <Switch
              id="rule-lives"
              checked={cardRules.noLifeLoss}
              onCheckedChange={() => handleToggleRule('noLifeLoss')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="rule-top" className="font-medium">Najwięcej punktów w Rundzie 1</Label>
              <p className="text-sm text-gameshow-muted">Karta: Refleks x2</p>
            </div>
            <Switch
              id="rule-top"
              checked={cardRules.topPoints}
              onCheckedChange={() => handleToggleRule('topPoints')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="rule-advance" className="font-medium">Awans z rundy</Label>
              <p className="text-sm text-gameshow-muted">Karta: Kontra</p>
            </div>
            <Switch
              id="rule-advance"
              checked={cardRules.advanceRound}
              onCheckedChange={() => handleToggleRule('advanceRound')}
            />
          </div>
        </div>
      </div>

      <div className="bg-gameshow-card rounded-lg p-6 shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Karty "Na Ratunek"</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="rule-lowest-points" className="font-medium">Po R1 - gracz z najmniejszą liczbą punktów</Label>
            </div>
            <Switch
              id="rule-lowest-points"
              checked={cardRules.lowestPoints}
              onCheckedChange={() => handleToggleRule('lowestPoints')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="rule-lowest-lives" className="font-medium">Na start R3 - gracz z najmniejszą liczbą żyć</Label>
            </div>
            <Switch
              id="rule-lowest-lives"
              checked={cardRules.lowestLives}
              onCheckedChange={() => handleToggleRule('lowestLives')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardRulesTab;
