import { LandingNav } from '@/components/navigation/landing-nav';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <LandingNav />
      <main className="flex-grow py-20 px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">About Inspekta</h1>
        <p className="text-lg text-gray-700 mb-4">
          Inspekta is a verified real estate marketplace platform that simplifies and secures how clients find and inspect properties — remotely or in person — while allowing verified agents and property companies to manage listings, staff, and inspections under their own brand via custom subdomains.
        </p>
        <p className="text-lg text-gray-700 mb-4">
          Our mission is to reduce real estate fraud, optimize time for all parties involved, and streamline communication through innovative features like WhatsApp integration and virtual tours. We are committed to providing a transparent referral and earnings model for our agents and inspectors.
        </p>
        <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-4">Our Vision</h2>
        <p className="text-lg text-gray-700 mb-4">
          To be the leading platform for trusted and efficient property inspections globally, empowering clients to make informed decisions and enabling real estate professionals to thrive in a secure and organized environment.
        </p>
        <div className="mt-8">
          <Link href="/contact" className="text-primary hover:underline">
            Have questions? Contact us!
          </Link>
        </div>
      </main>
      {/* Re-using the footer from the main landing page for consistency */}
      <footer className="bg-gray-800 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Inspekta</h3>
            <p className="text-sm">Simplifying real estate inspections and listings.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:text-white text-sm">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-white text-sm">Careers</Link></li>
              <li><Link href="/contact" className="hover:text-white text-sm">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link href="/faq" className="hover:text-white text-sm">FAQ</Link></li>
              <li><Link href="/blog" className="hover:text-white text-sm">Blog</Link></li>
              <li><Link href="/privacy" className="hover:text-white text-sm">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white text-sm">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Why Trust Us?</h3>
            <ul className="space-y-2">
              <li><Link href="/why-trust-agents" className="hover:text-white text-sm">Verified Agents</Link></li>
              <li><Link href="/secure-inspections" className="hover:text-white text-sm">Secure Inspections</Link></li>
              <li><Link href="/transparent-process" className="hover:text-white text-sm">Transparent Process</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Inspekta. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
