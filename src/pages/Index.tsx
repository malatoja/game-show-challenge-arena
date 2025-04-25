
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gameshow-background">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gameshow-primary via-gameshow-accent to-gameshow-secondary">
            Game Show Challenge Arena
          </span>
        </h1>
        
        <p className="text-xl text-gameshow-muted max-w-2xl mb-8">
          Interaktywny teleturniej z trzema rundami, specjalnymi kartami i animacjami dla streamów na Twitchu. 
          Pytania z polskiego internetu, Twitcha i gier w Polsce.
        </p>
        
        <div className="flex flex-col md:flex-row gap-4">
          <Link to="/host">
            <Button className="game-btn text-lg px-8 py-6" size="lg">
              Panel Hosta
            </Button>
          </Link>
          
          <Link to="/player">
            <Button variant="outline" className="text-lg px-8 py-6 bg-gameshow-card border-gameshow-primary/50" size="lg">
              Widok Gracza
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Features */}
      <div className="container mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-gameshow-card rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gameshow-text mb-4">3 Ekscytujące Rundy</h2>
          <p className="text-gameshow-muted">
            Wiedza z polskiego internetu, runda 5 sekund i koło fortuny z różnymi kategoriami. 
            Każda runda przynosi nowe wyzwania i możliwości zdobycia punktów!
          </p>
        </div>
        
        <div className="bg-gameshow-card rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gameshow-text mb-4">Specjalne Karty</h2>
          <p className="text-gameshow-muted">
            Dejavu, Kontra, Reanimacja i inne karty specjalne zmieniają przebieg gry i dają graczom 
            unikalne możliwości strategiczne.
          </p>
        </div>
        
        <div className="bg-gameshow-card rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gameshow-text mb-4">Idealny dla Streamerów</h2>
          <p className="text-gameshow-muted">
            Zaprojektowany z myślą o streamowaniu na Twitchu. Łatwy w obsłudze panel hosta i 
            interaktywne widoki dla graczy tworzą wciągające doświadczenie dla widzów.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
