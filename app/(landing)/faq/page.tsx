import { InteractiveElementsDemo } from '@/components/examples/interactive-elements-demo';
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
    <section className='flex flex-col p-20 max-w-4xl mx-auto gap-10'>
      <div className="flex flex-col ">
        <h1 className="text-4xl font-bold  mb-6">Frequently Asked Questions</h1>
        <div className="space-y-8 ">
          {faqs.map((faq, index) => (
            <div key={index} className="interactive-element  p-4">
              <h2 className="text-2xl font-semibold  mb-2">{faq.question}</h2>
              <p className="text-lg text-gray-500 ">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
        <div className="interactive-element p-10 text-center ">
          <p className="text-2xl text-gray-400">
            Still have questions? Feel free to <Link href="/contact" className="text-primary hover:underline">Contact us</Link>
          </p>
        </div>
    </section>
  );
}
