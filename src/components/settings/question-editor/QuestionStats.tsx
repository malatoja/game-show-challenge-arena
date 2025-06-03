
import React from 'react';

interface RoundStats {
  all: number;
  knowledge: number;
  speed: number;
  wheel: number;
  standard: number;
  used: number;
  favorite: number;
}

interface QuestionStatsProps {
  stats: RoundStats;
}

export function QuestionStats({ stats }: QuestionStatsProps) {
  return (
    <div className="bg-gameshow-card rounded-lg p-4 shadow-lg">
      <h3 className="text-xl font-semibold mb-4 text-gameshow-text">
        Statystyki pytań
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gameshow-background/50 p-3 rounded-md">
          <p className="text-sm text-gameshow-muted">Wszystkie pytania</p>
          <p className="text-2xl font-bold text-gameshow-text">{stats.all}</p>
        </div>
        
        <div className="bg-gameshow-background/50 p-3 rounded-md">
          <p className="text-sm text-gameshow-muted">Runda 1: Wiedza</p>
          <p className="text-2xl font-bold text-gameshow-text">{stats.knowledge}</p>
        </div>
        
        <div className="bg-gameshow-background/50 p-3 rounded-md">
          <p className="text-sm text-gameshow-muted">Runda 2: Szybka</p>
          <p className="text-2xl font-bold text-gameshow-text">{stats.speed}</p>
        </div>
        
        <div className="bg-gameshow-background/50 p-3 rounded-md">
          <p className="text-sm text-gameshow-muted">Runda 3: Koło</p>
          <p className="text-2xl font-bold text-gameshow-text">{stats.wheel}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="bg-gameshow-background/50 p-3 rounded-md">
          <p className="text-sm text-gameshow-muted">Standardowe</p>
          <p className="text-2xl font-bold text-gameshow-text">{stats.standard}</p>
        </div>
        
        <div className="bg-gameshow-background/50 p-3 rounded-md">
          <p className="text-sm text-gameshow-muted">Użyte pytania</p>
          <p className="text-2xl font-bold text-gameshow-text">{stats.used}</p>
        </div>
        
        <div className="bg-gameshow-background/50 p-3 rounded-md">
          <p className="text-sm text-gameshow-muted">Ulubione</p>
          <p className="text-2xl font-bold text-gameshow-text">{stats.favorite}</p>
        </div>
      </div>
    </div>
  );
}
