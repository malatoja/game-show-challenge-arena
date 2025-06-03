
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { LoginForm } from '@/components/auth/LoginForm';
import { authenticateSettings } from '@/lib/authService';

interface SettingsAuthProps {
  onLoginSuccess: () => void;
}

export const SettingsAuth = ({ onLoginSuccess }: SettingsAuthProps) => {
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (password: string) => {
    setIsLoading(true);
    setLoginError('');
    
    setTimeout(() => {
      const success = authenticateSettings(password);
      
      if (success) {
        onLoginSuccess();
      } else {
        setLoginError('Nieprawidłowe hasło');
      }
      
      setIsLoading(false);
    }, 500); // Simulate a delay for better UX
  };

  return (
    <div className="min-h-screen bg-gameshow-background flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center text-gameshow-primary mb-8 hover:underline">
          <ArrowLeft size={16} className="mr-1" />
          Powrót do strony głównej
        </Link>
        
        <LoginForm
          title="Panel Ustawień"
          onSubmit={handleLogin}
          loading={isLoading}
          error={loginError}
        />
      </div>
    </div>
  );
};
