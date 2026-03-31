import { AuthError, PostgrestError, type Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supabaseClient } from "../supabase-client";

export function useAuth() {
  const [Session, setSession] = useState<Session | null>(null);
  const [Loading, setLoading] = useState<boolean>(true);
  const [Error, setError] = useState<string>("");

  //Helper reset some states
  function resetSates() {
    setLoading(true);
    setError("");
  }

  // Helper function to set the error
  function SetError(error: PostgrestError | AuthError) {
    const msg = `Failed to fetch Session. Error message: ${error.message}`;
    console.error(msg);
    setError(msg);
    setLoading(false);
  }

  useEffect(() => {
    async function getSession() {
      resetSates();

      const { data, error: SessionError } =
        await supabaseClient.auth.getSession();

      if (SessionError) {
        SetError(SessionError);
        return;
      }
      setSession(data.session);
      setLoading(false);
    }

    getSession();

    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setLoading(false);
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  async function SignInWithPassword(username: string, password: string) {
    setLoading(true);

    const email = `${username}@learningcenter.com`;

    const { error: SignInError } = await supabaseClient.auth.signInWithPassword(
      {
        email,
        password,
      },
    );

    if (SignInError) {
      SetError(SignInError);
      return false;
    }

    setLoading(false);
    return true;
  }

  async function SignUp(username: string, password: string) {
    resetSates();

    const email = `${username}@learningcenter.com`;

    const { error: SignUpError, data } = await supabaseClient.auth.signUp(
      {
        email,
        password,
      },
    );

    if (SignUpError) {
      SetError(SignUpError);
    }
    
    return data;
  }

  async function SignOut() {
    resetSates();

    const { error: SignOutError } = await supabaseClient.auth.signOut();

    if (SignOutError) {
      SetError(SignOutError);
      return false;
    }
    return true;
  }

  return { Session, Error, Loading, SignInWithPassword, SignUp, SignOut };
}
