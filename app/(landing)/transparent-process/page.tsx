import Link from 'next/link';

export default function TransparentProcessPage() {
  return (
    <div className="flex flex-col min-h-screen">
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
    </div>
  );
}
