import Link from 'next/link';

export function Footer() {
  return (
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
  );
}