import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual authentication
    navigate("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-sm">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm text-foreground">
          E-mail
        </label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-background/50 border-gray-700"
          placeholder="Enter email"
          required
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm text-foreground">
          Password
        </label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-background/50 border-gray-700"
          placeholder="Enter password"
          required
        />
      </div>
      <div className="flex items-center justify-between">
        <a href="#" className="text-sm text-muted hover:text-primary">
          Forgot password?
        </a>
      </div>
      <Button type="submit" className="w-full">
        Login
      </Button>
    </form>
  );
};