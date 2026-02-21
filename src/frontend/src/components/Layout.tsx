import { Outlet, useNavigate } from '@tanstack/react-router';
import { Menu, MessageSquare, Shield, X } from 'lucide-react';
import { useState } from 'react';
import { SiFacebook, SiX, SiInstagram } from 'react-icons/si';
import LoginButton from './LoginButton';
import SectionNavigation from './SectionNavigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsAdmin } from '../hooks/useQueries';

export default function Layout() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: isAdmin } = useIsAdmin();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate({ to: '/' })}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <img src="/assets/generated/logo.dim_512x512.png" alt="Global Activist Debate" className="h-10 w-10" />
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-foreground">Global Activist Debate</h1>
                <p className="text-xs text-muted-foreground">Where ideas meet, opinions clash, and activists grow</p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            {isAuthenticated && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate({ to: '/messages' })}
                  className="gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  Messages
                </Button>
                {isAdmin && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate({ to: '/moderator' })}
                    className="gap-2"
                  >
                    <Shield className="h-4 w-4" />
                    Moderator
                  </Button>
                )}
              </>
            )}
            <LoginButton />
          </nav>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <div className="flex flex-col gap-4 mt-8">
                  {isAuthenticated && (
                    <>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          navigate({ to: '/messages' });
                          setMobileMenuOpen(false);
                        }}
                        className="justify-start gap-2"
                      >
                        <MessageSquare className="h-4 w-4" />
                        Messages
                      </Button>
                      {isAdmin && (
                        <Button
                          variant="ghost"
                          onClick={() => {
                            navigate({ to: '/moderator' });
                            setMobileMenuOpen(false);
                          }}
                          className="justify-start gap-2"
                        >
                          <Shield className="h-4 w-4" />
                          Moderator
                        </Button>
                      )}
                    </>
                  )}
                  <LoginButton />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Section Navigation */}
      <SectionNavigation />

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 mt-auto">
        <div className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-3">About</h3>
              <p className="text-sm text-muted-foreground">
                A safe online space where activists can debate ideas, share content, and connect globally.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Connect</h3>
              <div className="flex gap-4">
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <SiFacebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <SiX className="h-5 w-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <SiInstagram className="h-5 w-5" />
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Legal</h3>
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Global Activist Debate
              </p>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
            Built with love using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== 'undefined' ? window.location.hostname : 'global-activist-debate'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
