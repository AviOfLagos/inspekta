import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  ArrowRight, 
  Play, 
  Star, 
  Shield, 
  CheckCircle, 
  Home, 
  Calendar, 
  Users,
  MapPin,
  TrendingUp,
  Zap,
  Clock,
  Award,
  Phone
} from 'lucide-react';

export default async function HomePage() {
  // Mock data for featured properties
  const featuredProperties = [
    {
      id: 1,
      title: "Modern 3BR Apartment",
      location: "Victoria Island, Lagos",
      price: "₦2,500,000",
      image: "/api/placeholder/400/300",
      verified: true,
      type: "Apartment"
    },
    {
      id: 2,
      title: "Executive 4BR Duplex",
      location: "Lekki Phase 1, Lagos",
      price: "₦4,200,000",
      image: "/api/placeholder/400/300",
      verified: true,
      type: "Duplex"
    },
    {
      id: 3,
      title: "Luxury 2BR Penthouse",
      location: "Ikoyi, Lagos",
      price: "₦3,800,000",
      image: "/api/placeholder/400/300",
      verified: true,
      type: "Penthouse"
    }
  ];

  // Mock testimonials data
  const testimonials = [
    {
      name: "Adebayo Johnson",
      role: "Property Buyer",
      image: "/api/placeholder/80/80",
      rating: 5,
      text: "Inspekta made my property search so much easier. The virtual inspection saved me time and the verification process gave me confidence."
    },
    {
      name: "Sarah Okafor",
      role: "Real Estate Agent",
      image: "/api/placeholder/80/80",
      rating: 5,
      text: "As an agent, I love how Inspekta helps me connect with serious buyers. The platform is professional and efficient."
    },
    {
      name: "Michael Ibrahim",
      role: "Property Inspector",
      image: "/api/placeholder/80/80",
      rating: 5,
      text: "The inspection booking system is seamless. I can manage my schedule and get paid promptly. Excellent platform!"
    }
  ];

  return (
    <>
      <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-background min-h-screen flex items-center overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_0)] bg-[size:24px_24px]"></div>
          <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="lg:col-span-7 space-y-8">
              <div className="flex items-center space-x-4">
                <Badge variant="secondary" className="px-4 py-2 text-sm font-medium bg-primary/10 text-primary border-primary/20">
                  🏠 Nigeria's Most Trusted Property Platform
                </Badge>
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-medium">4.9/5</span>
                  <span>from 2,500+ reviews</span>
                </div>
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight">
                  <span className="text-foreground">Verified Properties,</span>
                  <br />
                  <span className="text-foreground">Secure Inspections.</span>
                  <br />
                  <span className="text-primary">Your Trusted Real Estate Partner.</span>
                </h1>
                <div className="w-24 h-1 bg-gradient-to-r from-primary to-blue-500 rounded-full"></div>
              </div>

              <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                Inspekta simplifies your property search with a secure, transparent, and convenient platform for remote and in-person inspections.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/marketplace">
                  <Button size="lg" className="shadow-xl hover:shadow-2xl transition-all duration-300 group text-lg px-8 py-4">
                    Browse Properties
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="shadow-lg hover:shadow-xl transition-all duration-300 group border-2 text-lg px-8 py-4"
                >
                  <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  How it Works
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Shield className="w-5 h-5 text-emerald-500" />
                  <span>Bank-level security</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                  <span>Verified properties</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <TrendingUp className="w-5 h-5 text-purple-500" />
                  <span>AI-powered matching</span>
                </div>
              </div>
            </div>

            {/* Right Column - Hero Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative">
                <div className="bg-card rounded-3xl shadow-2xl overflow-hidden border border-border backdrop-blur-sm">
                  <div className="aspect-[4/5] bg-gradient-to-br from-muted/50 to-muted relative">
                    <div className="absolute inset-4 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-2xl flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <div className="w-20 h-20 bg-card rounded-2xl shadow-lg flex items-center justify-center mx-auto">
                          <Home className="w-10 h-10 text-primary" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-xl font-semibold text-foreground">Property Discovery</h3>
                          <p className="text-muted-foreground text-sm">AI-powered matching system</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -top-6 -right-6 bg-primary text-primary-foreground rounded-2xl p-4 shadow-2xl animate-bounce">
                  <Zap className="w-8 h-8" />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-emerald-500 text-white rounded-2xl p-4 shadow-2xl animate-pulse">
                  <CheckCircle className="w-8 h-8" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Featured Properties</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover our curated selection of verified properties from trusted agents and companies
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <Card key={property.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <div className="aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-blue-500/10 flex items-center justify-center">
                    <Home className="w-16 h-16 text-primary/50" />
                  </div>
                  {property.verified && (
                    <Badge className="absolute top-4 left-4 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                      {property.title}
                    </h3>
                    <div className="flex items-center text-muted-foreground mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{property.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">{property.price}</span>
                    <Badge variant="secondary">{property.type}</Badge>
                  </div>
                  <Button className="w-full group-hover:bg-primary/90 transition-colors">
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/marketplace">
              <Button size="lg" variant="outline" className="px-8">
                View All Properties
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Simple, secure, and transparent property discovery in three easy steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-primary rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Home className="w-10 h-10 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-4">Find Your Property</h3>
              <p className="text-muted-foreground leading-relaxed">
                Browse our curated selection of verified listings with advanced search filters and AI-powered recommendations.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-blue-500 rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Calendar className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-4">Schedule an Inspection</h3>
              <p className="text-muted-foreground leading-relaxed">
                Book a remote or in-person inspection at your convenience with our verified inspectors and agents.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-emerald-500 rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-4">Secure Your Home</h3>
              <p className="text-muted-foreground leading-relaxed">
                Connect with trusted agents and secure your dream home through our transparent and secure process.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Inspekta Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Why Choose Inspekta?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience the difference with Nigeria's most trusted property platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-4">Verified Agents & Properties</h3>
              <p className="text-muted-foreground leading-relaxed">
                Your safety is our priority. We rigorously vet all agents and properties to ensure a secure experience.
              </p>
            </Card>

            <Card className="p-8 text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-4">Remote & In-Person Inspections</h3>
              <p className="text-muted-foreground leading-relaxed">
                Inspect properties on your terms, from anywhere in the world, with our innovative virtual inspection technology.
              </p>
            </Card>

            <Card className="p-8 text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-4">Transparent Process</h3>
              <p className="text-muted-foreground leading-relaxed">
                No hidden fees or surprises. We believe in a clear and honest process from start to finish.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">What Our Users Say</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join thousands of satisfied clients, agents, and inspectors who trust Inspekta
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6 italic">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Join Our Network Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-primary/5 to-blue-500/5 rounded-3xl p-12 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-foreground mb-6">Join Our Network</h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Are you a real estate agent, property company, or inspector? 
                Join thousands of professionals who are growing their business with Inspekta.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto">
                    <Users className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground">For Agents</h3>
                  <p className="text-sm text-muted-foreground">Connect with serious buyers</p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground">For Companies</h3>
                  <p className="text-sm text-muted-foreground">Scale your business</p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center mx-auto">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground">For Inspectors</h3>
                  <p className="text-sm text-muted-foreground">Flexible earning opportunities</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/register">
                  <Button size="lg" className="px-8">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="px-8">
                    <Phone className="mr-2 h-5 w-5" />
                    Contact Sales
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

