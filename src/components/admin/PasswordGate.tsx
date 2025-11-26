import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import AboutBackground from '@/components/AboutBackground';

interface PasswordGateProps {
  children: React.ReactNode;
}

const ADMIN_PASSWORD = 'AIMEEADMIN2025';
const STORAGE_KEY = 'adminAuthenticated';

export default function PasswordGate({ children }: PasswordGateProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem(STORAGE_KEY) === 'true';
    }
    return false;
  });
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, 'true');
      setIsAuthenticated(true);
      setError('');
      
      // Redirect to admin home if not already there
      if (location.pathname !== '/admin') {
        navigate('/admin', { replace: true });
      }
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
              <div className="relative w-full">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full rounded-md border-2 px-4 py-3 pr-12 font-ibm-plex text-base transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2"
                  style={{
                    background: 'rgba(26, 11, 46, 0.6)',
                    borderColor: error ? 'hsl(var(--color-pink))' : 'hsl(var(--color-cyan) / 0.3)',
                    color: 'hsl(var(--color-light-text))',
                    boxShadow: error 
                      ? '0 0 15px hsl(var(--color-pink) / 0.3)' 
                      : '0 0 10px hsl(var(--color-cyan) / 0.2)',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'hsl(var(--color-pink))';
                    e.currentTarget.style.boxShadow = '0 0 20px hsl(var(--color-pink) / 0.4)';
                  }}
                  onBlur={(e) => {
                    if (!error) {
                      e.currentTarget.style.borderColor = 'hsl(var(--color-cyan) / 0.3)';
                      e.currentTarget.style.boxShadow = '0 0 10px hsl(var(--color-cyan) / 0.2)';
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-all duration-250 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400 rounded p-1"
                  style={{
                    color: 'hsl(var(--color-cyan))',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'hsl(var(--color-pink))';
                    e.currentTarget.style.textShadow = '0 0 10px hsl(var(--color-pink) / 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'hsl(var(--color-cyan))';
                    e.currentTarget.style.textShadow = 'none';
                  }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
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
