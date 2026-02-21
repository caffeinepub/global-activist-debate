import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import SectionPage from './pages/SectionPage';
import ProfilePage from './pages/ProfilePage';
import MessagingPage from './pages/MessagingPage';
import RandomDebatePage from './pages/RandomDebatePage';
import ModeratorDashboard from './pages/ModeratorDashboard';
import ProfileSetupModal from './components/ProfileSetupModal';
import { SectionType } from './backend';

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const civilRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sections/civil',
  component: () => <SectionPage section={SectionType.civilDebate} />,
});

const aggressiveRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sections/aggressive',
  component: () => <SectionPage section={SectionType.aggressiveDebate} />,
});

const quotesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sections/quotes',
  component: () => <SectionPage section={SectionType.quotesPoems} />,
});

const randomRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sections/random',
  component: () => <SectionPage section={SectionType.randomDebates} />,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile/$userId',
  component: ProfilePage,
});

const messagesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/messages',
  component: MessagingPage,
});

const randomDebateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/random-debate',
  component: RandomDebatePage,
});

const moderatorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/moderator',
  component: ModeratorDashboard,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  civilRoute,
  aggressiveRoute,
  quotesRoute,
  randomRoute,
  profileRoute,
  messagesRoute,
  randomDebateRoute,
  moderatorRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RouterProvider router={router} />
      <ProfileSetupModal />
      <Toaster />
    </ThemeProvider>
  );
}
