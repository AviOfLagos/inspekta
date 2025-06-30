'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
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
    color: 'dark:text-white text-black bg-secondary hover:bg-secondary/80'
  },
  {
    id: 'client',
    label: 'Client',
    path: '/client',
    icon: Search,
    color: 'dark:text-black bg-primary hover:bg-primary/80'
  },
  {
    id: 'agent',
    label: 'Agent',
    path: '/agent',
    icon: Users,
    color: 'text-black bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600'
  },
  {
    id: 'inspector',
    label: 'Inspector',
    path: '/inspector',
    icon: UserCheck,
    color: 'bg-amber-600 hover:bg-amber-700 dark:text-black dark:bg-amber-500 dark:hover:bg-amber-600'
  },
  {
    id: 'admin',
    label: 'Admin',
    path: '/admin',
    icon: Shield,
    color: 'bg-violet-600 hover:bg-violet-700 dark:text-black dark:bg-violet-500 dark:hover:bg-violet-600'
  }
];

export function FloatingDevNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [isPlatformAdmin, setIsPlatformAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is platform admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const { user } = await response.json();
          setIsPlatformAdmin(user?.role === 'PLATFORM_ADMIN');
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  // Only show for platform admins (and in development mode for testing)
  if (isLoading) return null;
  if (!isPlatformAdmin && process.env.NODE_ENV === 'production') {
    return null;
  }

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="w-full max-w-[364] fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50" style={{ bottom: '40px' }}>
      <div className="w-full flex sm:flex-row gap-4 flex-col bg-background/90 backdrop-blur-sm border border-border rounded-xl shadow-lg px-4 py-4">
        <div className="w-full justify-between flex items-center space-x-2">
        
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
                  ${item.color} min-w-14 border-0 rounded-full
                  ${isActive ? 'ring-2 ring-ring ring-offset-2 ring-offset-background text-white' : 'text-white'}
                  transition-all duration-200 hover:scale-105
                `}
              >
                <IconComponent className="w-4 h-4 mr-1" />
                <div className='sm-flex hidden'>
                  {item.label}
                </div>
                
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}