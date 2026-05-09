import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Session } from '@supabase/supabase-js';

interface PasswordGateProps {
  children: React.ReactNode;
}

export default function PasswordGate({ children }: PasswordGateProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [checking, setChecking] = useState(true);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Check admin role for current user
  const verifyAdmin = async (uid: string | undefined) => {
    if (!uid) {
      setIsAdmin(false);
      return;
    }
    const { data, error: roleErr } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', uid)
      .eq('role', 'admin')
      .maybeSingle();
    if (roleErr) {
      setIsAdmin(false);
      return;
    }
    setIsAdmin(!!data);
  };

  useEffect(() => {
    // Set up listener FIRST
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      // defer Supabase calls
      setTimeout(() => verifyAdmin(sess?.user?.id), 0);
    });

    // Then load current session
    supabase.auth.getSession().then(({ data: { session: sess } }) => {
      setSession(sess);
      verifyAdmin(sess?.user?.id).finally(() => setChecking(false));
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (mode === 'signin') {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
      } else {
        const { error: err } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (err) throw err;
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setIsAdmin(false);
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p style={{ color: 'hsl(var(--color-cyan))' }}>Loading…</p>
      </div>
    );
  }

  if (session && isAdmin) {
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

        {session && !isAdmin ? (
          <div className="space-y-4">
            <p className="text-sm text-foreground">
              Signed in as <strong>{session.user.email}</strong>, but this account does not have admin
              access.
            </p>
            <button
              onClick={handleSignOut}
              className="w-full p-3 rounded-md font-rajdhani font-semibold transition-all hover:shadow-lg"
              style={{
                background: 'linear-gradient(135deg, hsl(var(--color-cyan)), hsl(var(--color-pink)))',
                color: 'hsl(var(--color-dark-bg))',
              }}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full p-3 rounded-md bg-background/50 border-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-cyan-400"
              style={{ borderColor: 'hsl(var(--color-cyan) / 0.3)' }}
              autoFocus
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              minLength={6}
              className="w-full p-3 rounded-md bg-background/50 border-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-cyan-400"
              style={{ borderColor: 'hsl(var(--color-cyan) / 0.3)' }}
            />
            {error && (
              <p className="text-sm" style={{ color: 'hsl(var(--color-pink))' }}>
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="w-full p-3 rounded-md font-rajdhani font-semibold transition-all hover:shadow-lg disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, hsl(var(--color-cyan)), hsl(var(--color-pink)))',
                color: 'hsl(var(--color-dark-bg))',
              }}
            >
              {submitting ? '…' : mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'signin' ? 'signup' : 'signin');
                setError('');
              }}
              className="w-full text-sm text-muted-foreground hover:text-foreground"
            >
              {mode === 'signin'
                ? "First time? Create your admin account"
                : 'Already have an account? Sign in'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
