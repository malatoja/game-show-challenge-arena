
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SettingsHeaderProps {
  handleLogout: () => void;
}

export const SettingsHeader = ({ handleLogout }: SettingsHeaderProps) => {
  return (
    <div className="flex flex-wrap justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold text-gameshow-text">Panel Ustawień</h1>
        <p className="text-gameshow-muted mt-2">Zarządzaj wszystkimi aspektami teleturnieju</p>
      </div>
      
      <div className="flex space-x-2 mt-2 md:mt-0">
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="flex items-center gap-1"
        >
          <LogOut size={16} />
          Wyloguj
        </Button>
      </div>
    </div>
  );
};
