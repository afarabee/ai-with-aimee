import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AboutBackground from '@/components/AboutBackground';

interface PasswordGateProps {
  children: React.ReactNode;
}

const ADMIN_PASSWORD = 'AIMEEADMIN2025';
const STORAGE_KEY = 'adminAuthenticated';

export default function PasswordGate({ children }: PasswordGateProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, 'true');
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <AboutBackground />
      <div className="relative z-10 w-full max-w-md px-6">
        <div
          className="p-8 rounded-xl backdrop-blur-md"
          style={{
            background: 'rgba(26, 11, 46, 0.8)',
            border: '2px solid hsl(var(--color-cyan) / 0.4)',
            boxShadow: '0 0 30px hsl(var(--color-cyan) / 0.3)',
          }}
        >
          <h1
            className="text-3xl font-montserrat font-bold text-center mb-2"
            style={{ color: 'hsl(var(--color-cyan))' }}
          >
            Admin Access
          </h1>
          <p
            className="text-center mb-8 font-rajdhani"
            style={{ color: 'hsl(var(--color-light-text))' }}
          >
            Enter password to continue
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full"
                style={{
                  background: 'rgba(26, 11, 46, 0.6)',
                  borderColor: error ? 'hsl(var(--color-pink))' : 'hsl(var(--color-cyan) / 0.3)',
                  color: 'hsl(var(--color-light-text))',
                }}
              />
              {error && (
                <p
                  className="mt-2 text-sm font-rajdhani animate-pulse"
                  style={{ color: 'hsl(var(--color-pink))' }}
                >
                  {error}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full font-montserrat font-bold transition-all"
              style={{
                background: 'rgba(0, 255, 255, 0.2)',
                border: '2px solid hsl(var(--color-cyan))',
                color: 'hsl(var(--color-cyan))',
                boxShadow: '0 0 20px hsl(var(--color-cyan) / 0.4)',
              }}
            >
              Enter
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
