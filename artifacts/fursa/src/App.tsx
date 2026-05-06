import { HelmetProvider } from "react-helmet-async";
import { Switch, Route, Router as WouterRouter, Redirect, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ClerkProvider, Show, useClerk, useAuth } from "@clerk/react";
import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { shadcn } from "@clerk/themes";

import { setAuthTokenGetter } from "@workspace/api-client-react";

// Layout & Context
import { AppLayout } from "@/components/layout/AppLayout";
import { RoleGuard } from "@/components/layout/RoleGuard";
import { LangProvider, useLanguageStore } from "@/lib/i18n";
import { queryClient } from "@/lib/queryClient";

// Pages
import Home from "@/pages/home";
import SignInPage from "@/pages/auth/sign-in";
import SignUpPage from "@/pages/auth/sign-up";
import Onboarding from "@/pages/onboarding";
import JobsPage from "@/pages/jobs";
import JobDetail from "@/pages/jobs/detail";
import AboutPage from "@/pages/about";
import PrivacyPage from "@/pages/privacy";
import TermsPage from "@/pages/terms";
import NotFound from "@/pages/not-found";
import ContactPage from "@/pages/contact";
import FaqPage from "@/pages/faq";
import NotificationsPage from "@/pages/notifications";
import PublicEmployerProfile from "@/pages/employers";
import EmployersListPage from "@/pages/employers-list";

// Role Pages
import SeekerDashboard from "@/pages/seeker/dashboard";
import SeekerApplications from "@/pages/seeker/applications";
import SeekerSavedJobs from "@/pages/seeker/saved";
import SeekerProfile from "@/pages/seeker/profile";
import SeekerAlerts from "@/pages/seeker/alerts";
import SeekerCvBuilder from "@/pages/seeker/cv-builder";

import EmployerDashboard from "@/pages/employer/dashboard";
import EmployerJobs from "@/pages/employer/jobs";
import EmployerNewJob from "@/pages/employer/job-new";
import EmployerJobDetail from "@/pages/employer/job-edit";
import EmployerProfile from "@/pages/employer/profile";
import EmployerApplications from "@/pages/employer/applications";

import AdminDashboard from "@/pages/admin/dashboard";
import AdminJobs from "@/pages/admin/jobs";
import AdminUsers from "@/pages/admin/users";
import AdminProfile from "@/pages/admin/profile";
import MessagesPage from "@/pages/messages/index";
import MessageThread from "@/pages/messages/thread";
import PublicSeekerProfile from "@/pages/seekers/profile";
import DocsPage from "@/pages/docs";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string;

const isProduction = import.meta.env.PROD;
const clerkProxyUrl = (isProduction && import.meta.env.VITE_CLERK_PROXY_URL)
  ? (import.meta.env.VITE_CLERK_PROXY_URL as string)
  : undefined;

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
    formFieldInput: "border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus-visible:outline-none h-10 px-3 text-sm w-full transition-colors",
    formFieldLabel: "text-sm font-medium text-foreground mb-1.5",
    formFieldRow: "mb-4",
    formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-md h-10 w-full transition-colors",
  },
};

function ClerkAuthSetup() {
  const { getToken } = useAuth();
  useEffect(() => {
    setAuthTokenGetter(() => getToken());
    return () => { setAuthTokenGetter(null); };
  }, [getToken]);
  return null;
}

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
        if (userId === null) {
          qc.clear();
        } else if (prevUserIdRef.current === null) {
          setTimeout(() => qc.invalidateQueries(), 200);
        } else {
          qc.clear();
        }
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

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location]);
  return null;
}

function HomeRedirect() {
  return <Home />;
}

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      {/* Auth routes — no header/footer */}
      <Route path="/sign-in/*?">
        <AuthLayout><SignInPage /></AuthLayout>
      </Route>
      <Route path="/sign-up/*?">
        <AuthLayout><SignUpPage /></AuthLayout>
      </Route>

      {/* All other routes inside AppLayout */}
      <Route>
        <AppLayout>
          <Switch>
            <Route path="/" component={HomeRedirect} />

            {/* Public */}
            <Route path="/jobs" component={JobsPage} />
            <Route path="/jobs/:id" component={JobDetail} />
            <Route path="/about" component={AboutPage} />
            <Route path="/privacy" component={PrivacyPage} />
            <Route path="/terms" component={TermsPage} />
            <Route path="/contact" component={ContactPage} />
            <Route path="/faq" component={FaqPage} />
            <Route path="/employers" component={EmployersListPage} />
            <Route path="/employers/:id" component={PublicEmployerProfile} />

            {/* Notifications — any signed-in user */}
            <Route path="/notifications">
              <Show when="signed-in">
                <NotificationsPage />
              </Show>
              <Show when="signed-out">
                <Redirect to="/sign-in" />
              </Show>
            </Route>

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
            <Route path="/seeker/alerts">
              <RoleGuard role="seeker"><SeekerAlerts /></RoleGuard>
            </Route>
            <Route path="/seeker/cv-builder">
              <RoleGuard role="seeker"><SeekerCvBuilder /></RoleGuard>
            </Route>

            {/* Employer Routes — note: :id/applications MUST come before :id */}
            <Route path="/employer">
              <RoleGuard role="employer"><EmployerDashboard /></RoleGuard>
            </Route>
            <Route path="/employer/jobs">
              <RoleGuard role="employer"><EmployerJobs /></RoleGuard>
            </Route>
            <Route path="/employer/jobs/new">
              <RoleGuard role="employer"><EmployerNewJob /></RoleGuard>
            </Route>
            <Route path="/employer/jobs/:id/applications">
              <RoleGuard role="employer"><EmployerApplications /></RoleGuard>
            </Route>
            <Route path="/employer/jobs/:id">
              <RoleGuard role="employer"><EmployerJobDetail /></RoleGuard>
            </Route>
            <Route path="/employer/profile">
              <RoleGuard role="employer"><EmployerProfile /></RoleGuard>
            </Route>

            {/* Messages Routes — signed-in only */}
            <Route path="/messages">
              <Show when="signed-in">
                <MessagesPage />
              </Show>
              <Show when="signed-out">
                <Redirect to="/sign-in" />
              </Show>
            </Route>
            <Route path="/messages/:userId">
              <Show when="signed-in">
                <MessageThread />
              </Show>
              <Show when="signed-out">
                <Redirect to="/sign-in" />
              </Show>
            </Route>

            {/* Public Seeker Profile */}
            <Route path="/seekers/:id">
              <PublicSeekerProfile />
            </Route>

            {/* Docs / User Guide */}
            <Route path="/docs" component={DocsPage} />

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
            <Route path="/admin/profile">
              <RoleGuard role="admin"><AdminProfile /></RoleGuard>
            </Route>

            {/* 404 */}
            <Route component={NotFound} />
          </Switch>
        </AppLayout>
      </Route>
    </Switch>
  );
}

function ClerkAndRouter() {
  const lang = useLanguageStore((s) => s.lang);
  const localization =
    lang === "ar"
      ? {
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
        }
      : {
          signIn: {
            start: {
              title: "Welcome back",
              subtitle: "Sign in to access your Fursa account",
            },
          },
          signUp: {
            start: {
              title: "Create your account",
              subtitle: "Join Fursa today",
            },
          },
        };

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      {...(clerkProxyUrl ? { proxyUrl: clerkProxyUrl } : {})}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={localization}
      routerPush={(to) => window.history.pushState(null, "", to)}
      routerReplace={(to) => window.history.replaceState(null, "", to)} >
      <ClerkAuthSetup />
      <ClerkQueryClientCacheInvalidator />
      <WouterRouter base={basePath}>
        <ScrollToTop />
        <Router />
      </WouterRouter>
    </ClerkProvider>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <LangProvider>
          <TooltipProvider>
            <ClerkAndRouter />
            <Toaster richColors position="top-center" />
          </TooltipProvider>
        </LangProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}
