
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple validation
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    
    // For now, allow any login
    login(email, password);
    toast.success("Login successful!");
    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(30,64,175,0.15),rgba(0,0,0,0)_50%)]"></div>
      
      <div className="mb-8 flex items-center gap-4 z-10">
        <img
          src="/lovable-uploads/d7eb8650-e751-464c-83d1-5a89c3dd3b8e.png"
          alt="Hype Score Barometer Logo"
          className="h-14 w-14"
        />
        <div className="text-center">
          <h1 className="text-3xl font-bold">Hype Score Barometer</h1>
          <p className="text-lg text-muted-foreground">Where sentiment meets strategy.</p>
        </div>
      </div>
      
      <Card className="w-full max-w-md z-10">
        <CardHeader>
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Button type="button" variant="link" className="h-auto p-0 text-sm">
                  Forgot password?
                </Button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center">
          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Button variant="link" className="h-auto p-0" onClick={() => toast.info("Registration coming soon!")}>
              Sign up
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      <Button
        variant="ghost"
        className="mt-8 z-10"
        onClick={() => navigate("/")}
      >
        Back to Home
      </Button>
    </div>
  );
};

export default Login;
