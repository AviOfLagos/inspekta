'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  ChevronRight, 
  Star, 
  Users, 
  Home, 
  CheckCircle,
  Zap,
  Shield,
  TrendingUp
} from 'lucide-react';

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  primaryCTA?: {
    text: string;
    href: string;
  };
  secondaryCTA?: {
    text: string;
    href: string;
  };
  stats?: Array<{
    label: string;
    value: string;
    icon: React.ComponentType<{ className?: string }>;
  }>;
  showFloatingElements?: boolean;
}

export function HeroSection({
  title = "Find Your Perfect Property",
  subtitle = "with Confidence",
  description = "Connect with verified agents, schedule professional inspections, and discover your dream property through our secure, transparent platform.",
  primaryCTA = { text: "Explore Properties", href: "/marketplace" },
  secondaryCTA = { text: "Watch Demo", href: "#demo" },
  stats = [
    { label: 'Properties Listed', value: '12,500+', icon: Home },
    { label: 'Verified Agents', value: '850+', icon: Users },
    { label: 'Inspections Done', value: '25,000+', icon: CheckCircle },
    { label: 'Happy Clients', value: '15,000+', icon: Star },
  ],
  showFloatingElements = true
}: HeroSectionProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/30 min-h-screen flex items-center">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_0)] bg-[size:24px_24px]"></div>
        
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/3 to-blue-500/3 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column - Content */}
          <div className={`lg:col-span-7 space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Badge */}
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="px-4 py-2 text-sm font-medium bg-primary/10 text-primary border-primary/20 hover:bg-primary/15 transition-colors">
                🚀 Nigeria&apos;s #1 Property Platform
              </Badge>
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-medium">4.9/5</span>
                <span>from 2,500+ reviews</span>
              </div>
            </div>

            {/* Main Title */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
                <span className="text-slate-900">{title}</span>
                <br />
                <span className="text-primary block mt-2">{subtitle}</span>
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-primary to-blue-500 rounded-full"></div>
            </div>

            {/* Description */}
            <p className="text-xl text-slate-600 max-w-2xl leading-relaxed">
              {description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={primaryCTA.href}>
                <Button size="lg" className="shadow-xl hover:shadow-2xl transition-all duration-300 group bg-primary hover:bg-primary/90 text-lg px-8 py-4">
                  {primaryCTA.text}
                  <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href={secondaryCTA.href}>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="shadow-lg hover:shadow-xl transition-all duration-300 group border-2 text-lg px-8 py-4 hover:bg-slate-50"
                >
                  <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  {secondaryCTA.text}
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-4">
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <Shield className="w-5 h-5 text-emerald-500" />
                <span>Bank-level security</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <CheckCircle className="w-5 h-5 text-blue-500" />
                <span>Verified properties</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <TrendingUp className="w-5 h-5 text-purple-500" />
                <span>AI-powered matching</span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="flex items-center justify-center mb-2">
                    <stat.icon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                  <div className="text-sm text-slate-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Visual Elements */}
          <div className={`lg:col-span-5 relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Main Card */}
            <div className="relative">
              {/* Property Card Mockup */}
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200/50 backdrop-blur-sm">
                <div className="aspect-[4/5] bg-gradient-to-br from-slate-100 to-slate-50 relative">
                  {/* Mock Property Image */}
                  <div className="absolute inset-4 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-2xl flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto">
                        <Home className="w-10 h-10 text-primary" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-slate-800">Property Discovery</h3>
                        <p className="text-slate-600 text-sm">AI-powered matching system</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Property Info Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-slate-800">Modern 3BR Apartment</h4>
                        <p className="text-sm text-slate-600">Victoria Island, Lagos</p>
                        <p className="text-lg font-bold text-primary mt-1">₦2,500,000</p>
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                        Verified
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              {showFloatingElements && (
                <>
                  <div className="absolute -top-6 -right-6 bg-primary text-primary-foreground rounded-2xl p-4 shadow-2xl animate-bounce">
                    <Zap className="w-8 h-8" />
                  </div>
                  <div className="absolute -bottom-6 -left-6 bg-emerald-500 text-white rounded-2xl p-4 shadow-2xl animate-pulse">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  
                  {/* Success Notification */}
                  <div className="absolute top-1/2 -right-12 bg-white rounded-xl shadow-xl p-4 border border-slate-200 animate-pulse">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                      <div className="text-sm">
                        <p className="font-medium text-slate-800">Property Matched!</p>
                        <p className="text-slate-600">3 new listings found</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}