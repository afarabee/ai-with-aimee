import { useState } from 'react';

const ADMIN_PASSWORD = 'AIMEEADMIN2025';
const STORAGE_KEY = 'admin_authenticated';

interface PasswordGateProps {
  children: React.ReactNode;
}

export default function PasswordGate({ children }: PasswordGateProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem(STORAGE_KEY) === 'true';
  });
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

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
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div 
        className="p-8 rounded-lg border-2 max-w-md w-full mx-4"
        style={{
          background: 'rgba(26, 11, 46, 0.9)',
          borderColor: 'hsl(var(--color-cyan) / 0.5)',
          boxShadow: '0 0 30px rgba(0, 255, 255, 0.2)',
        }}
      >
        <h1 
          className="text-2xl font-rajdhani font-bold mb-6 text-center"
          style={{ color: 'hsl(var(--color-cyan))' }}
        >
          🔐 Admin Access
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full p-3 rounded-md bg-background/50 border-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-cyan-400"
              style={{
                borderColor: 'hsl(var(--color-cyan) / 0.3)',
              }}
              autoFocus
            />
          </div>
          {error && (
            <p className="text-sm" style={{ color: 'hsl(var(--color-pink))' }}>
              {error}
            </p>
          )}
          <button
            type="submit"
            className="w-full p-3 rounded-md font-rajdhani font-semibold transition-all hover:shadow-lg"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--color-cyan)), hsl(var(--color-pink)))',
              color: 'hsl(var(--color-dark-bg))',
            }}
          >
            Enter Admin Panel
          </button>
        </form>
      </div>
    </div>
  );
}
