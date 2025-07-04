import Link from 'next/link';

export default function CareersPage() {
  return (
    <div className="flex flex-col min-h-screen">
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
    </div>
  );
}
