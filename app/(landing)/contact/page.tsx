import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  MessageCircle,
  Users,
  HeadphonesIcon
} from 'lucide-react';

export default function ContactPage() {
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

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-6">
              <span className="text-foreground">Get in Touch.</span>
              <br />
              <span className="text-primary">We'd Love to Hear From You.</span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-blue-500 rounded-full mx-auto mb-8"></div>
            
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Whether you have questions about our platform, need assistance with a listing, 
              or want to join our network of professionals, we're here to help.
            </p>
          </div>
        </section>

        {/* Contact Form and Info Section */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Contact Form */}
              <div className="lg:col-span-2">
                <Card className="p-8 border-0 shadow-xl">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-foreground mb-4">Send us a message</h2>
                    <p className="text-muted-foreground">
                      Fill out the form below and we'll get back to you within 24 hours.
                    </p>
                  </div>

                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-base font-medium">First Name</Label>
                        <Input 
                          type="text" 
                          id="firstName" 
                          name="firstName" 
                          placeholder="John" 
                          className="h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-base font-medium">Last Name</Label>
                        <Input 
                          type="text" 
                          id="lastName" 
                          name="lastName" 
                          placeholder="Doe" 
                          className="h-12"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-base font-medium">Email Address</Label>
                      <Input 
                        type="email" 
                        id="email" 
                        name="email" 
                        placeholder="john@example.com" 
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-base font-medium">Phone Number (Optional)</Label>
                      <Input 
                        type="tel" 
                        id="phone" 
                        name="phone" 
                        placeholder="+234 800 000 0000" 
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-base font-medium">Subject</Label>
                      <select 
                        id="subject" 
                        name="subject"
                        className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="">Select a subject</option>
                        <option value="general">General Inquiry</option>
                        <option value="support">Technical Support</option>
                        <option value="agent">Join as Agent</option>
                        <option value="company">Company Partnership</option>
                        <option value="inspector">Become an Inspector</option>
                        <option value="feedback">Feedback</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-base font-medium">Message</Label>
                      <textarea 
                        id="message" 
                        name="message" 
                        rows={6} 
                        className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Tell us how we can help you..."
                      />
                    </div>

                    <div>
                      <Button type="submit" size="lg" className="w-full md:w-auto px-8">
                        <Send className="mr-2 h-5 w-5" />
                        Send Message
                      </Button>
                    </div>
                  </form>
                </Card>
              </div>

              {/* Contact Information */}
              <div className="space-y-6">
                <Card className="p-6 border-0 shadow-lg">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Email Us</h3>
                      <p className="text-sm text-muted-foreground">Get in touch via email</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <a 
                      href="mailto:support@inspekta.com" 
                      className="text-primary hover:underline font-medium"
                    >
                      support@inspekta.com
                    </a>
                    <br />
                    <a 
                      href="mailto:partnerships@inspekta.com" 
                      className="text-primary hover:underline font-medium"
                    >
                      partnerships@inspekta.com
                    </a>
                  </div>
                </Card>

                <Card className="p-6 border-0 shadow-lg">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Phone className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Call Us</h3>
                      <p className="text-sm text-muted-foreground">Speak with our team</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <a 
                      href="tel:+2348000000000" 
                      className="text-primary hover:underline font-medium"
                    >
                      +234 800 000 0000
                    </a>
                    <br />
                    <span className="text-sm text-muted-foreground">
                      Mon - Fri, 9 AM - 6 PM (WAT)
                    </span>
                  </div>
                </Card>

                <Card className="p-6 border-0 shadow-lg">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Visit Us</h3>
                      <p className="text-sm text-muted-foreground">Our office location</p>
                    </div>
                  </div>
                  <address className="text-muted-foreground not-italic">
                    1 Adeola Odeku Street,<br />
                    Victoria Island,<br />
                    Lagos, Nigeria
                  </address>
                </Card>

                <Card className="p-6 border-0 shadow-lg">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <HeadphonesIcon className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Support Hours</h3>
                      <p className="text-sm text-muted-foreground">When we're available</p>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span>9 AM - 6 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span>10 AM - 2 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span>Closed</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Links Section */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Quick Links</h2>
              <p className="text-xl text-muted-foreground">
                Find answers to common questions or get started right away
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-6 text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Join Our Network</h3>
                <p className="text-muted-foreground mb-4">
                  Become an agent, inspector, or partner company
                </p>
                <Button variant="outline" className="group-hover:bg-primary/5">
                  Learn More
                </Button>
              </Card>

              <Card className="p-6 text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">FAQ</h3>
                <p className="text-muted-foreground mb-4">
                  Find answers to frequently asked questions
                </p>
                <Button variant="outline" className="group-hover:bg-blue-50">
                  View FAQ
                </Button>
              </Card>

              <Card className="p-6 text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <HeadphonesIcon className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Get Support</h3>
                <p className="text-muted-foreground mb-4">
                  Access our help center and documentation
                </p>
                <Button variant="outline" className="group-hover:bg-emerald-50">
                  Help Center
                </Button>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}