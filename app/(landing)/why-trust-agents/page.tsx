import Link from 'next/link';

export default function WhyTrustAgentsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow py-20 px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Why Trust Inspekta Agents?</h1>
        <p className="text-lg text-gray-700 mb-4">
          At Inspekta, we prioritize your peace of mind. That&apos;s why every agent on our platform undergoes a rigorous verification process to ensure transparency, reliability, and trustworthiness.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-4">Our Verification Process</h2>
        <ul className="list-disc list-inside text-lg text-gray-700 space-y-3">
          <li>
            <strong>Identity Verification (NIN/BVN):</strong> All agents are required to submit their National Identification Number (NIN) or Bank Verification Number (BVN) for thorough identity checks. This ensures that every agent is who they claim to be.
          </li>
          <li>
            <strong>Guarantor System:</strong> To further enhance trust, agents must provide two reputable guarantors. These individuals attest to the agent&apos;s character and professionalism, adding an extra layer of security for our clients.
          </li>
          <li>
            <strong>Background Checks:</strong> We conduct comprehensive background checks to verify the agent&apos;s professional history and ensure there are no red flags.
          </li>
          <li>
            <strong>Performance Monitoring:</strong> Agents&apos; performance on the platform is continuously monitored, including client feedback, inspection success rates, and listing accuracy. High standards are maintained through ongoing evaluation.
          </li>
          <li>
            <strong>Compliance Training:</strong> All agents are required to complete compliance training that covers ethical practices, platform guidelines, and legal requirements in the real estate industry.
          </li>
        </ul>

        <h2 className="text-3xl font-bold text-gray-900 mt-10 mb-4">Benefits of Choosing a Verified Inspekta Agent</h2>
        <ul className="list-disc list-inside text-lg text-gray-700 space-y-3">
          <li>
            <strong>Reduced Fraud Risk:</strong> Our stringent verification process significantly minimizes the risk of fraudulent activities, protecting both clients and agents.
          </li>
          <li>
            <strong>Transparent Transactions:</strong> With verified agents, you can expect clear and honest communication throughout the property search and inspection process.
          </li>
          <li>
            <strong>Professional Conduct:</strong> Our agents are committed to upholding high professional standards, ensuring a smooth and pleasant experience for all parties.
          </li>
          <li>
            <strong>Access to Quality Listings:</strong> Verified agents often provide higher quality and accurately described property listings, saving you time and effort in your search.
          </li>
        </ul>

        <div className="mt-10 text-center">
          <p className="text-lg text-gray-700">
            Ready to find your next property with a trusted agent? Explore our {' '}
            <Link href="/marketplace" className="text-primary hover:underline">Marketplace</Link> today!
          </p>
        </div>
      </main>

    </div>
  );
}
