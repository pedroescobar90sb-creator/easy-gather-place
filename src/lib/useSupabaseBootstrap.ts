import { useEffect } from "react";
import { supabase } from "./supabase/client";
import { useApp } from "./store";
import { fetchAll } from "./remote";

export function useSupabaseBootstrap() {
  const replaceAll = useApp((s) => s.replaceAll);
  const login = useApp((s) => s.login);
  const logout = useApp((s) => s.logout);

  useEffect(() => {
    let cancelled = false;

    const hydrate = async (email: string | null) => {
      if (!email) return;
      try {
        const data = await fetchAll();
        if (cancelled) return;
        // Only replace if Supabase actually returned content; otherwise keep seed
        if (data.rooms.length > 0) {
          replaceAll(data);
        }
      } catch (err) {
        console.error("[bootstrap] falha ao carregar dados do Supabase", err);
      }
    };

    supabase.auth.getSession().then(({ data }) => {
      const email = data.session?.user.email ?? null;
      if (email) {
        login(email);
        void hydrate(email);
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "INITIAL_SESSION") {
        const email = session?.user.email ?? null;
        if (email) {
          login(email);
          void hydrate(email);
        }
      }
      if (event === "SIGNED_OUT") {
        logout();
      }
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [replaceAll, login, logout]);
}
