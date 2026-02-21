import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function SectionNavigation() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const sections = [
    { path: '/sections/civil', label: 'Civil Debate', icon: '/assets/generated/civil-icon.dim_128x128.png' },
    {
      path: '/sections/aggressive',
      label: 'Aggressive Debate',
      icon: '/assets/generated/aggressive-icon.dim_128x128.png',
    },
    { path: '/sections/quotes', label: 'Quotes & Poems', icon: '/assets/generated/quotes-icon.dim_128x128.png' },
    { path: '/sections/random', label: 'Random Debates', icon: '/assets/generated/random-icon.dim_128x128.png' },
  ];

  return (
    <div className="border-b bg-muted/20">
      <div className="container">
        <div className="flex overflow-x-auto py-2 gap-2 scrollbar-hide">
          {sections.map((section) => (
            <Button
              key={section.path}
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: section.path })}
              className={cn(
                'flex items-center gap-2 whitespace-nowrap',
                currentPath === section.path && 'bg-accent text-accent-foreground'
              )}
            >
              <img src={section.icon} alt={section.label} className="h-5 w-5" />
              <span className="hidden sm:inline">{section.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
