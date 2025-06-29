'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Home, 
  Building2, 
  Calendar, 
  DollarSign, 
  Search, 
  Bell, 
  Settings, 
  LogOut, 
  User,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import Image from 'next/image';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: string[];
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: Home, roles: ['AGENT', 'CLIENT', 'INSPECTOR', 'COMPANY_ADMIN'] },
  { name: 'Marketplace', href: '/marketplace', icon: Building2, roles: ['CLIENT', 'AGENT', 'INSPECTOR'] },
  { name: 'My Listings', href: '/listings', icon: Building2, roles: ['AGENT', 'COMPANY_ADMIN'] },
  { name: 'Inspections', href: '/inspections', icon: Calendar, roles: ['INSPECTOR', 'CLIENT', 'AGENT'] },
  { name: 'Earnings', href: '/earnings', icon: DollarSign, roles: ['AGENT', 'INSPECTOR'] },
  { name: 'Admin', href: '/admin', icon: Settings, roles: ['PLATFORM_ADMIN'] },
];

interface TopNavProps {
  user?: {
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
}

export function TopNav({ user }: TopNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Filter navigation items based on user role
  const filteredNavigation = navigation.filter(item => 
    !user || item.roles.includes(user.role)
  );

  const handleSignOut = () => {
    // Clear any stored user data and redirect to sign in
    router.push('/auth/signin');
  };

  const isCurrentPage = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/agent' || pathname === '/client' || pathname === '/inspector' || pathname === '/company';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and primary navigation */}
            <div className="flex items-center">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-foreground">Inspekta</span>
              </Link>

              {/* Desktop navigation */}
              <div className="hidden md:ml-8 md:flex md:space-x-1">
                {filteredNavigation.map((item) => {
                  const Icon = item.icon;
                  const current = isCurrentPage(item.href);
                  
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        current
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right side navigation */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <Button variant="ghost" size="sm" className="hidden md:flex">
                <Search className="w-4 h-4" />
              </Button>

              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
              </Button>

              {/* User menu */}
              {user ? (
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center space-x-2"
                  >
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      {user.avatar ? (
                        <Image src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" width={8} height={8}/>
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                    </div>
                    <span className="hidden md:block text-sm font-medium">{user.name}</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>

                  {/* Profile dropdown */}
                  {profileMenuOpen && (
                    <Card className="absolute right-0 mt-2 w-64 shadow-lg z-50">
                      <div className="p-4 border-b">
                        <div className="text-sm font-medium text-foreground">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                        <div className="text-xs text-primary font-medium mt-1">{user.role}</div>
                      </div>
                      <div className="p-2">
                        <Link href="/profile" className="flex items-center px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md">
                          <User className="w-4 h-4 mr-3" />
                          My Profile
                        </Link>
                        <Link href="/settings" className="flex items-center px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md">
                          <Settings className="w-4 h-4 mr-3" />
                          Settings
                        </Link>
                        <div className="border-t mt-2 pt-2">
                          <button
                            onClick={handleSignOut}
                            className="flex items-center w-full px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md"
                          >
                            <LogOut className="w-4 h-4 mr-3" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </Card>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link href="/auth/signin">
                    <Button variant="ghost" size="sm">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button size="sm">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-b border-border">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {filteredNavigation.map((item) => {
              const Icon = item.icon;
              const current = isCurrentPage(item.href);
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                    current
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {(profileMenuOpen || mobileMenuOpen) && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-25"
          onClick={() => {
            setProfileMenuOpen(false);
            setMobileMenuOpen(false);
          }}
        />
      )}
    </>
  );
}