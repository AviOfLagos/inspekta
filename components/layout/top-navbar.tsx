'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';
import { 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  CreditCard,
  Edit,
  Crown,
  ChevronDown,
  Search,
  Home
} from 'lucide-react';

interface MockUser {
  name: string;
  email: string;
  role: string;
  avatar?: string;
  company?: string;
  subscription?: string;
}

// Mock user data - in real app, get from auth context
const getMockUser = (pathname: string): MockUser => {
  if (pathname.startsWith('/admin')) {
    return {
      name: 'Admin User',
      email: 'admin@inspekta.com',
      role: 'Platform Admin',
      subscription: 'Platform Access'
    };
  } else if (pathname.startsWith('/agent')) {
    return {
      name: 'John Doe',
      email: 'john@lagosproperties.com',
      role: 'Real Estate Agent',
      company: 'Lagos Properties Ltd',
      subscription: 'Company Plan'
    };
  } else if (pathname.startsWith('/inspector')) {
    return {
      name: 'Sarah Wilson',
      email: 'sarah@inspekta.com',
      role: 'Property Inspector',
      subscription: 'Inspector Monthly'
    };
  } else if (pathname.startsWith('/client')) {
    return {
      name: 'Michael Chen',
      email: 'michael@example.com',
      role: 'Client',
      subscription: 'Free'
    };
  }
  
  return {
    name: 'Guest User',
    email: 'guest@example.com',
    role: 'Visitor',
    subscription: 'None'
  };
};

export function TopNavbar() {
  const [notificationCount] = useState(3); // Mock notification count
  const router = useRouter();
  const pathname = usePathname();
  const user = getMockUser(pathname);

  const handleLogout = () => {
    console.log('Logging out...');
    // In real app, handle logout logic
    router.push('/');
  };

  const handleMenuClick = (action: string) => {
    console.log(`${action} clicked`);
    // In real app, handle menu actions
  };

  // Don't show navbar on public homepage
  if (pathname === '/') {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left side - Logo and platform name */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">Inspekta</span>
            </Link>
            
            {/* Breadcrumb indicator */}
            <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
              <span>/</span>
              <span className="capitalize">{pathname.split('/')[1] || 'home'}</span>
            </div>
          </div>

          {/* Right side - Search, Notifications, Theme, Profile */}
          <div className="flex items-center space-x-4">
            {/* Quick search - only show on dashboard pages */}
            {pathname !== '/' && (
              <Button variant="outline" size="sm" className="hidden md:flex">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            )}

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Notifications */}
            <div className="relative">
              <Button variant="ghost" size="sm">
                <Bell className="w-5 h-5" />
                {notificationCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                    {notificationCount}
                  </Badge>
                )}
              </Button>
            </div>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 px-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium">{user.name}</div>
                    <div className="text-xs text-muted-foreground">{user.role}</div>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                    {user.company && (
                      <p className="text-xs text-primary">{user.company}</p>
                    )}
                  </div>
                </DropdownMenuLabel>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={() => handleMenuClick('edit-profile')}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={() => handleMenuClick('settings')}>
                  <Settings className="w-4 h-4 mr-2" />
                  Account Settings
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={() => handleMenuClick('subscription')}>
                  <Crown className="w-4 h-4 mr-2" />
                  <div className="flex items-center justify-between w-full">
                    <span>Subscription</span>
                    <Badge variant="outline" className="text-xs">
                      {user.subscription}
                    </Badge>
                  </div>
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={() => handleMenuClick('billing')}>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Billing & Payments
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}