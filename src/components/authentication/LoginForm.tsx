import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      navigate("/dashboard");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Authentication failed",
        description:
          error instanceof Error ? error.message : "Invalid credentials",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="flex flex-col h-screen" data-oid="3g_h.n3">
      <div className="flex justify-end p-4" data-oid="bq-jlmv">
        <ThemeToggle data-oid="e3ajq9s" />
      </div>

      <div
        className="flex flex-1 items-center justify-center px-6"
        data-oid="1khx9yw"
      >
        <div
          className="w-full max-w-md space-y-8 animate-fadeIn"
          data-oid="tr528q."
        >
          <div className="text-center" data-oid="vad56em">
            <h1
              className="text-3xl font-bold tracking-tight"
              data-oid="fuxwxfy"
            >
              Motors Stock Manager
            </h1>
            <p className="mt-2 text-muted-foreground" data-oid="i7j3bee">
              Sign in to your account to manage vehicle inventory
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
            data-oid=":w2c1dk"
          >
            <div className="space-y-4" data-oid="t.z486_">
              <div className="space-y-2" data-oid="p2ybs-d">
                <label
                  htmlFor="email"
                  className="text-sm font-medium"
                  data-oid="w8:01eh"
                >
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
                  data-oid="84c3jfa"
                />
              </div>

              <div className="space-y-2" data-oid="ry:nva0">
                <div
                  className="flex items-center justify-between"
                  data-oid="co9-9mm"
                >
                  <label
                    htmlFor="password"
                    className="text-sm font-medium"
                    data-oid="tt3qgt1"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-xs text-primary hover:underline"
                    onClick={() =>
                      alert(
                        "Password reset feature would be here in production",
                      )
                    }
                    data-oid=".8h3ium"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative" data-oid="ufsckj:">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                    className="h-11 pr-10"
                    data-oid="jpfv7o:"
                  />

                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                    data-oid="67do2tj"
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-4 w-4" data-oid="3pxnwxu" />
                    ) : (
                      <EyeIcon className="h-4 w-4" data-oid="mohq:v_" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-sm"
              disabled={isLoggingIn}
              data-oid="q76cf96"
            >
              {isLoggingIn ? (
                <>
                  <div
                    className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-background border-t-transparent"
                    data-oid="fl5jt75"
                  ></div>
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>

            <div
              className="mt-4 text-center text-sm text-muted-foreground"
              data-oid="z-r-q81"
            >
              <p data-oid="sep8d.b">
                For demo: use admin@motors.com or sales@motors.com with any 6+
                character password
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
