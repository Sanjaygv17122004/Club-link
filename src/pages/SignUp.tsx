import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "@/lib/api";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Eye, EyeOff, Check, X } from "lucide-react";

type UserRole = "user" | "moderator" | "admin";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user" as UserRole | ""
  });

  const passwordStrength = calculatePasswordStrength(formData.password);
  const passwordMatch = formData.password === formData.confirmPassword && formData.confirmPassword !== "";
  
  const navigate = useNavigate();
  const auth = useContext(AuthContext) as any;
  function calculatePasswordStrength(password: string) {
    if (!password) return { score: 0, requirements: [] };
    
    const requirements = [
      { test: password.length >= 8, text: "At least 8 characters" },
      { test: /[A-Z]/.test(password), text: "One uppercase letter" },
      { test: /[a-z]/.test(password), text: "One lowercase letter" },
      { test: /\d/.test(password), text: "One number" },
      { test: /[!@#$%^&*(),.?":{}|<>]/.test(password), text: "One special character" }
    ];

    const score = (requirements.filter(req => req.test).length / requirements.length) * 100;
    return { score, requirements };
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return;
    }
    (async () => {
      try {
        const res: any = await apiFetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: formData.fullName, email: formData.email, password: formData.password, role: formData.role || 'user' }),
        });
        const { token, user } = res;
        auth.setAuth(token, user);
        const path = user.role === 'moderator' ? '/dashboard/moderator' : '/dashboard/user';
        navigate(path);
      } catch (err: any) {
        const message = err?.body?.error || err?.message || 'Sign up failed';
        try { toast({ title: 'Sign up failed', description: message }); } catch (e) { alert(message); }
      }
    })();
  };

  return (
    <div className="min-h-screen bg-background hero-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <Card className="bg-card/95 backdrop-blur border-border">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto mb-4">
              <h1 className="text-3xl font-orbitron font-bold text-primary neon-text">
                ClubLink
              </h1>
            </div>
            <CardTitle className="text-2xl font-semibold">
              Create Account
            </CardTitle>
            <CardDescription>
              Join ClubLink and connect beyond limits
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="bg-background border-border focus:border-primary"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-background border-border focus:border-primary"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger className="bg-background border-border focus:border-primary">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="bg-background border-border focus:border-primary pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>

                {formData.password && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">Strength:</span>
                      <Progress 
                        value={passwordStrength.score} 
                        className="flex-1 h-2"
                      />
                      <span className="text-sm font-medium">
                        {passwordStrength.score < 40 ? "Weak" : 
                         passwordStrength.score < 80 ? "Good" : "Strong"}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {passwordStrength.requirements.map((req, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          {req.test ? (
                            <Check className="h-3 w-3 text-primary" />
                          ) : (
                            <X className="h-3 w-3 text-destructive" />
                          )}
                          <span className={req.test ? "text-primary" : "text-muted-foreground"}>
                            {req.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="bg-background border-border focus:border-primary pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {formData.confirmPassword && (
                  <div className="flex items-center space-x-2 text-sm">
                    {passwordMatch ? (
                      <>
                        <Check className="h-3 w-3 text-primary" />
                        <span className="text-primary">Passwords match</span>
                      </>
                    ) : (
                      <>
                        <X className="h-3 w-3 text-destructive" />
                        <span className="text-destructive">Passwords don't match</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full neon"
                size="lg"
                disabled={passwordStrength.score < 80 || !passwordMatch}
              >
                Sign Up
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link 
                  to="/signin" 
                  className="text-primary hover:text-primary/80 transition-colors font-medium-glow"
                >
                  Sign in
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;