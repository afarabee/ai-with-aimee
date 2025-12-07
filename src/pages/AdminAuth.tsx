import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import AboutBackground from '@/components/AboutBackground';
import { toast } from 'sonner';
import { z } from 'zod';

const authSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }).max(255),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }).max(72),
});

export default function AdminAuth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if already authenticated
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        checkAdminAndRedirect(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        checkAdminAndRedirect(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminAndRedirect = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .maybeSingle();

    if (data) {
      navigate('/admin', { replace: true });
    } else {
      setError('You do not have admin access. Please contact the site owner.');
      await supabase.auth.signOut();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate inputs
    const validation = authSchema.safeParse({ email, password });
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        toast.success('Signed in successfully');
      } else {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/admin`,
          },
        });
        if (error) throw error;
        toast.success('Account created! Please contact the site owner to get admin access.');
        setIsLogin(true);
      }
    } catch (err: any) {
      if (err.message === 'User already registered') {
        setError('This email is already registered. Please sign in instead.');
      } else if (err.message === 'Invalid login credentials') {
        setError('Invalid email or password.');
      } else {
        setError(err.message || 'An error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

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
            {isLogin ? 'Sign in to continue' : 'Create an account'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="bg-background/60 border-border text-foreground"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="bg-background/60 border-border text-foreground pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-destructive animate-pulse">{error}</p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full font-montserrat font-bold"
              style={{
                background: 'rgba(0, 255, 255, 0.2)',
                border: '2px solid hsl(var(--color-cyan))',
                color: 'hsl(var(--color-cyan))',
                boxShadow: '0 0 20px hsl(var(--color-cyan) / 0.4)',
              }}
            >
              {loading ? (
                'Please wait...'
              ) : isLogin ? (
                <>
                  <LogIn className="mr-2 h-4 w-4" /> Sign In
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" /> Sign Up
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-sm font-rajdhani transition-colors"
              style={{ color: 'hsl(var(--color-pink))' }}
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
