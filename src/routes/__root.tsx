import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">Error</h1>
        <p className="mt-2 text-sm text-muted-foreground">{String(error)}</p>
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Try again
          </button>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#140c18" },
      { name: "monetag", content: "70d452a2e002b3e5f4e39b401c50ca91" },
      { title: "Vibra Worldwide – Your daily frequency" },
      {
        name: "description",
        content:
          "Vibra Worldwide is a vertical short-video feed for your moments: watch clips, upload your own, and vibe worldwide.",
      },
      { property: "og:title", content: "Vibra Worldwide – Your daily frequency" },
      {
        property: "og:description",
        content:
          "A vertical short-video feed for your moments: watch clips, upload your own, and vibe worldwide.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Space+Grotesk:wght@500;700&display=swap",
      },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "apple-touch-icon", href: "/pwa-192x192.png" },
      { rel: "manifest", href: "/manifest.webmanifest" },
    ],
    scripts: [
      {
        src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6181996899763561",
        async: true,
        crossOrigin: "anonymous",
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
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  useEffect(() => {
    // MONETAG DIRECT LINK YA VIBRA
    (window as any).openMonetag = () => {
      const last = localStorage.getItem('vibra_ad');
      const now = Date.now();
      if (!last || now - parseInt(last) > 30 * 60 * 1000) {
        window.open("https://uplcm.com/4/12154689", "_blank");
        localStorage.setItem('vibra_ad', now.toString());
      }
    };
  }, []);

  return (
    <QueryClientProvider client={Route.useRouteContext().queryClient}>
      <div className="min-h-screen flex flex-col">
        <div className="flex-1">
          <Outlet />
        </div>
        <footer className="bg-black border-t border-zinc-800 text-gray-500 text-xs text-center py-6">
          <div className="flex gap-4 justify-center mb-2">
            <Link to="/about" className="hover:text-white">About</Link>
            <Link to="/privacy" className="hover:text-white">Privacy</Link>
            <Link to="/contact" className="hover:text-white">Contact</Link>
          </div>
          <p>© 2026 Vibra Worldwide • Built in Faraja, Bamburi - Mombasa</p>
          <p className="mt-1">Email: vibra@hamadoski.com</p>
        </footer>
      </div>
    </QueryClientProvider>
  );
}
  
 
      
    
