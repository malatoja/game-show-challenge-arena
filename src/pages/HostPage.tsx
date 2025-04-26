
import React, { useState, useEffect } from 'react';
import { GameProvider } from '@/context/GameContext';
import GameHostPanel from '@/components/host/GameHostPanel';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Settings, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { isHostAuthenticated, authenticateHost } from '@/lib/authService';
import { LoginForm } from '@/components/auth/LoginForm';

const HostPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    setIsAuthenticated(isHostAuthenticated());
  }, []);
  
  const handleLogin = (password: string) => {
    setIsLoading(true);
    setLoginError('');
    
    setTimeout(() => {
      const success = authenticateHost(password);
      
      if (success) {
        setIsAuthenticated(true);
      } else {
        setLoginError('Nieprawidłowe hasło');
      }
      
      setIsLoading(false);
    }, 500); // Simulate a delay for better UX
  };
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gameshow-background flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center text-gameshow-primary mb-8 hover:underline">
            <ArrowLeft size={16} className="mr-1" />
            Powrót do strony głównej
          </Link>
          
          <LoginForm
            title="Panel Hosta"
            onSubmit={handleLogin}
            loading={isLoading}
            error={loginError}
          />
        </div>
      </div>
    );
  }

  return (
    <GameProvider>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        <div className="absolute top-4 right-4 z-10">
          <Button asChild variant="outline">
            <Link to="/settings" className="flex items-center gap-2">
              <Settings size={16} />
              Ustawienia
            </Link>
          </Button>
        </div>
        <GameHostPanel />
      </motion.div>
    </GameProvider>
  );
};

export default HostPage;
