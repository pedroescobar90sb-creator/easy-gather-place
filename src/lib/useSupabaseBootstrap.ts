import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useApp } from "./store";
import { fetchAll, mapRoom } from "./remote";
import { toast } from "sonner";

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
    let realtimeChannel: ReturnType<typeof supabase.channel> | null = null;
    const knownReservationIds = new Set<string>();

    // PUBLIC: always hydrate rooms from Supabase so /reservar has real UUIDs.
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
        if (data.rooms.length > 0) {
          replaceAll(data);
          data.reservations.forEach((r: { id: string }) => knownReservationIds.add(r.id));
        }
      } catch (err) {
        console.error("[bootstrap] falha ao carregar dados do Supabase", err);
      }
    };

    const startRealtime = (email: string) => {
      if (realtimeChannel) return;
      realtimeChannel = supabase
        .channel("admin-sync")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "reservations" },
          (payload) => {
            const newRow = payload.new as { id?: string; code?: string; channel?: string } | null;
            void hydrate(email);
            if (payload.eventType === "INSERT" && newRow?.id && !knownReservationIds.has(newRow.id)) {
              knownReservationIds.add(newRow.id);
              const ch = newRow.channel ?? "site";
              toast.success(`Nova reserva (${ch}): ${newRow.code ?? "—"}`);
            }
          },
        )
        .on("postgres_changes", { event: "*", schema: "public", table: "guests" }, () => void hydrate(email))
        .on("postgres_changes", { event: "*", schema: "public", table: "room_blocks" }, () => void hydrate(email))
        .subscribe();
    };

    const stopRealtime = () => {
      if (realtimeChannel) {
        supabase.removeChannel(realtimeChannel);
        realtimeChannel = null;
      }
    };

    supabase.auth.getSession().then((res) => {
      const email = res?.data?.session?.user.email ?? null;
      if (email) {
        login(email);
        void hydrate(email).then(() => startRealtime(email));
      } else {
        logout();
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "INITIAL_SESSION") {
        const email = session?.user.email ?? null;
        if (email) {
          login(email);
          void hydrate(email).then(() => startRealtime(email));
        }
      }
      if (event === "SIGNED_OUT") {
        stopRealtime();
        logout();
      }
    });

    const onFocus = () => {
      const u = useApp.getState().session.user;
      if (u) void hydrate(u.name);
    };
    window.addEventListener("focus", onFocus);

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
      stopRealtime();
      window.removeEventListener("focus", onFocus);
    };
  }, [replaceAll, login, logout]);
}
