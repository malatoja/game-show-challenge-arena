
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EyeIcon, EyeOffIcon, KeyRound } from 'lucide-react';
import { motion } from 'framer-motion';

interface LoginFormProps {
  onSubmit: (password: string) => void;
  title: string;
  loading?: boolean;
  error?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  title,
  loading = false,
  error
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(password);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md mx-auto p-8 rounded-lg shadow-lg bg-gameshow-card"
    >
      <div className="flex flex-col items-center mb-6">
        <div className="w-16 h-16 bg-gameshow-primary/20 rounded-full flex items-center justify-center mb-4">
          <KeyRound className="text-gameshow-primary w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gameshow-text">{title}</h2>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gameshow-muted mb-2">
            Hasło
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Wprowadź hasło"
              className="pr-10 bg-gameshow-background text-gameshow-text border-gameshow-primary/30"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gameshow-muted hover:text-gameshow-text"
            >
              {showPassword ? (
                <EyeOffIcon className="h-4 w-4" />
              ) : (
                <EyeIcon className="h-4 w-4" />
              )}
            </button>
          </div>
          
          {error && (
            <p className="mt-2 text-sm text-red-500">{error}</p>
          )}
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-gameshow-primary hover:bg-gameshow-secondary"
          disabled={loading}
        >
          {loading ? 'Logowanie...' : 'Zaloguj się'}
        </Button>
      </form>
    </motion.div>
  );
};
