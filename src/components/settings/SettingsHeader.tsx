
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, LogOut, Lock, Unlock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SettingsHeaderProps {
  showPasswordSettings: boolean;
  setShowPasswordSettings: (show: boolean) => void;
  handleLogout: () => void;
}

export const SettingsHeader = ({ 
  showPasswordSettings, 
  setShowPasswordSettings, 
  handleLogout 
}: SettingsHeaderProps) => {
  return (
    <div className="flex flex-wrap justify-between items-center mb-6">
      <div>
        <Link to="/" className="flex items-center text-gameshow-primary hover:underline">
          <ArrowLeft size={16} className="mr-1" />
          Powrót do strony głównej
        </Link>
        <h1 className="text-3xl font-bold text-gameshow-text mt-2">Panel Ustawień</h1>
      </div>
      
      <div className="flex space-x-2 mt-2 md:mt-0">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowPasswordSettings(!showPasswordSettings)}
          className="flex items-center gap-1"
        >
          {showPasswordSettings ? <Unlock size={16} /> : <Lock size={16} />}
          {showPasswordSettings ? 'Ukryj ustawienia haseł' : 'Pokaż ustawienia haseł'}
        </Button>
        
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
