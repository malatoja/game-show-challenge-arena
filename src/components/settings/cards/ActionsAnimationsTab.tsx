
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { PlusCircle, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { CardType } from '@/types/gameTypes';
import { CARD_DETAILS } from '@/constants/gameConstants';

interface GameAction {
  id: string;
  name: string;
  description: string;
  animationUrl?: string;
  triggerType: string;
  cardType?: CardType;
}

interface ActionsAnimationsTabProps {
  cardTypes: CardType[];
}

export function ActionsAnimationsTab({ cardTypes }: ActionsAnimationsTabProps) {
  const [gameActions, setGameActions] = useState<GameAction[]>([
    { 
      id: 'action-1',
      name: 'Poprawna odpowiedź', 
      description: 'Animacja po udzieleniu poprawnej odpowiedzi',
      triggerType: 'correct_answer'
    },
    { 
      id: 'action-2',
      name: 'Błędna odpowiedź', 
      description: 'Animacja po udzieleniu błędnej odpowiedzi',
      triggerType: 'wrong_answer'
    },
    { 
      id: 'action-3',
      name: 'Użycie karty Déjà Vu', 
      description: 'Animacja użycia karty Déjà Vu',
      triggerType: 'card_use',
      cardType: 'dejavu'
    }
  ]);
  
  const [isAddActionDialogOpen, setIsAddActionDialogOpen] = useState(false);
  const [actionName, setActionName] = useState("");
  const [actionDescription, setActionDescription] = useState("");
  const [actionTrigger, setActionTrigger] = useState("correct_answer");
  const [selectedCardType, setSelectedCardType] = useState<CardType | "">("");
  const [animationFile, setAnimationFile] = useState<File | null>(null);
  
  const handleAddAction = () => {
    if (!actionName.trim()) {
      toast.error("Nazwa akcji jest wymagana");
      return;
    }
    
    if (!actionDescription.trim()) {
      toast.error("Opis akcji jest wymagany");
      return;
    }
    
    if (actionTrigger === 'card_use' && !selectedCardType) {
      toast.error("Wybierz typ karty");
      return;
    }
    
    // In a real app, we would upload the animation file to a server
    // For now, we'll create a local URL if a file is selected
    let animationUrl = undefined;
    if (animationFile) {
      animationUrl = URL.createObjectURL(animationFile);
    }
    
    const newAction: GameAction = {
      id: `action-${Date.now()}`,
      name: actionName,
      description: actionDescription,
      animationUrl,
      triggerType: actionTrigger,
      cardType: actionTrigger === 'card_use' ? (selectedCardType as CardType) : undefined
    };
    
    setGameActions(prev => [...prev, newAction]);
    toast.success(`Dodano nową akcję: ${actionName}`);
    
    // Reset form
    setActionName("");
    setActionDescription("");
    setActionTrigger("correct_answer");
    setSelectedCardType("");
    setAnimationFile(null);
    setIsAddActionDialogOpen(false);
  };
  
  const handleRemoveAction = (actionId: string) => {
    setGameActions(prev => prev.filter(action => action.id !== actionId));
    toast.success("Usunięto akcję");
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type.startsWith('video/') || file.type === 'image/gif') {
        setAnimationFile(file);
      } else {
        toast.error("Wybierz plik wideo lub animację GIF");
      }
    }
  };
  
  const handleUploadAnimation = (actionId: string) => {
    // Create a file input and trigger it
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'video/*,image/gif';
    fileInput.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const file = target.files[0];
        
        // In a real app, we would upload the file to a server
        // For now we'll create a local URL
        const animationUrl = URL.createObjectURL(file);
        
        setGameActions(prev => 
          prev.map(action => 
            action.id === actionId 
              ? { ...action, animationUrl } 
              : action
          )
        );
        
        toast.success("Animacja dodana");
      }
    };
    fileInput.click();
  };
  
  return (
    <div className="bg-gameshow-card rounded-lg p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Animacje akcji w grze</h3>
        <Dialog open={isAddActionDialogOpen} onOpenChange={setIsAddActionDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-1">
              <PlusCircle className="w-4 h-4" /> Nowa akcja
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dodaj nową akcję</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="actionName">Nazwa akcji</Label>
                <Input 
                  id="actionName" 
                  value={actionName} 
                  onChange={(e) => setActionName(e.target.value)}
                  placeholder="np. Użycie karty specjalnej" 
                />
              </div>
              <div>
                <Label htmlFor="actionDescription">Opis akcji</Label>
                <Input 
                  id="actionDescription" 
                  value={actionDescription} 
                  onChange={(e) => setActionDescription(e.target.value)}
                  placeholder="np. Animacja pokazywana podczas użycia karty specjalnej" 
                />
              </div>
              <div>
                <Label htmlFor="actionTrigger">Typ wyzwalacza</Label>
                <Select value={actionTrigger} onValueChange={setActionTrigger}>
                  <SelectTrigger id="actionTrigger">
                    <SelectValue placeholder="Wybierz typ wyzwalacza" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="correct_answer">Poprawna odpowiedź</SelectItem>
                    <SelectItem value="wrong_answer">Błędna odpowiedź</SelectItem>
                    <SelectItem value="card_use">Użycie karty</SelectItem>
                    <SelectItem value="round_start">Początek rundy</SelectItem>
                    <SelectItem value="round_end">Koniec rundy</SelectItem>
                    <SelectItem value="game_over">Koniec gry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {actionTrigger === 'card_use' && (
                <div>
                  <Label htmlFor="cardType">Typ karty</Label>
                  <Select 
                    value={selectedCardType} 
                    onValueChange={(value) => setSelectedCardType(value as CardType)}
                  >
                    <SelectTrigger id="cardType">
                      <SelectValue placeholder="Wybierz typ karty" />
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
              )}
              
              <div>
                <Label htmlFor="animationFile">Animacja (opcjonalnie)</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    id="animationFile" 
                    type="file" 
                    accept="video/*,image/gif"
                    onChange={handleFileChange}
                    className="flex-1"
                  />
                  {animationFile && (
                    <p className="text-xs text-green-500">Wybrano: {animationFile.name}</p>
                  )}
                </div>
                <p className="text-xs text-gameshow-muted mt-1">Obsługiwane formaty: mp4, webm, gif</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddActionDialogOpen(false)}>Anuluj</Button>
              <Button onClick={handleAddAction}>Dodaj akcję</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="space-y-4">
        {gameActions.length === 0 ? (
          <div className="text-center py-8 text-gameshow-muted">
            <p>Brak zdefiniowanych akcji. Dodaj nową akcję aby przypisać jej animację.</p>
          </div>
        ) : (
          gameActions.map(action => (
            <div key={action.id} className="border border-gameshow-muted/20 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{action.name}</h4>
                  <p className="text-sm text-gameshow-muted">{action.description}</p>
                  <p className="text-xs text-gameshow-muted mt-1">
                    Wyzwalacz: {
                      action.triggerType === 'correct_answer' ? 'Poprawna odpowiedź' :
                      action.triggerType === 'wrong_answer' ? 'Błędna odpowiedź' :
                      action.triggerType === 'card_use' ? `Użycie karty ${action.cardType ? CARD_DETAILS[action.cardType]?.name || action.cardType : ''}` :
                      action.triggerType === 'round_start' ? 'Początek rundy' :
                      action.triggerType === 'round_end' ? 'Koniec rundy' :
                      action.triggerType === 'game_over' ? 'Koniec gry' :
                      action.triggerType
                    }
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => handleUploadAnimation(action.id)}
                  >
                    <Upload className="w-4 h-4" />
                    {action.animationUrl ? "Zmień animację" : "Dodaj animację"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500"
                    onClick={() => handleRemoveAction(action.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {action.animationUrl && (
                <div className="mt-3">
                  <Label className="text-xs block mb-1">Podgląd animacji:</Label>
                  <div className="bg-gameshow-background rounded overflow-hidden h-24 flex items-center justify-center">
                    {action.animationUrl.endsWith('.gif') ? (
                      <img 
                        src={action.animationUrl} 
                        alt="Animation preview" 
                        className="h-full object-contain"
                      />
                    ) : (
                      <video 
                        src={action.animationUrl} 
                        className="h-full" 
                        loop 
                        muted 
                        autoPlay 
                        controls
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ActionsAnimationsTab;
