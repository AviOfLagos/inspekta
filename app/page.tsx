import Link from 'next/link';
import { WebsiteLayout } from '@/components/website/layout/website-layout';
import { ListingCard } from '@/components/listings/listing-card';
import { Button } from '@/components/ui/button';
import { Listing } from '@/types/listing';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default async function LandingPage() {
  // Fetch actual listings from the API with error handling
  let listings: Listing[] = [];
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/listings?limit=9`, {
      cache: 'no-store' // Disable caching for dynamic data
    });
    
    if (response.ok) {
      const data = await response.json();
      listings = data.listings || [];
    }
  } catch (error) {
    console.warn('Failed to fetch listings for landing page:', error);
    // listings remains empty array - component will handle gracefully
  }

  return (
    <WebsiteLayout>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-primary/5 to-background py-20 md:py-32 text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
              Welcome to <span className="text-primary">Inspekta</span>
            </h1>
            <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto">
              Your trusted real estate marketplace that simplifies and secures how clients find and inspect properties — remotely or in person.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/marketplace">
                <Button size="lg" className="shadow-lg">
                  Explore Marketplace
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg" className="shadow-lg">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Listings Section */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-extrabold text-foreground">Featured Properties</h2>
            <p className="mt-4 text-lg text-muted-foreground">Discover top properties listed by verified agents and companies.</p>
            {listings.length > 0 ? (
              <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {listings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    showActions={true}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-10 py-12 text-center">
                <p className="text-muted-foreground text-lg">No featured properties available at the moment.</p>
                <p className="text-muted-foreground/70">Check back soon for new listings!</p>
              </div>
            )}
            <div className="mt-12">
              <Link href="/marketplace">
                <Button>
                  View All Listings
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Waitlist Section */}
        <section className="py-20 bg-primary text-primary-foreground text-center">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl font-extrabold">Join Our Waitlist</h2>
            <p className="mt-4 text-lg">Be the first to know about new features and exclusive listings.</p>
            <form className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full sm:w-80 px-5 py-3 rounded-md text-foreground placeholder-muted-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary-foreground focus:border-transparent"
              />
              <Button variant="secondary" type="submit">
                Join Now
              </Button>
            </form>
          </div>
        </section>
    </WebsiteLayout>
  );
}