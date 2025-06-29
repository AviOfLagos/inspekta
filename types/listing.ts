export interface Listing {
  id: string;
  title: string;
  description: string;
  type: string;
  price: number;
  address: string;
  city: string;
  state: string;
  bedrooms: number | null;
  bathrooms: number | null;
  area: number | null;
  images: string[];
  status: string;
  createdAt: Date;
  updatedAt: Date;
  agent: {
    id: string;
    name: string;
    email: string;
    agentProfile?: Record<string, unknown>;
  };
  inspections?: Array<{
    id: string;
    status: string;
    scheduledAt: Date;
    inspector?: {
      id: string;
      name: string;
      email: string;
      inspectorProfile?: Record<string, unknown>;
    };
    clients?: Array<{
      client: {
        id: string;
        name: string;
        email: string;
      };
    }>;
  }>;
}