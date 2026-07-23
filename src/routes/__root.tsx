import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
  useLocation,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { Toaster } from "@/components/ui/sonner";
import { WhatsAppFloating } from "@/components/WhatsAppFloating";

const fallbackQueryClient = new QueryClient();
const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID as string | undefined;
const META_PIXEL_ID_2 = import.meta.env.VITE_META_PIXEL_ID_2 as string | undefined;

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl">404</h1>
        <h2 className="mt-4 font-display text-2xl">Página não encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          O endereço solicitado não existe.
        </p>
        <Link to="/" className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Voltar ao início
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
      { title: "Pousada Ilha do Meio · Itacimirim, Bahia. Reserve pelo WhatsApp" },
      { name: "description", content: "Pousada em Itacimirim (BA), perto do mar, entre Guarajuba e Praia do Forte. Reserva direta com a casa, melhor tarifa garantida. Fale agora no WhatsApp." },
      { property: "og:title", content: "Pousada Ilha do Meio · Itacimirim, Bahia. Reserve pelo WhatsApp" },
      { name: "twitter:title", content: "Pousada Ilha do Meio · Itacimirim, Bahia. Reserve pelo WhatsApp" },
      { property: "og:description", content: "Pousada em Itacimirim (BA), perto do mar, entre Guarajuba e Praia do Forte. Reserva direta com a casa, melhor tarifa garantida. Fale agora no WhatsApp." },
      { name: "twitter:description", content: "Pousada em Itacimirim (BA), perto do mar, entre Guarajuba e Praia do Forte. Reserva direta com a casa, melhor tarifa garantida. Fale agora no WhatsApp." },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Pousada Ilha do Meio" },
      { property: "og:locale", content: "pt_BR" },
      { name: "theme-color", content: "#1a3c2a" },
      { property: "og:image", content: "https://pousadailhadomeio.com.br/og-image.webp" },
      { name: "twitter:image", content: "https://pousadailhadomeio.com.br/og-image.webp" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400&family=Inter:wght@300;400;500;600;700&display=swap",
      },
    ],
    scripts: [
      ...(META_PIXEL_ID
        ? [
            {
              children: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');${META_PIXEL_ID_2 ? `fbq('init','${META_PIXEL_ID_2}');` : ""}fbq('track','PageView');`,
            },
          ]
        : []),
      { src: "https://www.googletagmanager.com/gtag/js?id=G-JS7L2568BL", async: true },
      {
        children: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-JS7L2568BL');`,
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Pousada Ilha do Meio",
          url: "https://pousadailhadomeio.com.br",
          sameAs: [
            "https://www.instagram.com/pousadailhadomeio/",
            "https://www.booking.com/hotel/br/pousada-ilha-do-meio.pt-br.html",
          ],
          contactPoint: {
            "@type": "ContactPoint",
            telephone: "+55-71-9126-3096",
            contactType: "reservations",
            areaServed: "BR",
            availableLanguage: ["Portuguese"],
          },
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell(props?: { children?: ReactNode } | null) {
  const children = props?.children ?? null;
  return (
    <html lang="pt-BR">
      <head><HeadContent /></head>
      <body>
        {META_PIXEL_ID ? (
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              alt=""
              src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
            />
          </noscript>
        ) : null}
        {META_PIXEL_ID_2 ? (
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              alt=""
              src={`https://www.facebook.com/tr?id=${META_PIXEL_ID_2}&ev=PageView&noscript=1`}
            />
          </noscript>
        ) : null}
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const ctx = Route.useRouteContext() as { queryClient?: QueryClient } | undefined;
  const queryClient = ctx?.queryClient ?? fallbackQueryClient;
  const pathname = useLocation({ select: (loc) => loc.pathname });
  // /direcionamento já tem o próprio botão de WhatsApp em destaque na página
  // (link-in-bio do Instagram) — o flutuante ali só duplicaria, sem ajudar em nada.
  const showFloatingWhatsApp = pathname !== "/direcionamento";
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      {showFloatingWhatsApp && <WhatsAppFloating />}
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  );
}
