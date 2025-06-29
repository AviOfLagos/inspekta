import { LandingNav } from '@/components/navigation/landing-nav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <LandingNav />
      <main className="flex-grow py-20 px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-6">Contact Us</h1>
        <p className="text-lg text-muted-foreground mb-4">
          We&apos;d love to hear from you! Whether you have a question about our platform, need assistance with a listing, or just want to provide feedback, feel free to reach out.
        </p>
        <div className="space-y-4 text-lg text-muted-foreground">
          <p>
            <strong>Email:</strong> <a href="mailto:support@inspekta.com" className="text-primary hover:underline">support@inspekta.com</a>
          </p>
          <p>
            <strong>Phone:</strong> <a href="tel:+1234567890" className="text-primary hover:underline">+1 (234) 567-890</a>
          </p>
          <p>
            <strong>Address:</strong> 123 Real Estate Ave, Suite 456, City, Country
          </p>
          <p>
            Our support team is available Monday to Friday, 9 AM - 5 PM (local time).
          </p>
        </div>
        <div className="mt-10">
          <h2 className="text-3xl font-bold text-foreground mb-4">Send us a message</h2>
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base font-medium">Name</Label>
              <Input type="text" id="name" name="name" placeholder="Your name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base font-medium">Email</Label>
              <Input type="email" id="email" name="email" placeholder="your@email.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message" className="text-base font-medium">Message</Label>
              <textarea 
                id="message" 
                name="message" 
                rows={5} 
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Your message here..."
              />
            </div>
            <div>
              <Button type="submit" size="lg">
                Send Message
              </Button>
            </div>
          </form>
        </div>
      </main>
      {/* Re-using the footer from the main landing page for consistency */}
      <footer className="bg-card border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Inspekta</h3>
            <p className="text-sm text-muted-foreground">Simplifying real estate inspections and listings.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:text-foreground text-sm text-muted-foreground transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-foreground text-sm text-muted-foreground transition-colors">Careers</Link></li>
              <li><Link href="/contact" className="hover:text-foreground text-sm text-muted-foreground transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link href="/faq" className="hover:text-foreground text-sm text-muted-foreground transition-colors">FAQ</Link></li>
              <li><Link href="/blog" className="hover:text-foreground text-sm text-muted-foreground transition-colors">Blog</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground text-sm text-muted-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-foreground text-sm text-muted-foreground transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Why Trust Us?</h3>
            <ul className="space-y-2">
              <li><Link href="/why-trust-agents" className="hover:text-foreground text-sm text-muted-foreground transition-colors">Verified Agents</Link></li>
              <li><Link href="/secure-inspections" className="hover:text-foreground text-sm text-muted-foreground transition-colors">Secure Inspections</Link></li>
              <li><Link href="/transparent-process" className="hover:text-foreground text-sm text-muted-foreground transition-colors">Transparent Process</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Inspekta. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
