import { useState } from 'react';
import { useAuth } from '@/lib/authContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { AlertCircle } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { signIn, signOut } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const getCurrentUserRole = async (): Promise<'admin' | 'user' | null> => {
    const { data: authData } = await supabase.auth.getUser();
    const authUser = authData.user;

    if (!authUser) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', authUser.id)
      .maybeSingle();

    return (profile?.role as 'admin' | 'user' | undefined) ?? null;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signIn(email, password);

      const role = await getCurrentUserRole();

      if (!role) {
        await signOut();
        setError('Unable to verify account role. Please try again.');
        return;
      }

      if (isAdmin && role !== 'admin') {
        await signOut();
        setError('These credentials are not for admin login.');
        return;
      }

      if (!isAdmin && role !== 'user') {
        await signOut();
        setError('These credentials are not for user login. Use Admin Login.');
        return;
      }

      window.location.href = role === 'admin' ? '/admin' : '/dashboard';
      
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md">
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-md">
              <AlertCircle className="w-4 h-4" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          {/* Role Toggle */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-md">
            <div>
              <p className="text-sm font-medium">
                {isAdmin ? '👤 Admin Mode' : '👥 User Mode'}
              </p>
              <p className="text-xs text-muted-foreground">
                {isAdmin ? 'Access admin panel' : 'Access user dashboard'}
              </p>
            </div>
            <Switch
              checked={isAdmin}
              onCheckedChange={setIsAdmin}
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Don't have an account?{' '}
            <a href="/auth/sign-up" className="text-blue-600 hover:underline">
              Sign up
            </a>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
