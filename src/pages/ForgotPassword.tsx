import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate sending reset link
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background hero-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <Link 
            to="/signin" 
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sign In
          </Link>
        </div>
        <Card className="bg-card/95 backdrop-blur border-border">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto mb-4">
              <h1 className="text-3xl font-orbitron font-bold text-primary">ClubLink</h1>
            </div>
            <CardTitle className="text-2xl font-semibold">
              Forgot Password
            </CardTitle>
            <CardDescription>
              Enter your email address and we'll send you a password reset link.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="text-center space-y-4">
                <div className="text-green-600 font-medium">A password reset link has been sent to your email.</div>
                <div className="text-sm text-muted-foreground">Please check your inbox and follow the instructions to reset your password.</div>
                <Link to="/signin" className="text-primary hover:underline">Back to Sign In</Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="bg-background border-border focus:border-primary"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" size="lg">
                  Send Reset Link
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
