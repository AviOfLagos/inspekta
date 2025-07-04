'use client';

import { useState, useEffect } from 'react';
import { InspectionCard } from './inspection-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Calendar, 
  Filter, 
  Search, 
  RefreshCw,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface InspectionListProps {
  userRole: 'CLIENT' | 'AGENT' | 'INSPECTOR' | 'COMPANY_ADMIN' | 'PLATFORM_ADMIN';
  showFilters?: boolean;
}

export function InspectionList({ userRole, showFilters = true }: InspectionListProps) {
  const [inspections, setInspections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchInspections = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filter === 'upcoming') {
        params.append('upcoming', 'true');
      }
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }

      const response = await fetch(`/api/inspections?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch inspections');
      }

      const data = await response.json();
      if (data.success) {
        setInspections(data.inspections || []);
      } else {
        throw new Error(data.error || 'Failed to fetch inspections');
      }
    } catch (err) {
      console.error('Error fetching inspections:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch inspections');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInspections();
  }, [filter, statusFilter]);

  const handleAction = async (action: string, inspectionId: string) => {
    try {
      switch (action) {
        case 'accept':
          const acceptResponse = await fetch(`/api/inspections/${inspectionId}/accept`, {
            method: 'POST',
          });
          if (acceptResponse.ok) {
            // Refresh the list
            await fetchInspections();
            alert('Job accepted successfully!');
          } else {
            const error = await acceptResponse.json();
            alert(`Failed to accept job: ${error.error}`);
          }
          break;

        case 'complete':
          const completeResponse = await fetch(`/api/inspections/${inspectionId}/complete`, {
            method: 'PUT',
          });
          if (completeResponse.ok) {
            await fetchInspections();
            alert('Inspection marked as completed!');
          } else {
            const error = await completeResponse.json();
            alert(`Failed to complete inspection: ${error.error}`);
          }
          break;

        case 'view-details':
          // Navigate to inspection details page
          window.location.href = `/inspections/${inspectionId}`;
          break;

        case 'contact-inspector':
          // Open contact modal or navigate to chat
          alert('Contact feature coming soon!');
          break;

        case 'join':
          // Join virtual inspection
          alert('Virtual inspection join feature coming soon!');
          break;

        case 'cancel':
          if (confirm('Are you sure you want to cancel this inspection?')) {
            // Implement cancellation logic
            alert('Cancellation feature coming soon!');
          }
          break;

        default:
          console.log('Unknown action:', action);
      }
    } catch (error) {
      console.error('Action error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const filteredInspections = inspections.filter(inspection => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        inspection.listing.title.toLowerCase().includes(searchLower) ||
        inspection.listing.location.toLowerCase().includes(searchLower) ||
        inspection.id.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const getStatusCounts = () => {
    return {
      all: inspections.length,
      scheduled: inspections.filter(i => i.status === 'SCHEDULED').length,
      in_progress: inspections.filter(i => i.status === 'IN_PROGRESS').length,
      completed: inspections.filter(i => i.status === 'COMPLETED').length,
      cancelled: inspections.filter(i => i.status === 'CANCELLED').length,
    };
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-6 h-6 animate-spin mr-2" />
          <span>Loading inspections...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Inspections</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <Button onClick={fetchInspections} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with title and actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {userRole === 'CLIENT' && 'My Inspections'}
          {userRole === 'AGENT' && 'Property Inspections'}
          {userRole === 'INSPECTOR' && 'Inspection Jobs'}
          {(userRole === 'COMPANY_ADMIN' || userRole === 'PLATFORM_ADMIN') && 'All Inspections'}
        </h2>
        <Button onClick={fetchInspections} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{statusCounts.all}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{statusCounts.scheduled}</div>
            <div className="text-sm text-muted-foreground">Scheduled</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-600">{statusCounts.in_progress}</div>
            <div className="text-sm text-muted-foreground">In Progress</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600">{statusCounts.completed}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{statusCounts.cancelled}</div>
            <div className="text-sm text-muted-foreground">Cancelled</div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filter:</span>
              <div className="flex space-x-1">
                {['all', 'upcoming', 'past'].map((filterOption) => (
                  <Button
                    key={filterOption}
                    variant={filter === filterOption ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter(filterOption as any)}
                  >
                    {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1 border rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div className="flex items-center space-x-2 flex-1 max-w-md">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by property, location, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-sm"
              />
            </div>
          </div>
        </Card>
      )}

      {/* Inspections List */}
      {filteredInspections.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              No inspections found
            </h3>
            <p className="text-muted-foreground">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your filters or search terms.' 
                : userRole === 'CLIENT' 
                  ? "You haven't scheduled any inspections yet." 
                  : "No inspections available."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredInspections.map((inspection) => (
            <InspectionCard
              key={inspection.id}
              inspection={inspection}
              userRole={userRole}
              onAction={handleAction}
            />
          ))}
        </div>
      )}
    </div>
  );
}