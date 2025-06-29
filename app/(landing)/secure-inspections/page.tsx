import { LandingNav } from '@/components/navigation/landing-nav';
import Link from 'next/link';

export default function SecureInspectionsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <LandingNav />
      <main className="flex-grow py-20 px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Secure Inspections with Inspekta</h1>
        <p className="text-lg text-gray-700 mb-4">
          At Inspekta, we are committed to providing a secure and reliable inspection experience for all our users. Our multi-faceted approach ensures the safety and integrity of every inspection, whether virtual or physical.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-4">Key Security Features</h2>
        <ul className="list-disc list-inside text-lg text-gray-700 space-y-3">
          <li>
            <strong>Verified Inspectors:</strong> All inspectors on our platform undergo a thorough vetting process, including identity verification and background checks, ensuring only qualified and trustworthy professionals conduct inspections.
          </li>
          <li>
            <strong>Encrypted Communication:</strong> All communications within the platform and during virtual inspections are encrypted to protect your privacy and sensitive information.
          </li>
          <li>
            <strong>Virtual Inspection Bot & Recording:</strong> Our virtual inspections conducted via Google Meet are facilitated by a platform bot that ensures smooth operation and automatically records the session. These recordings are securely stored and can be accessed for verification or dispute resolution.
          </li>
          <li>
            <strong>Transparent Process:</strong> Every step of the inspection process, from scheduling to completion, is transparently tracked and logged within the Inspekta platform, providing a clear audit trail.
          </li>
          <li>
            <strong>Secure Payment System:</strong> Our integrated payment system with trusted providers like Paystack/Flutterwave ensures that all financial transactions are secure and protected.
          </li>
          <li>
            <strong>Geo-Matching for Physical Inspections:</strong> For physical inspections, our system uses geo-matching to ensure that the assigned inspector is within the appropriate proximity to the property, enhancing efficiency and security.
          </li>
        </ul>

        <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-4">Your Safety, Our Priority</h2>
        <p className="text-lg text-gray-700 mb-4">
          We continuously update our security protocols and leverage the latest technologies to safeguard your data and ensure a secure environment. Your trust is paramount, and we are dedicated to maintaining the highest standards of safety and privacy.
        </p>
        <div className="mt-10 text-center">
          <p className="text-lg text-gray-700">
            Learn more about our transparent processes on the {' '}
            <Link href="/transparent-process" className="text-primary hover:underline">Transparent Process</Link> page.
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
