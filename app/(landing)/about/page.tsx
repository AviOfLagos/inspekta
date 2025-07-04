import { WebsiteFooter } from '@/components/website/shared/website-footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { 
  Users, 
  Shield, 
  Lightbulb, 
  Heart,
  CheckCircle,
  TrendingUp,
  Award,
  ArrowRight 
} from 'lucide-react';

export default function AboutPage() {
  // Timeline milestones
  const milestones = [
    {
      year: "2024",
      title: "Platform Launch",
      description: "Inspekta launches with initial features for property listings and virtual inspections"
    },
    {
      year: "2024",
      title: "Agent Network Expansion", 
      description: "Onboarded first 50 verified agents and property companies across Lagos"
    },
    {
      year: "2024",
      title: "Technology Innovation",
      description: "Introduced AI-powered property matching and automated inspection scheduling"
    },
    {
      year: "2025",
      title: "National Expansion",
      description: "Expanding to serve property markets across Nigeria with enhanced features"
    }
  ];

  // Core values
  const values = [
    {
      icon: Shield,
      title: "Integrity",
      description: "We operate with the highest standards of honesty and transparency in every interaction."
    },
    {
      icon: Lightbulb,
      title: "Innovation", 
      description: "We're constantly pushing the boundaries of what's possible in real estate technology."
    },
    {
      icon: Heart,
      title: "Customer-Centricity",
      description: "Our users are at the heart of everything we do, guiding our decisions and improvements."
    }
  ];

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative bg-background py-20 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_0)] bg-[size:24px_24px]"></div>
            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-6">
                <span className="text-foreground">We're on a Mission to Make</span>
                <br />
                <span className="text-primary">Real Estate Safer and More Accessible</span>
                <br />
                <span className="text-foreground">for Everyone.</span>
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-primary to-blue-500 rounded-full mx-auto mb-8"></div>
              
              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                Inspekta is revolutionizing the Nigerian real estate market by creating a secure, transparent, 
                and efficient platform that connects verified properties with trusted professionals and serious buyers.
              </p>

              {/* Hero Image Container */}
              <div className="relative max-w-2xl mx-auto">
                <div className="bg-card rounded-3xl shadow-2xl overflow-hidden border border-border backdrop-blur-sm p-8">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                      <div className="text-2xl font-bold text-foreground">2,500+</div>
                      <div className="text-sm text-muted-foreground">Happy Users</div>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                        <Shield className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold text-foreground">850+</div>
                      <div className="text-sm text-muted-foreground">Verified Agents</div>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                        <CheckCircle className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div className="text-2xl font-bold text-foreground">12,500+</div>
                      <div className="text-sm text-muted-foreground">Properties Listed</div>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                        <TrendingUp className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="text-2xl font-bold text-foreground">25,000+</div>
                      <div className="text-sm text-muted-foreground">Inspections Done</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-foreground mb-4">Our Story</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                From a simple idea to Nigeria's most trusted property platform
              </p>
            </div>

            {/* Timeline */}
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary to-blue-500 rounded-full hidden md:block"></div>
              
              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <div key={index} className={`flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} flex-col md:space-x-8`}>
                    {/* Content */}
                    <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'} text-center md:text-left`}>
                      <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="text-2xl font-bold text-primary mb-2">{milestone.year}</div>
                        <h3 className="text-xl font-semibold text-foreground mb-3">{milestone.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{milestone.description}</p>
                      </Card>
                    </div>
                    
                    {/* Timeline Dot */}
                    <div className="hidden md:flex w-6 h-6 bg-primary rounded-full border-4 border-background shadow-lg z-10"></div>
                    
                    {/* Spacer */}
                    <div className="flex-1 hidden md:block"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-foreground mb-4">Our Values</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                The principles that guide everything we do at Inspekta
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="p-8 text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <value.icon className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold text-foreground mb-4">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Statement Section */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-primary/5 to-blue-500/5 rounded-3xl p-12 text-center">
              <div className="max-w-4xl mx-auto">
                <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center mx-auto mb-8">
                  <Award className="w-10 h-10 text-primary-foreground" />
                </div>
                
                <h2 className="text-4xl font-bold text-foreground mb-6">Our Mission</h2>
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  To revolutionize the Nigerian real estate market by providing a secure, transparent, and efficient platform 
                  that eliminates fraud, reduces time wastage, and creates meaningful connections between property seekers, 
                  verified agents, and trusted inspectors.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-primary">80%</div>
                    <p className="text-sm text-muted-foreground">Virtual inspections by 2025</p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-primary">90%+</div>
                    <p className="text-sm text-muted-foreground">Verified listings</p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-primary">50+</div>
                    <p className="text-sm text-muted-foreground">Companies by 2025</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/auth/register">
                    <Button size="lg" className="px-8">
                      Join Our Mission
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button size="lg" variant="outline" className="px-8">
                      Get in Touch
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}