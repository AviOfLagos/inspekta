'use client';

import { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Search, 
  Clock, 
  MapPin, 
  Smartphone,
  Eye,
  Users,
  BarChart3,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  benefits: string[];
  color: string;
  bgColor: string;
}

const features: Feature[] = [
  {
    icon: Shield,
    title: 'Verified Properties',
    description: 'Every property undergoes professional inspection and verification before listing.',
    benefits: ['Background checks on all agents', 'Property title verification', '360° virtual tours'],
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50'
  },
  {
    icon: Search,
    title: 'Smart Search',
    description: 'Find your perfect property with our AI-powered search and filtering system.',
    benefits: ['Location-based recommendations', 'Price range optimization', 'Lifestyle matching'],
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    icon: Clock,
    title: 'Quick Inspections',
    description: 'Schedule virtual or physical inspections within 24 hours of your request.',
    benefits: ['Same-day booking available', 'Professional inspectors', 'Detailed reports'],
    color: 'text-amber-600',
    bgColor: 'bg-amber-50'
  },
  {
    icon: MapPin,
    title: 'Prime Locations',
    description: 'Access properties in the most desirable locations across major cities.',
    benefits: ['Neighborhood insights', 'Transport accessibility', 'Amenity mapping'],
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    icon: Smartphone,
    title: 'Mobile First',
    description: 'Full-featured mobile app for property hunting on the go.',
    benefits: ['Offline property viewing', 'Push notifications', 'GPS-based search'],
    color: 'text-rose-600',
    bgColor: 'bg-rose-50'
  },
  {
    icon: BarChart3,
    title: 'Market Analytics',
    description: 'Data-driven insights to help you make informed property decisions.',
    benefits: ['Price trend analysis', 'Neighborhood reports', 'Investment forecasts'],
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50'
  }
];

export function FeaturesSection() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section ref={sectionRef} className="py-24 bg-gradient-to-b from-white to-slate-50/50 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <Badge variant="outline" className="mb-6 px-4 py-2 text-sm font-medium bg-primary/10 text-primary border-primary/20">
            Why Choose Inspekta
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            Everything You Need in 
            <span className="text-primary block">One Platform</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            From property discovery to final inspection, we&apos;ve revolutionized every step of the real estate journey
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className={`group cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
                hoveredFeature === index ? 'scale-105' : ''
              }`}
              onMouseEnter={() => setHoveredFeature(index)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <CardContent className="p-8 relative overflow-hidden">
                {/* Background Gradient */}
                <div className={`absolute inset-0 ${feature.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`w-8 h-8 ${feature.color}`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-slate-800 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Benefits List */}
                  <ul className="space-y-2 mb-6">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center text-sm text-slate-600">
                        <CheckCircle2 className={`w-4 h-4 mr-3 ${feature.color} flex-shrink-0`} />
                        {benefit}
                      </li>
                    ))}
                  </ul>

                  {/* Learn More Link */}
                  <Button 
                    variant="ghost" 
                    className={`p-0 h-auto font-medium ${feature.color} hover:bg-transparent group-hover:translate-x-1 transition-transform duration-300`}
                  >
                    Learn more
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="bg-white rounded-3xl shadow-xl p-12 border border-slate-200/50 max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <Eye className="w-8 h-8 text-primary mr-3" />
              <Badge className="bg-primary/10 text-primary px-4 py-2">
                See It In Action
              </Badge>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-4">
              Ready to Experience the Future of Real Estate?
            </h3>
            <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied clients who found their perfect homes through our innovative platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="shadow-lg hover:shadow-xl transition-all duration-300">
                Start Your Search
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" size="lg" className="shadow-lg hover:shadow-xl transition-all duration-300">
                <Users className="w-5 h-5 mr-2" />
                Book a Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}