
import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { CardType } from '@/types/gameTypes';
import { CARD_DETAILS } from '@/constants/gameConstants';
import { toast } from 'sonner';

interface CardRule {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
  condition: string;
  cardType: CardType;
}

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
  customRules?: CardRule[];
  onAddCustomRule?: (rule: CardRule) => void;
  onRemoveCustomRule?: (ruleId: string) => void;
  onToggleCustomRule?: (ruleId: string) => void;
  cardTypes: CardType[];
}

export function CardRulesTab({ 
  cardRules, 
  handleToggleRule, 
  customRules = [], 
  onAddCustomRule,
  onRemoveCustomRule,
  onToggleCustomRule,
  cardTypes 
}: CardRulesProps) {
  const [isCustomRuleDialogOpen, setIsCustomRuleDialogOpen] = useState(false);
  const [ruleName, setRuleName] = useState("");
  const [ruleDescription, setRuleDescription] = useState("");
  const [ruleCondition, setRuleCondition] = useState("consecutive_correct");
  const [ruleCardType, setRuleCardType] = useState<CardType>(cardTypes[0] || 'dejavu');

  const handleCreateCustomRule = () => {
    if (!ruleName.trim()) {
      toast.error("Nazwa zasady jest wymagana");
      return;
    }

    if (!ruleDescription.trim()) {
      toast.error("Opis zasady jest wymagany");
      return;
    }

    const newRule: CardRule = {
      id: `rule-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: ruleName,
      description: ruleDescription,
      isEnabled: true,
      condition: ruleCondition,
      cardType: ruleCardType
    };

    if (onAddCustomRule) {
      onAddCustomRule(newRule);
      toast.success(`Dodano nową zasadę: ${ruleName}`);
    }
    
    setRuleName("");
    setRuleDescription("");
    setRuleCondition("consecutive_correct");
    setRuleCardType(cardTypes[0] || 'dejavu');
    setIsCustomRuleDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gameshow-card rounded-lg p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Automatyczne przyznawanie kart</h3>
          <Dialog open={isCustomRuleDialogOpen} onOpenChange={setIsCustomRuleDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <PlusCircle className="h-4 w-4" /> Nowa zasada
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dodaj nową zasadę przyznawania kart</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="ruleName">Nazwa zasady</Label>
                  <Input 
                    id="ruleName" 
                    value={ruleName} 
                    onChange={(e) => setRuleName(e.target.value)} 
                    placeholder="np. 5 poprawnych odpowiedzi"
                  />
                </div>
                <div>
                  <Label htmlFor="ruleDescription">Opis zasady</Label>
                  <Input 
                    id="ruleDescription" 
                    value={ruleDescription} 
                    onChange={(e) => setRuleDescription(e.target.value)} 
                    placeholder="np. Gracz otrzymuje kartę po 5 poprawnych odpowiedziach"
                  />
                </div>
                <div>
                  <Label htmlFor="ruleCondition">Warunek</Label>
                  <Select value={ruleCondition} onValueChange={setRuleCondition}>
                    <SelectTrigger id="ruleCondition">
                      <SelectValue placeholder="Wybierz warunek" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consecutive_correct">Poprawne odpowiedzi z rzędu</SelectItem>
                      <SelectItem value="points_threshold">Próg punktowy</SelectItem>
                      <SelectItem value="no_life_loss">Bez utraty życia</SelectItem>
                      <SelectItem value="top_player">Najlepszy gracz</SelectItem>
                      <SelectItem value="lowest_points">Najmniej punktów</SelectItem>
                      <SelectItem value="advance_round">Awans z rundy</SelectItem>
                      <SelectItem value="custom">Niestandardowy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="ruleCardType">Typ karty do przyznania</Label>
                  <Select value={ruleCardType} onValueChange={(value) => setRuleCardType(value as CardType)}>
                    <SelectTrigger id="ruleCardType">
                      <SelectValue placeholder="Wybierz kartę" />
                    </SelectTrigger>
                    <SelectContent>
                      {cardTypes.map(type => (
                        <SelectItem key={type} value={type}>
                          {CARD_DETAILS[type]?.name || type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCustomRuleDialogOpen(false)}>Anuluj</Button>
                <Button onClick={handleCreateCustomRule}>Dodaj zasadę</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
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
          
          {/* Custom rules */}
          {customRules.map(rule => (
            <div key={rule.id} className="flex items-center justify-between border-t pt-2">
              <div>
                <Label htmlFor={`rule-${rule.id}`} className="font-medium">{rule.name}</Label>
                <p className="text-sm text-gameshow-muted">{rule.description}</p>
                <p className="text-xs text-gameshow-muted">Karta: {CARD_DETAILS[rule.cardType]?.name || rule.cardType}</p>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id={`rule-${rule.id}`}
                  checked={rule.isEnabled}
                  onCheckedChange={() => onToggleCustomRule && onToggleCustomRule(rule.id)}
                />
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8 text-red-500"
                  onClick={() => onRemoveCustomRule && onRemoveCustomRule(rule.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
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
