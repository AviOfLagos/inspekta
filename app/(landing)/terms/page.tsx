import { LandingNav } from '@/components/navigation/landing-nav';
import Link from 'next/link';

export default function TermsOfServicePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <LandingNav />
      <main className="flex-grow py-20 px-4 max-w-4xl mx-auto text-gray-700 leading-relaxed">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Terms of Service</h1>
        <p className="mb-4">
          Welcome to Inspekta! These terms and conditions outline the rules and regulations for the use of Inspekta&apos;s Website, located at inspekta.com.
        </p>
        <p className="mb-4">
          By accessing this website we assume you accept these terms and conditions. Do not continue to use Inspekta if you do not agree to take all of the terms and conditions stated on this page.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-4">Cookies</h2>
        <p className="mb-4">
          We employ the use of cookies. By accessing Inspekta, you agreed to use cookies in agreement with the Inspekta&apos;s Privacy Policy.
        </p>
        <p className="mb-4">
          Most interactive websites use cookies to let us retrieve the user&apos;s details for each visit. Cookies are used by our website to enable the functionality of certain areas to make it easier for people visiting our website. Some of our affiliate/advertising partners may also use cookies.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-4">License</h2>
        <p className="mb-4">
          Unless otherwise stated, Inspekta and/or its licensors own the intellectual property rights for all material on Inspekta. All intellectual property rights are reserved. You may access this from Inspekta for your own personal use subjected to restrictions set in these terms and conditions.
        </p>
        <p className="mb-4">You must not:</p>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li>Republish material from Inspekta</li>
          <li>Sell, rent or sub-license material from Inspekta</li>
          <li>Reproduce, duplicate or copy material from Inspekta</li>
          <li>Redistribute content from Inspekta</li>
        </ul>
        <p className="mb-4">
          This Agreement shall begin on the date hereof.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-4">Hyperlinking to our Content</h2>
        <p className="mb-4">
          The following organizations may link to our Website without prior written approval:
        </p>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li>Government agencies;</li>
          <li>Search engines;</li>
          <li>News organizations;</li>
          <li>Online directory distributors may link to our Website in the same manner as they hyperlink to the Websites of other listed businesses; and</li>
          <li>System wide Accredited Businesses except soliciting non-profit organizations, charity shopping malls, and charity fundraising groups which may not hyperlink to our Web site.</li>
        </ul>
        <p className="mb-4">
          These organizations may link to our home page, to publications or to other Website information so long as the link: (a) is not in any way deceptive; (b) does not falsely imply sponsorship, endorsement or approval of the linking party and its products and/or services; and (c) fits within the context of the linking party&apos;s site.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-4">iFrames</h2>
        <p className="mb-4">
          Without prior approval and written permission, you may not create frames around our Webpages that alter in any way the visual presentation or appearance of our Website.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-4">Content Liability</h2>
        <p className="mb-4">
          We shall not be held responsible for any content that appears on your Website. You agree to protect and defend us against all claims that is rising on your Website. No link(s) should appear on any Website that may be interpreted as libelous, obscene or criminal, or which infringes, otherwise violates, or advocates the infringement or other violation of, any third party rights.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-4">Your Privacy</h2>
        <p className="mb-4">Please read our Privacy Policy.</p>

        <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-4">Reservation of Rights</h2>
        <p className="mb-4">
          We reserve the right to request that you remove all links or any particular link to our Website. You approve to immediately remove all links to our Website upon request. We also reserve the right to amen these terms and conditions and its linking policy at any time. By continuously linking to our Website, you agree to be bound to and follow these linking terms and conditions.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-4">Removal of links from our website</h2>
        <p className="mb-4">
          If you find any link on our Website that is offensive for any reason, you are free to contact and inform us any moment. We will consider requests to remove links but we are not obligated to or so or to respond to you directly.
        </p>
        <p className="mb-4">
          We do not ensure that the information on this website is correct, we do not warrant its completeness or accuracy; nor do we promise to ensure that the website remains available or that the material on the website is kept up to date.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-4">Disclaimer</h2>
        <p className="mb-4">
          To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website. Nothing in this disclaimer will:
        </p>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li>limit or exclude our or your liability for death or personal injury;</li>
          <li>limit or exclude our or your liability for fraud or fraudulent misrepresentation;</li>
          <li>limit any of our or your liabilities in any way that is not permitted under applicable law; or</li>
          <li>exclude any of our or your liabilities that may not be excluded under applicable law.</li>
        </ul>
        <p className="mb-4">
          The limitations and prohibitions of liability set in this Section and elsewhere in this disclaimer: (a) are subject to the preceding paragraph; and (b) govern all liabilities arising under the disclaimer, including liabilities arising in contract, in tort and for breach of statutory duty.
        </p>
        <p className="mb-4">
          As long as the website and the information and services on the website are provided free of charge, we will not be liable for any loss or damage of any nature.
        </p>
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
