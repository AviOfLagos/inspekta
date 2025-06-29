import { LandingNav } from '@/components/navigation/landing-nav';
import Link from 'next/link';

export default function TransparentProcessPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <LandingNav />
      <main className="flex-grow py-20 px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Our Transparent Process</h1>
        <p className="text-lg text-gray-700 mb-4">
          Inspekta is built on a foundation of transparency. We believe that clear and open processes are essential for building trust and ensuring a fair experience for all users – clients, agents, and inspectors.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-4">How We Ensure Transparency</h2>
        <ul className="list-disc list-inside text-lg text-gray-700 space-y-3">
          <li>
            <strong>Verified Listings:</strong> Every property listed on Inspekta is associated with a verified agent or company. This ensures that listings are legitimate and accurately represented.
          </li>
          <li>
            <strong>Detailed Property Information:</strong> Listings include comprehensive details, high-quality images, and where available, virtual tours to give clients a complete picture before scheduling an inspection.
          </li>
          <li>
            <strong>Recorded Virtual Inspections:</strong> All virtual inspections are automatically recorded by our platform bot. These recordings serve as an unbiased record of the inspection, accessible to relevant parties for review.
          </li>
          <li>
            <strong>Clear Communication Channels:</strong> Our platform facilitates clear and direct communication between clients, agents, and inspectors, ensuring all parties are informed throughout the process.
          </li>
          <li>
            <strong>Transparent Fee Structure:</strong> All fees, whether for inspections, subscriptions, or commissions, are clearly outlined and visible to users, with no hidden costs.
          </li>
          <li>
            <strong>Referral Tracking:</strong> Our one-level deep referral system ensures that all referral bonuses are accurately tracked and allocated, providing transparency in earnings.
          </li>
          <li>
            <strong>Feedback and Ratings:</strong> We encourage users to provide feedback and ratings, fostering accountability among agents and inspectors and helping future users make informed decisions.
          </li>
          <li>
            <strong>Activity Logs:</strong> Key actions and events within the platform are logged, providing an audit trail that can be reviewed if any discrepancies arise.
          </li>
        </ul>

        <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-4">Building Trust Through Clarity</h2>
        <p className="text-lg text-gray-700 mb-4">
          Our commitment to transparency means you can engage with the Inspekta platform with confidence, knowing that all processes are open, fair, and designed to protect your interests.
        </p>
        <div className="mt-10 text-center">
          <p className="text-lg text-gray-700">
            Learn more about how we protect your information on our {' '}
            <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link> page.
          </p>
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
