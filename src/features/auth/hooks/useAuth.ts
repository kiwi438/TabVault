import { supabase } from "@/shared/lib/supabase";
import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = (email: string, pwd: string) =>
    supabase.auth.signInWithPassword({ email, password: pwd });
  const signUp = (email: string, pwd: string) =>
    supabase.auth.signUp({ email, password: pwd });
  const signOut = () => supabase.auth.signOut();

  return { user, loading, signIn, signUp, signOut };
};

export default useAuth;
