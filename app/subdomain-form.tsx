'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function SubdomainForm() {
  const [subdomain, setSubdomain] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // TODO: Implement subdomain creation logic
    console.log('Creating subdomain:', subdomain);
    
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create Your Company Subdomain</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="your-company"
              value={subdomain}
              onChange={(e) => setSubdomain(e.target.value)}
              required
            />
            <p className="text-sm text-muted-foreground mt-1">
              {subdomain}.inspekta.com
            </p>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating...' : 'Create Subdomain'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}