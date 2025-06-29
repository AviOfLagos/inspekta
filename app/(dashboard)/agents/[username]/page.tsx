'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { TopNav } from '@/components/navigation/top-nav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ListingCard } from '@/components/listings/listing-card';
import { 
  ArrowLeft,
  Phone, 
  Mail, 
  Star,
  User,
  Building2,
  Award,
  TrendingUp,
  MessageCircle
} from 'lucide-react';
import { Listing } from '@/types/listing';

interface AgentProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  phone?: string;
  role: string;
  verificationStatus: string;
  createdAt: string;
  company?: {
    id: string;
    name: string;
    subdomain: string;
  };
  agentProfile?: {
    guarantor1Name?: string;
    guarantor1Phone?: string;
    listingCount: number;
    successfulDeals: number;
  };
  listings?: Listing[];
}

export default function AgentProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [agent, setAgent] = useState<AgentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const username = params.username as string;
        
        // Mock agent data based on username
        const mockAgents: Record<string, AgentProfile> = {
          'john_adebayo': {
            id: 'agent-1',
            name: 'John Adebayo',
            username: 'john_adebayo',
            email: 'john@lagosproperties.com',
            phone: '+234-803-123-4567',
            role: 'AGENT',
            verificationStatus: 'VERIFIED',
            createdAt: '2024-01-15T00:00:00Z',
            company: {
              id: 'company-1',
              name: 'Lagos Properties Ltd',
              subdomain: 'lagosproperties',
            },
            agentProfile: {
              listingCount: 5,
              successfulDeals: 12,
            },
          },
          'sarah_okafor': {
            id: 'agent-2',
            name: 'Sarah Okafor',
            username: 'sarah_okafor',
            email: 'sarah@abujaestates.ng',
            phone: '+234-806-234-5678',
            role: 'AGENT',
            verificationStatus: 'VERIFIED',
            createdAt: '2024-01-20T00:00:00Z',
            company: {
              id: 'company-2',
              name: 'Abuja Estates',
              subdomain: 'abujaestates',
            },
            agentProfile: {
              listingCount: 8,
              successfulDeals: 20,
            },
          },
          'michael_ogun': {
            id: 'agent-3',
            name: 'Michael Ogun',
            username: 'michael_ogun',
            email: 'michael@lagosproperties.com',
            phone: '+234-807-345-6789',
            role: 'AGENT',
            verificationStatus: 'VERIFIED',
            createdAt: '2024-01-10T00:00:00Z',
            company: {
              id: 'company-1',
              name: 'Lagos Properties Ltd',
              subdomain: 'lagosproperties',
            },
            agentProfile: {
              listingCount: 12,
              successfulDeals: 35,
            },
          },
        };

        const agentData = mockAgents[username];
        
        if (agentData) {
          // Fetch agent's listings
          const response = await fetch('/api/listings');
          if (response.ok) {
            const { listings } = await response.json();
            agentData.listings = listings.filter((listing: Listing) => 
              listing.agent.name === agentData.name
            );
          }
          
          setAgent(agentData);
        } else {
          router.push('/marketplace');
        }
      } catch (error) {
        console.error('Error fetching agent:', error);
        router.push('/marketplace');
      } finally {
        setLoading(false);
      }
    };

    fetchAgent();
  }, [params.username, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopNav />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600">Loading agent profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopNav />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Agent Not Found</h1>
            <p className="text-gray-600 mb-6">The agent profile you&apos;re looking for doesn&apos;t exist.</p>
            <Button onClick={() => router.push('/marketplace')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Marketplace
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return <Badge className="bg-green-100 text-green-800">✓ Verified</Badge>;
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unverified</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Hero Section - Agent Overview */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{agent.name}</h1>
                    <p className="text-lg text-gray-600 mb-2">Real Estate Agent at {agent.company?.name}</p>
                    <div className="flex items-center gap-3">
                      {getVerificationBadge(agent.verificationStatus)}
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="text-sm font-medium">4.8 (24 reviews)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button className="flex items-center">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Contact Agent
                    </Button>
                    <Button variant="outline" className="flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      Call Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{agent.agentProfile?.successfulDeals || 0}</div>
                <p className="text-sm text-gray-600">Successful Deals</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{agent.agentProfile?.listingCount || 0}</div>
                <p className="text-sm text-gray-600">Active Listings</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">3.2</div>
                <p className="text-sm text-gray-600">Years Experience</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">95%</div>
                <p className="text-sm text-gray-600">Response Rate</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Phone className="w-5 h-5 mr-2" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{agent.email}</p>
                </div>
              </div>
              
              {agent.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{agent.phone}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center space-x-3">
                <Building2 className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Company</p>
                  <p className="font-medium">{agent.company?.name}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professional Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="w-5 h-5 mr-2" />
              Professional Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed mb-4">
              Experienced real estate professional specializing in residential and commercial properties 
              in Lagos. With over 3 years of experience in the industry, I have helped numerous clients 
              find their dream properties and make successful real estate investments.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Specializations</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Residential Properties</li>
                  <li>• Commercial Real Estate</li>
                  <li>• Investment Properties</li>
                  <li>• Property Management</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Service Areas</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Victoria Island, Lagos</li>
                  <li>• Ikoyi, Lagos</li>
                  <li>• Lekki, Lagos</li>
                  <li>• Surulere, Lagos</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Client Reviews */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="w-5 h-5 mr-2" />
              Recent Client Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                {
                  name: "Adebayo Ogundimu",
                  rating: 5,
                  date: "2 weeks ago",
                  comment: "Exceptional service! John helped me find the perfect apartment in Victoria Island. Very professional and responsive throughout the entire process."
                },
                {
                  name: "Sarah Johnson",
                  rating: 5,
                  date: "1 month ago", 
                  comment: "Outstanding agent who really understands the Lagos property market. Made the buying process smooth and stress-free."
                },
                {
                  name: "Michael Chen",
                  rating: 4,
                  date: "2 months ago",
                  comment: "Great communication and very knowledgeable about property values in the area. Would definitely recommend."
                }
              ].map((review, index) => (
                <div key={index} className="border-b last:border-b-0 pb-4 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">{review.name}</h4>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Property Listings - Last Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Property Listings ({agent.listings?.length || 0})
              </span>
              <Button variant="outline" size="sm">
                View All Properties
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!agent.listings || agent.listings.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <TrendingUp className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <p>No active listings at the moment</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {agent.listings.slice(0, 6).map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    onView={(id) => {
                      window.location.href = `/listings/${id}`;
                    }}
                    onScheduleInspection={(id) => {
                      window.location.href = `/listings/${id}`;
                    }}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}