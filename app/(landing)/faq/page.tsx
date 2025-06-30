import { InteractiveElementsDemo } from '@/components/examples/interactive-elements-demo';
import { LandingNav } from '@/components/navigation/landing-nav';
import { InteractiveButton } from '@/components/ui/interactive-button';
import Link from 'next/link';

export default function FAQPage() {
  const faqs = [
    {
      question: "What is Inspekta?",
      answer: "Inspekta is a verified real estate marketplace platform that simplifies and secures how clients find and inspect properties — remotely or in person — while allowing verified agents and property companies to manage listings, staff, and inspections under their own brand via custom subdomains."
    },
    {
      question: "How does Inspekta prevent fraud?",
      answer: "We implement strong identity verification and vetting processes for agents, companies, and inspectors. Our platform also uses transparent tracking and recording for inspections."
    },
    {
      question: "Can I inspect a property virtually?",
      answer: "Yes, Inspekta supports virtual inspections via Google Meet, which are auto-recorded by our platform bot for transparency and record-keeping."
    },
    {
      question: "How do I become a verified agent?",
      answer: "Agents need to submit their NIN/BVN and provide two guarantors for verification. Once verified, you can upload property listings and manage inspections."
    },
    {
      question: "What are the costs involved for clients?",
      answer: "Clients can opt for a pay-per-inspection model or subscribe monthly for unlimited virtual inspections, depending on their needs."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <LandingNav />
      <main className="flex-grow py-20 px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h1>
        <div className="space-y-8">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200 pb-4">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">{faq.question}</h2>
              <p className="text-lg text-gray-700">{faq.answer}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <p className="text-lg text-gray-700">
            Still have questions? Feel free to <Link href="/contact" className="text-primary hover:underline">contact us</Link>.
          </p>
        </div>
      </main>
      {/* Re-using the footer from the main landing page for consistency */}
      <footer className=" text-gray-300 py-12">
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
