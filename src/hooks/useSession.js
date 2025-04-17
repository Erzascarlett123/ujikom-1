import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function useSession() {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    // ambil session awal
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    // subscribe ke perubahan auth
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return session;
}

