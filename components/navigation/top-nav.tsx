'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
import { ThemeToggle } from '@/components/theme-toggle';
import { NotificationBell } from '@/components/notifications/notification-bell';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: string[];
}

// Helper function to get dashboard URL based on user role
const getDashboardUrl = (userRole: string): string => {
  switch (userRole) {
    case 'CLIENT':
      return '/client';
    case 'AGENT':
      return '/agent';
    case 'INSPECTOR':
      return '/inspector';
    case 'COMPANY_ADMIN':
      return '/company';
    case 'PLATFORM_ADMIN':
      return '/admin';
    default:
      return '/marketplace';
  }
};

// Primary navigation - always shown in main nav bar
const primaryNavigation: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: Home, roles: ['AGENT', 'CLIENT', 'INSPECTOR', 'COMPANY_ADMIN', 'PLATFORM_ADMIN'] },
  { name: 'Marketplace', href: '/marketplace', icon: Building2, roles: ['CLIENT', 'AGENT', 'INSPECTOR'] },
  { name: 'Inspections', href: '/inspections', icon: Calendar, roles: ['INSPECTOR', 'CLIENT', 'AGENT'] },
];

// Secondary navigation - shown in profile dropdown
const secondaryNavigation: NavItem[] = [
  { name: 'My Listings', href: '/listings', icon: Building2, roles: ['AGENT', 'COMPANY_ADMIN'] },
  { name: 'Earnings', href: '/earnings', icon: DollarSign, roles: ['AGENT', 'INSPECTOR'] },
  { name: 'Admin Panel', href: '/admin', icon: Settings, roles: ['PLATFORM_ADMIN'] },
];

interface User {
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export function TopNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  // Fetch user session
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Filter navigation items based on user role
  const filteredPrimaryNav = primaryNavigation.filter(item => 
    !user || item.roles.includes(user.role)
  );
  
  const filteredSecondaryNav = secondaryNavigation.filter(item => 
    user && item.roles.includes(user.role)
  );

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      router.push('/auth/signin');
    } catch (error) {
      console.error('Error signing out:', error);
      router.push('/auth/signin');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/marketplace?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const isCurrentPage = (href: string) => {
    // For dynamic dashboard links, check if we're on the user's dashboard
    if (href && user && href === getDashboardUrl(user.role)) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  // Don't show navbar on public homepage
  if (pathname === '/') {
    return null;
  }

  // Show loading state
  if (isLoading) {
    return (
      <nav className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-foreground">Inspekta</span>
              </Link>
              
              {/* Desktop navigation skeleton */}
              <div className="hidden md:ml-8 md:flex md:space-x-1">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center px-3 py-2 rounded-md">
                    <div className="w-4 h-4 bg-gray-200 rounded animate-pulse mr-2"></div>
                    <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Search skeleton */}
              <div className="hidden md:flex w-64 h-9 bg-gray-200 rounded animate-pulse"></div>
              <ThemeToggle />
              <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="hidden md:block w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

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
                {filteredPrimaryNav.map((item) => {
                  const Icon = item.icon;
                  const href = item.href === '/dashboard' ? getDashboardUrl(user?.role || '') : item.href;
                  const current = isCurrentPage(href);
                  
                  return (
                    <Link
                      key={item.name}
                      href={href}
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
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="hidden md:flex">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search properties, locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 h-9 w-full bg-muted/50 border-muted-foreground/20 focus:bg-background focus:border-primary transition-colors"
                  />
                </div>
              </form>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Notifications */}
              {user && <NotificationBell />}

              {/* User menu */}
              {user ? (
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center space-x-2"
                  >
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                      {user.avatar ? (
                        <Image 
                          src={user.avatar} 
                          alt={user.name} 
                          className="w-full h-full object-cover rounded-full" 
                          width={32} 
                          height={32}
                        />
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                    </div>
                    <span className="hidden md:block text-sm font-medium">{user.name}</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>

                  {/* Profile dropdown */}
                  {profileMenuOpen && (
                    <Card className="absolute right-0 mt-2 w-64 shadow-lg z-50 animate-in slide-in-from-top-2 duration-200">
                      <div className="p-4 border-b">
                        <div className="text-sm font-medium text-foreground">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                        <div className="text-xs text-primary font-medium mt-1">{user.role}</div>
                      </div>
                      <div className="p-2">
                        {/* Role-specific navigation items */}
                        {filteredSecondaryNav.length > 0 && (
                          <>
                            {filteredSecondaryNav.map((item) => {
                              const Icon = item.icon;
                              return (
                                <Link
                                  key={item.name}
                                  href={item.href}
                                  className="flex items-center px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md"
                                >
                                  <Icon className="w-4 h-4 mr-3" />
                                  {item.name}
                                </Link>
                              );
                            })}
                            <div className="border-t my-2"></div>
                          </>
                        )}
                        
                        {/* Standard profile items */}
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
        <div className="md:hidden bg-background border-b border-border animate-in slide-in-from-top-2 duration-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="px-3 py-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search properties, locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 h-10 w-full bg-muted/50 border-muted-foreground/20 focus:bg-background focus:border-primary transition-colors"
                />
              </div>
            </form>
            {filteredPrimaryNav.map((item) => {
              const Icon = item.icon;
              const href = item.href === '/dashboard' ? getDashboardUrl(user?.role || '') : item.href;
              const current = isCurrentPage(href);
              
              return (
                <Link
                  key={item.name}
                  href={href}
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-all duration-200 active:scale-95 ${
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
            
            {/* Secondary navigation for mobile */}
            {user && filteredSecondaryNav.length > 0 && (
              <>
                <div className="border-t border-border my-2"></div>
                {filteredSecondaryNav.map((item) => {
                  const Icon = item.icon;
                  const current = isCurrentPage(item.href);
                  
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-all duration-200 active:scale-95 ${
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
              </>
            )}
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