
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please provide both email and password",
      });
      return;
    }
    
    setIsLoggingIn(true);
    
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Authentication failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };
  
  return (
    <div className="flex flex-col h-screen">
      <div className="flex justify-end p-4">
        <ThemeToggle />
      </div>
      
      <div className="flex flex-1 items-center justify-center px-6">
        <div className="w-full max-w-md space-y-8 animate-fadeIn">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">Motors Stock Manager</h1>
            <p className="mt-2 text-muted-foreground">
              Sign in to your account to manage vehicle inventory
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@motors.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  className="h-11"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-xs text-primary hover:underline"
                    onClick={() => alert("Password reset feature would be here in production")}
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                    className="h-11 pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            <Button
              type="submit"
              className="w-full h-11 text-sm"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
            
            <div className="mt-4 text-center text-sm text-muted-foreground">
              <p>For demo: use admin@motors.com or sales@motors.com with any 6+ character password</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
