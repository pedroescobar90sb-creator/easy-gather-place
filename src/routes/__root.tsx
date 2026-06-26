import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouterState,
  useNavigate,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { AppSidebar } from "@/components/AppSidebar";
import { BackBar } from "@/components/BackBar";
import { useApp } from "@/lib/store";
import { useSupabaseBootstrap } from "@/lib/useSupabaseBootstrap";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl">404</h1>
        <h2 className="mt-4 font-display text-2xl">Página não encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          O endereço solicitado não existe no sistema.
        </p>
        <Link to="/" className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Voltar ao dashboard
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error }: { error: Error }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl">Algo deu errado</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Pousada Ilha do Meio · Itacimirim, Bahia" },
      { name: "description", content: "Pousada boutique em Itacimirim — 17 quartos a 2 minutos do mar. Reserve direto e ganhe 10% off." },
      { property: "og:title", content: "Pousada Ilha do Meio · Itacimirim, Bahia" },
      { name: "twitter:title", content: "Pousada Ilha do Meio · Itacimirim, Bahia" },
      { property: "og:description", content: "Pousada boutique em Itacimirim — 17 quartos a 2 minutos do mar. Reserve direto e ganhe 10% off." },
      { name: "twitter:description", content: "Pousada boutique em Itacimirim — 17 quartos a 2 minutos do mar. Reserve direto e ganhe 10% off." },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Shell />
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  );
}

function Shell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isPublic = pathname === "/" || pathname === "/auth" || pathname.startsWith("/reservar");

  if (isPublic) {
    // Site público é 100% independente do sistema interno (sem store, sem bootstrap).
    return <Outlet />;
  }

  return <InternalShell />;
}

function InternalShell() {
  const navigate = useNavigate();
  const logout = useApp((s) => s.logout);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    let cancelled = false;
    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      if (!data.session) {
        logout();
        void navigate({ to: "/auth" });
      } else {
        setCheckingAuth(false);
      }
    });
    return () => { cancelled = true; };
  }, [logout, navigate]);

  useSupabaseBootstrap();

  if (checkingAuth) {
    return (
      <div className="min-h-screen grid place-items-center text-sm text-muted-foreground">
        Verificando acesso…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <AppSidebar />
      <main className="flex-1 min-w-0 overflow-x-hidden">
        <BackBar />
        <Outlet />
      </main>
    </div>
  );
}
