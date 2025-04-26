
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export const RolesTab = () => {
  const [users, setUsers] = useState([
    { id: 'user1', name: 'Admin', email: 'admin@example.com', role: 'admin' },
    { id: 'user2', name: 'Moderator', email: 'mod@example.com', role: 'moderator' },
    { id: 'user3', name: 'Prowadzący', email: 'host@example.com', role: 'host' },
    { id: 'user4', name: 'Obserwator', email: 'viewer@example.com', role: 'viewer' },
  ]);
  
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('host');
  
  const [logEntries] = useState([
    { id: 1, user: 'Admin', action: 'Dodano nową rundę: Koło Chaosu', timestamp: '2023-10-15 14:32' },
    { id: 2, user: 'Moderator', action: 'Dodano 5 nowych pytań', timestamp: '2023-10-15 14:45' },
    { id: 3, user: 'Admin', action: 'Zmieniono ustawienia kart', timestamp: '2023-10-15 15:10' },
    { id: 4, user: 'Prowadzący', action: 'Rozpoczęto rundę: Standardowa', timestamp: '2023-10-15 16:00' },
    { id: 5, user: 'System', action: 'Automatyczne zapisanie stanu gry', timestamp: '2023-10-15 16:30' },
  ]);

  const handleInviteUser = () => {
    if (!inviteEmail || !inviteEmail.includes('@')) {
      toast.error('Wprowadź prawidłowy adres e-mail');
      return;
    }
    
    // In a real implementation, this would send an invitation
    toast.success(`Wysłano zaproszenie do ${inviteEmail} z rolą: ${inviteRole}`);
    setInviteEmail('');
  };
  
  const handleChangeRole = (userId: string, newRole: string) => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        return { ...user, role: newRole };
      }
      return user;
    });
    
    setUsers(updatedUsers);
    toast.success('Zmieniono rolę użytkownika');
  };
  
  const handleRemoveUser = (userId: string) => {
    if (confirm('Czy na pewno chcesz usunąć tego użytkownika?')) {
      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
      toast.success('Usunięto użytkownika');
    }
  };
  
  const generateViewLink = () => {
    const baseUrl = window.location.origin;
    const token = Math.random().toString(36).substring(2, 15);
    const link = `${baseUrl}/player?mode=observer&token=${token}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(link);
    toast.success('Link do widoku tylko obserwacja skopiowany do schowka');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Role i dostępy</h2>
      <p className="text-gray-600 mb-6">
        Zarządzanie uprawnieniami i dostępem do systemu.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User management */}
        <div className="space-y-6">
          <div className="bg-gameshow-background/20 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-3">Zaproś użytkownika</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-1">E-mail</label>
                <Input
                  type="email"
                  placeholder="np. user@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm mb-1">Rola</label>
                <select
                  className="w-full p-2 rounded bg-gameshow-background text-gameshow-text"
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                >
                  <option value="host">Prowadzący</option>
                  <option value="moderator">Moderator</option>
                  <option value="viewer">Obserwator</option>
                </select>
              </div>
              
              <div className="pt-3">
                <Button onClick={handleInviteUser}>
                  Wyślij zaproszenie
                </Button>
              </div>
            </div>
          </div>
          
          <div className="bg-gameshow-background/20 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-3">Link dla obserwatora</h3>
            <p className="text-sm mb-3">
              Wygeneruj link tylko do podglądu (bez możliwości ingerencji).
            </p>
            <Button onClick={generateViewLink}>
              Wygeneruj link obserwatora
            </Button>
          </div>
          
          <div className="bg-gameshow-background/20 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-3">Opisy ról</h3>
            
            <div className="space-y-3 text-sm">
              <div>
                <h4 className="font-medium">Admin</h4>
                <p className="text-gray-500">Pełna kontrola nad systemem, ustawieniami i użytkownikami.</p>
              </div>
              
              <div>
                <h4 className="font-medium">Moderator</h4>
                <p className="text-gray-500">Zarządzanie pytaniami, kategoriami i ustawieniami gry.</p>
              </div>
              
              <div>
                <h4 className="font-medium">Prowadzący</h4>
                <p className="text-gray-500">Prowadzenie rozgrywki, wybór pytań i zarządzanie rundami.</p>
              </div>
              
              <div>
                <h4 className="font-medium">Obserwator</h4>
                <p className="text-gray-500">Tylko podgląd rozgrywki bez możliwości interakcji.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* User list and logs */}
        <div className="space-y-6">
          <div className="bg-gameshow-background/20 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-3">Użytkownicy</h3>
            
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {users.map(user => (
                <div 
                  key={user.id}
                  className="flex items-center justify-between p-3 bg-gameshow-background/20 rounded"
                >
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      className="p-1 text-sm rounded bg-gameshow-background"
                      value={user.role}
                      onChange={(e) => handleChangeRole(user.id, e.target.value)}
                    >
                      <option value="admin">Admin</option>
                      <option value="moderator">Moderator</option>
                      <option value="host">Prowadzący</option>
                      <option value="viewer">Obserwator</option>
                    </select>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleRemoveUser(user.id)}
                    >
                      Usuń
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gameshow-background/20 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-3">Logi zmian</h3>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {logEntries.map(entry => (
                <div
                  key={entry.id}
                  className="p-2 bg-gameshow-background/20 rounded text-sm"
                >
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{entry.user}</span>
                    <span className="text-xs text-gray-500">{entry.timestamp}</span>
                  </div>
                  <div>{entry.action}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gameshow-background/20 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-3">Ustawienia prywatności</h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="enableLogs" defaultChecked />
                <label htmlFor="enableLogs">
                  Rejestruj wszystkie działania użytkowników
                </label>
              </div>
              
              <div className="flex items-center gap-2">
                <input type="checkbox" id="showPlayerEmails" />
                <label htmlFor="showPlayerEmails">
                  Pokaż adresy e-mail graczy innym prowadzącym
                </label>
              </div>
              
              <div className="flex items-center gap-2">
                <input type="checkbox" id="allowObservers" defaultChecked />
                <label htmlFor="allowObservers">
                  Zezwalaj na dołączanie obserwatorów
                </label>
              </div>
              
              <div className="pt-3">
                <Button size="sm">
                  Zapisz ustawienia
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
