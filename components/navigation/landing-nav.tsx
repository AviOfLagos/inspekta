'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Building2, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';

export function LandingNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">Inspekta</span>
            </Link>
          </div>

          {/* Desktop navigation links */}
          <div className="hidden md:flex md:items-center md:ml-6">
            <div className="flex space-x-4">
              <Link href="/marketplace" className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Marketplace
              </Link>
              <Link href="/about" className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors">
                About Us
              </Link>
              <Link href="/contact" className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Contact
              </Link>
            </div>
          </div>

          {/* Sign In/Sign Up buttons */}
          <div className="hidden md:flex md:items-center md:ml-6 md:space-x-2">
            <ThemeToggle />
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

          {/* Mobile menu button */}
          <div className="-mr-2 flex items-center md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : ( 
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/marketplace" className="text-muted-foreground hover:bg-muted hover:text-foreground block px-3 py-2 rounded-md text-base font-medium transition-colors">
              Marketplace
            </Link>
            <Link href="/about" className="text-muted-foreground hover:bg-muted hover:text-foreground block px-3 py-2 rounded-md text-base font-medium transition-colors">
              About Us
            </Link>
            <Link href="/contact" className="text-muted-foreground hover:bg-muted hover:text-foreground block px-3 py-2 rounded-md text-base font-medium transition-colors">
              Contact
            </Link>
            <div className="border-t pt-4">
              <div className="px-3 py-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Theme</span>
                  <ThemeToggle />
                </div>
              </div>
              <Link href="/auth/signin" className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-muted transition-colors">
                Sign In
              </Link>
              <Link href="/auth/signup" className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-muted transition-colors">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
