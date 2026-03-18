import { useState } from "react";
import useAuth from "../hooks/useAuth";

export function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { signIn, signUp } = useAuth();

  // FormEvent deprecated
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { error } = isSignUp
      ? await signUp(email, password)
      : await signIn(email, password);

    if (error) setError(error.message);
  };

  return (
    <div className="px-4 font-sans antialiased min-h-screen bg-white flex items-center justify-center">
      <form
        className="max-w-sm w-full flex flex-col gap-3"
        onSubmit={(e) => handleSubmit(e)}
      >
        <h1 className="text-2xl font-bold tracking-tight">TabVault</h1>
        <input
          className="rounded-[10px] border border-neutral-300 px-4 py-2 outline-none focus:border-black transition-colors duration-150 text-sm placeholder:text-neutral-400"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          className="rounded-[10px] border border-neutral-300 px-4 py-2 outline-none focus:border-black transition-colors duration-150 text-sm placeholder:text-neutral-400"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button
          className="px-4 py-2 rounded-[10px] bg-black text-white text-sm font-medium hover:opacity-80 transition cursor-pointer"
          type="submit"
        >
          {isSignUp ? "Sign Up" : "Sign In"}
        </button>
        <button
          className="text-sm text-neutral-400 hover:text-neutral-600 transition cursor-pointer"
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp
            ? "Already have an account? Sign in"
            : "Don't have an account? Sign up"}
        </button>
        {error && <p className="text-sm text-red-600 text-center">{error}</p>}
      </form>
    </div>
  );
}
