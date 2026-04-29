import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ClerkProvider, Show, useClerk } from "@clerk/react";
import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { publishableKeyFromHost } from "@clerk/react/internal";
import { shadcn } from "@clerk/themes";

// Layout & Context
import { AppLayout } from "@/components/layout/AppLayout";
import { RoleGuard } from "@/components/layout/RoleGuard";
import { LangProvider } from "@/lib/i18n";
import { queryClient } from "@/lib/queryClient";

// Pages
import Home from "@/pages/home";
import SignInPage from "@/pages/auth/sign-in";
import SignUpPage from "@/pages/auth/sign-up";
import Onboarding from "@/pages/onboarding";
import JobsPage from "@/pages/jobs";
import JobDetail from "@/pages/jobs/detail";
import NotFound from "@/pages/not-found";

// Role Pages
import SeekerDashboard from "@/pages/seeker/dashboard";
import SeekerApplications from "@/pages/seeker/applications";
import SeekerSavedJobs from "@/pages/seeker/saved";
import SeekerProfile from "@/pages/seeker/profile";

import EmployerDashboard from "@/pages/employer/dashboard";
import EmployerJobs from "@/pages/employer/jobs";
import EmployerNewJob from "@/pages/employer/job-new";
import EmployerJobDetail from "@/pages/employer/job-edit";

import AdminDashboard from "@/pages/admin/dashboard";
import AdminJobs from "@/pages/admin/jobs";
import AdminUsers from "@/pages/admin/users";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;

if (!clerkPubKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY in .env file");
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: "clerk",
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: "hsl(221 71% 40%)",
    fontFamily: "var(--app-font-sans)",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "bg-background rounded-2xl w-[440px] max-w-full overflow-hidden shadow-md border border-border/50",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none bg-muted/20",
  },
};

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const qc = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (
        prevUserIdRef.current !== undefined &&
        prevUserIdRef.current !== userId
      ) {
        qc.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, qc]);

  return null;
}

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

// Redirects authenticated users from "/" to their respective dashboards
function HomeRedirect() {
  return (
    <>
      <Show when="signed-in">
        {/* Onboarding component handles its own redirects based on DB state */}
        <Onboarding />
      </Show>
      <Show when="signed-out">
        <Home />
      </Show>
    </>
  );
}

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={HomeRedirect} />
        
        {/* Auth */}
        <Route path="/sign-in/*?" component={SignInPage} />
        <Route path="/sign-up/*?" component={SignUpPage} />
        
        {/* Public */}
        <Route path="/jobs" component={JobsPage} />
        <Route path="/jobs/:id" component={JobDetail} />
        
        {/* Onboarding */}
        <Route path="/onboarding">
          <Show when="signed-in">
            <Onboarding />
          </Show>
          <Show when="signed-out">
            <Redirect to="/sign-in" />
          </Show>
        </Route>

        {/* Seeker Routes */}
        <Route path="/seeker">
          <RoleGuard role="seeker"><SeekerDashboard /></RoleGuard>
        </Route>
        <Route path="/seeker/applications">
          <RoleGuard role="seeker"><SeekerApplications /></RoleGuard>
        </Route>
        <Route path="/seeker/saved">
          <RoleGuard role="seeker"><SeekerSavedJobs /></RoleGuard>
        </Route>
        <Route path="/seeker/profile">
          <RoleGuard role="seeker"><SeekerProfile /></RoleGuard>
        </Route>

        {/* Employer Routes */}
        <Route path="/employer">
          <RoleGuard role="employer"><EmployerDashboard /></RoleGuard>
        </Route>
        <Route path="/employer/jobs">
          <RoleGuard role="employer"><EmployerJobs /></RoleGuard>
        </Route>
        <Route path="/employer/jobs/new">
          <RoleGuard role="employer"><EmployerNewJob /></RoleGuard>
        </Route>
        <Route path="/employer/jobs/:id">
          <RoleGuard role="employer"><EmployerJobDetail /></RoleGuard>
        </Route>

        {/* Admin Routes */}
        <Route path="/admin">
          <RoleGuard role="admin"><AdminDashboard /></RoleGuard>
        </Route>
        <Route path="/admin/jobs">
          <RoleGuard role="admin"><AdminJobs /></RoleGuard>
        </Route>
        <Route path="/admin/users">
          <RoleGuard role="admin"><AdminUsers /></RoleGuard>
        </Route>

        {/* 404 */}
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LangProvider>
        <TooltipProvider>
          <ClerkProvider
            publishableKey={clerkPubKey}
            proxyUrl={clerkProxyUrl}
            appearance={clerkAppearance}
            signInUrl={`${basePath}/sign-in`}
            signUpUrl={`${basePath}/sign-up`}
            localization={{
              signIn: {
                start: {
                  title: "مرحباً بعودتك",
                  subtitle: "سجل دخولك للوصول إلى حسابك في فُرصة",
                },
              },
              signUp: {
                start: {
                  title: "إنشاء حساب جديد",
                  subtitle: "انضم إلى منصة فُرصة اليوم",
                },
              },
            }}
            // Provide a custom router implementation to sync Clerk with wouter
            routerPush={(to) => window.history.pushState(null, '', to)}
            routerReplace={(to) => window.history.replaceState(null, '', to)}
          >
            <ClerkQueryClientCacheInvalidator />
            <WouterRouter base={basePath}>
              <Router />
            </WouterRouter>
          </ClerkProvider>
          <Toaster richColors position="top-center" dir="rtl" />
        </TooltipProvider>
      </LangProvider>
    </QueryClientProvider>
  );
}