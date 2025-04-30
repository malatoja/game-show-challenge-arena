
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { updateHostPassword, updateSettingsPassword, getAuthSettings, authenticateSettings } from '@/lib/authService';

interface PasswordSettingsProps {
  hostPassword: string;
  settingsPassword: string;
  setHostPassword: (password: string) => void;
  setSettingsPassword: (password: string) => void;
}

export const PasswordSettings = ({
  hostPassword,
  settingsPassword,
  setHostPassword,
  setSettingsPassword
}: PasswordSettingsProps) => {
  
  const handleSaveHostPassword = () => {
    updateHostPassword(hostPassword || null);
    toast.success('Hasło hosta zostało zaktualizowane');
  };
  
  const handleSaveSettingsPassword = () => {
    updateSettingsPassword(settingsPassword || null);
    toast.success('Hasło ustawień zostało zaktualizowane');
    
    // Re-authenticate with new password if it was changed
    if (settingsPassword) {
      authenticateSettings(settingsPassword);
    }
  };
  
  return (
    <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-gameshow-card p-4 rounded-lg">
      <div>
        <h3 className="text-lg font-medium mb-3 text-gameshow-text">Hasło do panelu hosta</h3>
        <div className="space-y-3">
          <Input
            type="password"
            placeholder="Ustaw hasło hosta (pozostaw puste, aby wyłączyć)"
            value={hostPassword}
            onChange={(e) => setHostPassword(e.target.value)}
            className="bg-gameshow-background"
          />
          <Button onClick={handleSaveHostPassword}>Zapisz hasło hosta</Button>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-3 text-gameshow-text">Hasło do panelu ustawień</h3>
        <div className="space-y-3">
          <Input
            type="password"
            placeholder="Ustaw hasło ustawień (pozostaw puste, aby wyłączyć)"
            value={settingsPassword}
            onChange={(e) => setSettingsPassword(e.target.value)}
            className="bg-gameshow-background"
          />
          <Button onClick={handleSaveSettingsPassword}>Zapisz hasło ustawień</Button>
        </div>
      </div>
    </div>
  );
};
