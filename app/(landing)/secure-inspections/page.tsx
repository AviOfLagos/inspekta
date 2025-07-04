import Link from 'next/link';

export default function SecureInspectionsPage() {
  return (
    <div className="flex flex-col min-h-screen">
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

    </div>
  );
}
