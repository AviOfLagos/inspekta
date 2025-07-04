import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Shield, 
  Award, 
  Phone, 
  Mail, 
  Instagram, 
  Twitter, 
  Linkedin,
  MapPin,
  Clock,
  Star
} from 'lucide-react';

export function WebsiteFooter() {
  const currentYear = new Date().getFullYear();

  // Popular locations data
  const popularLocations = [
    "Victoria Island, Lagos",
    "Lekki Phase 1, Lagos", 
    "Ikoyi, Lagos",
    "Gbagada, Lagos",
    "Ikeja, Lagos",
    "Surulere, Lagos",
    "Abuja Central",
    "Maitama, Abuja"
  ];

  return (
    <footer className="bg-gradient-to-b from-primary/5 to-background text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] [background-size:32px_32px]"></div>
      
      <div className="relative">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            
            {/* Platform Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-white">Platform</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/marketplace" className="text-slate-300 hover:text-white transition-colors duration-200 flex items-center group">
                    Browse Properties
                    <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </Link>
                </li>
                <li>
                  <Link href="/auth/register?role=agent" className="text-slate-300 hover:text-white transition-colors duration-200 flex items-center group">
                    List Your Property
                    <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </Link>
                </li>
                <li>
                  <Link href="/auth/register?role=inspector" className="text-slate-300 hover:text-white transition-colors duration-200 flex items-center group">
                    Become an Inspector
                    <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-slate-300 hover:text-white transition-colors duration-200 flex items-center group">
                    Pricing Plans
                    <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="text-slate-300 hover:text-white transition-colors duration-200 flex items-center group">
                    API Documentation
                    <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-white">Company</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/about" className="text-slate-300 hover:text-white transition-colors duration-200 flex items-center group">
                    About Inspekta
                    <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-slate-300 hover:text-white transition-colors duration-200 flex items-center group">
                    Careers
                    <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-slate-300 hover:text-white transition-colors duration-200 flex items-center group">
                    Contact Us
                    <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-slate-300 hover:text-white transition-colors duration-200 flex items-center group">
                    Blog & News
                    <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </Link>
                </li>
                <li>
                  <Link href="/press" className="text-slate-300 hover:text-white transition-colors duration-200 flex items-center group">
                    Press Kit
                    <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Popular Locations */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-white">Popular Locations</h3>
              <ul className="space-y-4">
                {popularLocations.map((location, index) => (
                  <li key={index}>
                    <Link href={`/marketplace?location=${encodeURIComponent(location)}`} className="text-slate-300 hover:text-white transition-colors duration-200 flex items-center group">
                      {location}
                      <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support & Legal */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-white">Support</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/help" className="text-slate-300 hover:text-white transition-colors duration-200 flex items-center group">
                    Help Center
                    <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-slate-300 hover:text-white transition-colors duration-200 flex items-center group">
                    FAQ
                    <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-slate-300 hover:text-white transition-colors duration-200 flex items-center group">
                    Privacy Policy
                    <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-slate-300 hover:text-white transition-colors duration-200 flex items-center group">
                    Terms of Service
                    <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </Link>
                </li>
                <li>
                  <Link href="/security" className="text-slate-300 hover:text-white transition-colors duration-200 flex items-center group">
                    Security
                    <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Large Logo */}
        <div className="border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col items-center space-y-6">
              {/* Large Logo */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg">
                  <Home className="w-10 h-10 text-white" />
                </div>
                <span className="text-4xl font-bold">Inspekta</span>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                <Button size="sm" variant="ghost" className="p-3 text-slate-300 hover:text-white hover:bg-white/10">
                  <Twitter className="w-6 h-6" />
                </Button>
                <Button size="sm" variant="ghost" className="p-3 text-slate-300 hover:text-white hover:bg-white/10">
                  <Instagram className="w-6 h-6" />
                </Button>
                <Button size="sm" variant="ghost" className="p-3 text-slate-300 hover:text-white hover:bg-white/10">
                  <Linkedin className="w-6 h-6" />
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
                <span className="flex items-center">
                  <Shield className="w-4 h-4 mr-2 text-emerald-400" />
                  Verified & Secure Platform
                </span>
                <span className="flex items-center">
                  <Award className="w-4 h-4 mr-2 text-amber-400" />
                  Licensed Real Estate Agents
                </span>
                <span className="flex items-center">
                  <Star className="w-4 h-4 mr-2 text-amber-400" />
                  Rated 4.9/5
                </span>
              </div>

              {/* Copyright */}
              <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
                <p className="text-sm text-slate-400">
                  &copy; {currentYear} Inspekta. All rights reserved.
                </p>
                <Badge variant="outline" className="bg-slate-800 border-slate-700 text-slate-300">
                  🇳🇬 Made in Nigeria
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}