import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useApp } from "./store";
import { fetchAll, mapRoom } from "./remote";

export async function refreshFromSupabase(authenticated: boolean) {
  try {
    const { data, error } = await supabase
      .from("rooms" as never)
      .select("*")
      .order("code");
    if (!error && data?.length) {
      useApp.setState({ rooms: data.map(mapRoom) });
    }
  } catch (err) {
    console.error("[refresh:rooms]", err);
  }
  if (!authenticated) return;
  try {
    const data = await fetchAll();
    if (data.rooms.length > 0) useApp.getState().replaceAll(data);
  } catch (err) {
    console.error("[refresh:full]", err);
  }
}


export function useSupabaseBootstrap() {
  const replaceAll = useApp((s) => s.replaceAll);
  const login = useApp((s) => s.login);
  const logout = useApp((s) => s.logout);

  useEffect(() => {
    let cancelled = false;

    // PUBLIC: always hydrate rooms from Supabase so /reservar has real UUIDs.
    // Drop any local seed reservations/blocks that reference stale room ids
    // (otherwise the admin pages render orphan rows like "QUARTO #· · pessoas").
    (async () => {
      try {
        const { data, error } = await supabase
          .from("rooms" as never)
          .select("*")
          .order("code");
        if (error) throw error;
        if (cancelled || !data?.length) return;
        const rooms = data.map(mapRoom);
        const validIds = new Set(rooms.map((r) => r.id));
        useApp.setState((s) => ({
          rooms,
          reservations: s.reservations.filter((r) => validIds.has(r.roomId)),
          blocks: s.blocks.filter((b) => validIds.has(b.roomId)),
        }));
      } catch (err) {
        console.error("[bootstrap:public] falha ao carregar quartos", err);
      }
    })();

    const hydrate = async (email: string | null) => {
      if (!email) return;
      try {
        const data = await fetchAll();
        if (cancelled) return;
        if (data.rooms.length > 0) replaceAll(data);
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
      if (event === "SIGNED_OUT") logout();
    });

    const onFocus = () => {
      const u = useApp.getState().session.user;
      if (u) void hydrate(u.name);

    };
    window.addEventListener("focus", onFocus);
    const interval = window.setInterval(onFocus, 20000);

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
      window.removeEventListener("focus", onFocus);
      window.clearInterval(interval);
    };
  }, [replaceAll, login, logout]);
}


