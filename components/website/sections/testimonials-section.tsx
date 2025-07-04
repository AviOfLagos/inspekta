'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Quote, ChevronLeft, ChevronRight, PlayCircle, MapPin } from 'lucide-react';

interface Testimonial {
  name: string;
  role: string;
  company?: string;
  image: string;
  content: string;
  rating: number;
  location: string;
  propertyType?: string;
  videoUrl?: string;
}

const testimonials: Testimonial[] = [
  {
    name: 'Sarah Johnson',
    role: 'Property Buyer',
    company: 'Tech Entrepreneur',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?w=150&h=150&fit=crop&crop=face',
    content: 'Inspekta transformed my property search completely. The virtual inspection feature saved me countless hours, and I found my dream home within just two weeks. The level of detail in their property reports is exceptional.',
    rating: 5,
    location: 'Victoria Island, Lagos',
    propertyType: '3BR Apartment',
    videoUrl: '#'
  },
  {
    name: 'Michael Chen',
    role: 'Real Estate Agent',
    company: 'Prime Properties Ltd',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    content: 'As an agent, Inspekta has revolutionized how I showcase properties. The platform is incredibly intuitive, and my clients love the transparency. I\'ve increased my closing rate by 40% since joining.',
    rating: 5,
    location: 'Ikoyi, Lagos',
    propertyType: 'Luxury Listings',
  },
  {
    name: 'Amara Okafor',
    role: 'Property Inspector',
    company: 'Certified Building Inspector',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    content: 'The inspection booking system is seamless and professional. I can manage my schedule efficiently and the quality standards Inspekta maintains have elevated the entire industry. Proud to be part of this platform.',
    rating: 5,
    location: 'Lekki, Lagos',
    propertyType: 'Residential & Commercial',
  },
  {
    name: 'David Williams',
    role: 'Investment Consultant',
    company: 'Williams Capital',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    content: 'For our real estate investment firm, Inspekta provides invaluable market insights and verified property data. The analytics dashboard helps us make informed decisions quickly and confidently.',
    rating: 5,
    location: 'Banana Island, Lagos',
    propertyType: 'Investment Properties',
  },
  {
    name: 'Jennifer Adebayo',
    role: 'First-time Buyer',
    company: 'Marketing Manager',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
    content: 'Being a first-time buyer was overwhelming until I found Inspekta. The educational resources, agent matching, and step-by-step guidance made the entire process stress-free and enjoyable.',
    rating: 5,
    location: 'Ajah, Lagos',
    propertyType: '2BR Apartment',
  }
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-rotation
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.03)_1px,transparent_0)] [background-size:32px_32px]"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <Badge variant="outline" className="mb-6 px-4 py-2 text-sm font-medium bg-white/10 text-white border-white/20">
            Client Success Stories
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            What Our Users Say About
            <span className="text-primary block">Their Experience</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Join thousands of satisfied clients, agents, and inspectors who have transformed their real estate journey
          </p>
        </div>

        {/* Main Testimonial Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          {/* Testimonial Content */}
          <div className="lg:col-span-7 space-y-8">
            {/* Quote Icon */}
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center">
                <Quote className="w-8 h-8 text-primary" />
              </div>
              <div className="flex items-center space-x-1">
                {[...Array(currentTestimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>

            {/* Testimonial Text */}
            <blockquote className="text-2xl md:text-3xl font-medium leading-relaxed text-slate-100">
              &ldquo;{currentTestimonial.content}&rdquo;
            </blockquote>

            {/* Author Info */}
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 rounded-2xl overflow-hidden ring-4 ring-white/10">
                <Image
                  src={currentTestimonial.image}
                  alt={currentTestimonial.name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white">{currentTestimonial.name}</h4>
                <p className="text-slate-300">{currentTestimonial.role}</p>
                {currentTestimonial.company && (
                  <p className="text-sm text-slate-400">{currentTestimonial.company}</p>
                )}
                <div className="flex items-center mt-2 text-sm text-slate-400">
                  <MapPin className="w-4 h-4 mr-2" />
                  {currentTestimonial.location}
                  {currentTestimonial.propertyType && (
                    <>
                      <span className="mx-2">•</span>
                      {currentTestimonial.propertyType}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Video CTA (if available) */}
            {currentTestimonial.videoUrl && (
              <Button 
                variant="outline" 
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300"
              >
                <PlayCircle className="w-5 h-5 mr-2" />
                Watch Full Story
              </Button>
            )}
          </div>

          {/* Visual Element */}
          <div className="lg:col-span-5">
            <div className="relative">
              {/* Decorative Frame */}
              <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-3xl p-8 backdrop-blur-sm border border-white/10">
                <div className="aspect-square bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-2xl flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-white/90 rounded-2xl flex items-center justify-center mx-auto">
                      <Star className="w-10 h-10 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-white">4.9/5 Rating</h3>
                      <p className="text-slate-300">From 2,500+ Reviews</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Stats */}
              <div className="absolute -top-4 -right-4 bg-primary rounded-xl p-4 shadow-2xl">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-foreground">15K+</div>
                  <div className="text-xs text-primary-foreground/80">Happy Clients</div>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-emerald-500 rounded-xl p-4 shadow-2xl">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">98%</div>
                  <div className="text-xs text-white/80">Success Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation & Indicators */}
        <div className="flex items-center justify-between">
          {/* Navigation Arrows */}
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={prevTestimonial}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 p-3"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={nextTestimonial}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 p-3"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Indicators */}
          <div className="flex items-center space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setIsAutoPlaying(false);
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-primary scale-125'
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>

          {/* Auto-play Toggle */}
          <div className="text-sm text-slate-400">
            {currentIndex + 1} of {testimonials.length}
          </div>
        </div>

        {/* Additional Testimonials Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 mb-4 italic">
                  &ldquo;{testimonial.content.slice(0, 120)}...&rdquo;
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm">{testimonial.name}</div>
                    <div className="text-xs text-slate-400">{testimonial.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}