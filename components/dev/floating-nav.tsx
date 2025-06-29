'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Home, 
  Search, 
  Shield,
  UserCheck
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const navItems: NavItem[] = [
  {
    id: 'public',
    label: 'Public',
    path: '/',
    icon: Home,
    color: 'bg-secondary hover:bg-secondary/80'
  },
  {
    id: 'client',
    label: 'Client',
    path: '/client',
    icon: Search,
    color: 'bg-primary hover:bg-primary/80'
  },
  {
    id: 'agent',
    label: 'Agent',
    path: '/agent',
    icon: Users,
    color: 'bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600'
  },
  {
    id: 'inspector',
    label: 'Inspector',
    path: '/inspector',
    icon: UserCheck,
    color: 'bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600'
  },
  {
    id: 'admin',
    label: 'Admin',
    path: '/admin',
    icon: Shield,
    color: 'bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600'
  }
];

export function FloatingDevNav() {
  const router = useRouter();
  const pathname = usePathname();

  // Only show in development mode
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50" style={{ bottom: '80px' }}>
      <div className="bg-background/90 backdrop-blur-sm border border-border rounded-full shadow-lg px-4 py-2">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-medium text-muted-foreground mr-2">DEV:</span>
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = pathname === item.path || 
                           (item.path !== '/' && pathname.startsWith(item.path));
            
            return (
              <Button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                size="sm"
                className={`
                  ${item.color} border-0 rounded-full
                  ${isActive ? 'ring-2 ring-ring ring-offset-2 ring-offset-background text-white' : 'text-white'}
                  transition-all duration-200 hover:scale-105
                `}
              >
                <IconComponent className="w-4 h-4 mr-1" />
                {item.label}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}