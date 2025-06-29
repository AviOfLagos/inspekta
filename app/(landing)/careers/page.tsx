import { LandingNav } from '@/components/navigation/landing-nav';
import Link from 'next/link';

export default function CareersPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <LandingNav />
      <main className="flex-grow py-20 px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Careers at Inspekta</h1>
        <p className="text-lg text-gray-700 mb-4">
          Join the Inspekta team and help us revolutionize the real estate industry. We&apos;re looking for passionate and talented individuals to contribute to our mission of simplifying and securing property inspections.
        </p>
        <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-4">Why Work With Us?</h2>
        <ul className="list-disc list-inside text-lg text-gray-700 space-y-2 mb-6">
          <li>Be part of an innovative and fast-growing prop-tech company.</li>
          <li>Make a real impact on how people find and secure their homes.</li>
          <li>Work in a collaborative and supportive environment.</li>
          <li>Opportunity for professional growth and development.</li>
        </ul>
        <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-4">Current Openings</h2>
        <div className="space-y-6">
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Frontend Developer (React/Next.js)</h3>
            <p className="text-gray-700 mb-4">
              We are seeking a skilled Frontend Developer to build and maintain our user-facing applications using React and Next.js.
            </p>
            <p className="text-primary hover:underline">
              <Link href="/careers/frontend-developer">Learn More & Apply</Link>
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Backend Engineer (Node.js/Prisma)</h3>
            <p className="text-gray-700 mb-4">
              Join our backend team to design, develop, and maintain robust and scalable APIs and services.
            </p>
            <p className="text-primary hover:underline">
              <Link href="/careers/backend-engineer">Learn More & Apply</Link>
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Real Estate Agent Success Manager</h3>
            <p className="text-gray-700 mb-4">
              Help our verified agents succeed on the Inspekta platform by providing support and guidance.
            </p>
            <p className="text-primary hover:underline">
              <Link href="/careers/agent-success-manager">Learn More & Apply</Link>
            </p>
          </div>
        </div>
        <div className="mt-10 text-center">
          <p className="text-lg text-gray-700">
            Don&apos;t see a role that fits? Send us your resume at{' '}
            <a href="mailto:careers@inspekta.com" className="text-primary hover:underline">careers@inspekta.com</a>.
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
