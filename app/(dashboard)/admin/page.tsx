
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Building2, 
  Home, 
  Calendar, 
  DollarSign,
  TrendingUp,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  UserCheck,
  AlertTriangle,
  Shield
} from 'lucide-react';
import { DashboardTabs } from '@/components/ui/dashboard-tabs';

interface DashboardStats {
  totalUsers: number;
  totalCompanies: number;
  totalListings: number;
  totalInspections: number;
  totalEarnings: number;
  pendingVerifications: number;
  activeSubscriptions: number;
  monthlyGrowth: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  verificationStatus: string;
  createdAt: string;
  company?: {
    name: string;
    subdomain: string;
  };
  stats?: {
    listings?: number;
    inspections?: number;
    earnings?: number;
  };
}

interface Company {
  id: string;
  name: string;
  subdomain: string;
  verificationStatus: string;
  subscriptionTier: string;
  userCount: number;
  listingCount: number;
  createdAt: string;
}

const adminTabs = [
  { id: 'overview', label: 'Overview', icon: TrendingUp },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'companies', label: 'Companies', icon: Building2 },
  { id: 'verifications', label: 'Verifications', icon: UserCheck },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalCompanies: 0,
    totalListings: 0,
    totalInspections: 0,
    totalEarnings: 0,
    pendingVerifications: 0,
    activeSubscriptions: 0,
    monthlyGrowth: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    // Simulate fetching admin data
    const fetchAdminData = async () => {
      // In a real app, these would be API calls
      const mockStats: DashboardStats = {
        totalUsers: 156,
        totalCompanies: 12,
        totalListings: 89,
        totalInspections: 234,
        totalEarnings: 2840000,
        pendingVerifications: 8,
        activeSubscriptions: 45,
        monthlyGrowth: 12.5,
      };

      const mockUsers: User[] = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'AGENT',
          verificationStatus: 'VERIFIED',
          createdAt: '2024-01-15',
          company: { name: 'Lagos Properties', subdomain: 'lagosproperties' },
          stats: { listings: 15, inspections: 45, earnings: 450000 }
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          email: 'sarah@example.com',
          role: 'INSPECTOR',
          verificationStatus: 'VERIFIED',
          createdAt: '2024-01-20',
          stats: { inspections: 78, earnings: 234000 }
        },
        {
          id: '3',
          name: 'Michael Chen',
          email: 'michael@example.com',
          role: 'CLIENT',
          verificationStatus: 'PENDING',
          createdAt: '2024-02-01',
          stats: { inspections: 3 }
        },
        {
          id: '4',
          name: 'Emma Wilson',
          email: 'emma@example.com',
          role: 'COMPANY_ADMIN',
          verificationStatus: 'VERIFIED',
          createdAt: '2024-01-10',
          company: { name: 'Abuja Estates', subdomain: 'abujaestates' },
          stats: { listings: 8, inspections: 12 }
        }
      ];

      const mockCompanies: Company[] = [
        {
          id: '1',
          name: 'Lagos Properties Ltd',
          subdomain: 'lagosproperties',
          verificationStatus: 'VERIFIED',
          subscriptionTier: 'COMPANY',
          userCount: 25,
          listingCount: 45,
          createdAt: '2024-01-01'
        },
        {
          id: '2',
          name: 'Abuja Estates',
          subdomain: 'abujaestates',
          verificationStatus: 'VERIFIED',
          subscriptionTier: 'BASIC',
          userCount: 12,
          listingCount: 28,
          createdAt: '2024-01-05'
        },
        {
          id: '3',
          name: 'Port Harcourt Properties',
          subdomain: 'phproperties',
          verificationStatus: 'PENDING',
          subscriptionTier: 'BASIC',
          userCount: 8,
          listingCount: 16,
          createdAt: '2024-02-10'
        }
      ];

      setStats(mockStats);
      setUsers(mockUsers);
      setCompanies(mockCompanies);
      setLoading(false);
    };

    fetchAdminData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100';
      case 'PENDING': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100';
      case 'REJECTED': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'PLATFORM_ADMIN': return 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-100';
      case 'COMPANY_ADMIN': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'AGENT': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100';
      case 'INSPECTOR': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100';
      case 'CLIENT': return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getSubscriptionColor = (tier: string) => {
    switch (tier) {
      case 'COMPANY': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'BASIC': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleVerifyUser = (userId: string) => {
    console.log('Verifying user:', userId);
    // In real app, make API call to verify user
  };

  const handleSuspendUser = (userId: string) => {
    console.log('Suspending user:', userId);
    // In real app, make API call to suspend user
  };

  const handleVerifyCompany = (companyId: string) => {
    console.log('Verifying company:', companyId);
    // In real app, make API call to verify company
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === '' || user.role === filterRole;
    const matchesStatus = filterStatus === '' || user.verificationStatus === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Platform Administration</h1>
          <p className="text-muted-foreground">
            Manage users, companies, and platform operations
          </p>
        </div>

        {/* Navigation Tabs */}
        <DashboardTabs
          tabs={adminTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          variant="muted"
        />

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    +{stats.monthlyGrowth}% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Companies</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalCompanies}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.activeSubscriptions} active subscriptions
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
                  <Home className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalListings}</div>
                  <p className="text-xs text-muted-foreground">Active properties</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Platform Earnings</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(stats.totalEarnings)}</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>
            </div>

            {/* Alert Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-l-4 border-l-amber-500">
                <CardHeader>
                  <CardTitle className="flex items-center text-amber-800 dark:text-amber-200">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    Pending Verifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">{stats.pendingVerifications}</div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Users and companies awaiting verification
                  </p>
                  <Button className="mt-4" onClick={() => setActiveTab('verifications')}>
                    Review Pending
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-primary">
                <CardHeader>
                  <CardTitle className="flex items-center text-primary">
                    <Calendar className="w-5 h-5 mr-2" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">234</span> inspections this month
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">12</span> new company registrations
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">89</span> new property listings
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search users by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="h-9 px-3 border border-border rounded-md bg-background text-foreground"
                  >
                    <option value="">All Roles</option>
                    <option value="PLATFORM_ADMIN">Platform Admin</option>
                    <option value="COMPANY_ADMIN">Company Admin</option>
                    <option value="AGENT">Agent</option>
                    <option value="INSPECTOR">Inspector</option>
                    <option value="CLIENT">Client</option>
                  </select>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="h-9 px-3 border border-border rounded-md bg-background text-foreground"
                  >
                    <option value="">All Status</option>
                    <option value="VERIFIED">Verified</option>
                    <option value="PENDING">Pending</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Users List */}
            <Card>
              <CardHeader>
                <CardTitle>Users ({filteredUsers.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading ? (
                    <div className="text-center py-8">Loading users...</div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No users found matching your criteria
                    </div>
                  ) : (
                    filteredUsers.map((user) => (
                      <Card key={user.id} className="border-l-4 border-l-primary">
                        <CardContent className="pt-4">
                          <div className="flex justify-between items-start">
                            <div className="space-y-2">
                              <div className="flex items-center space-x-3">
                                <div>
                                  <h3 className="font-semibold">{user.name}</h3>
                                  <p className="text-sm text-muted-foreground">{user.email}</p>
                                </div>
                                <Badge className={getRoleColor(user.role)}>
                                  {user.role}
                                </Badge>
                                <Badge className={getStatusColor(user.verificationStatus)}>
                                  {user.verificationStatus}
                                </Badge>
                              </div>
                              
                              {user.company && (
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Building2 className="w-3 h-3 mr-1" />
                                  {user.company.name} (@{user.company.subdomain})
                                </div>
                              )}

                              <div className="flex items-center space-x-4 text-sm">
                                <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
                                {user.stats && (
                                  <>
                                    {user.stats.listings && (
                                      <span>{user.stats.listings} listings</span>
                                    )}
                                    {user.stats.inspections && (
                                      <span>{user.stats.inspections} inspections</span>
                                    )}
                                    {user.stats.earnings && (
                                      <span>{formatCurrency(user.stats.earnings)} earned</span>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              {user.verificationStatus === 'PENDING' && (
                                <Button 
                                  size="sm"
                                  onClick={() => handleVerifyUser(user.id)}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Verify
                                </Button>
                              )}
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleSuspendUser(user.id)}
                              >
                                <Shield className="w-4 h-4 mr-1" />
                                Suspend
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Companies Tab */}
        {activeTab === 'companies' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Companies ({companies.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading ? (
                    <div className="text-center py-8">Loading companies...</div>
                  ) : (
                    companies.map((company) => (
                      <Card key={company.id} className="border-l-4 border-l-green-500">
                        <CardContent className="pt-4">
                          <div className="flex justify-between items-start">
                            <div className="space-y-2">
                              <div className="flex items-center space-x-3">
                                <div>
                                  <h3 className="font-semibold">{company.name}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    @{company.subdomain}
                                  </p>
                                </div>
                                <Badge className={getStatusColor(company.verificationStatus)}>
                                  {company.verificationStatus}
                                </Badge>
                                <Badge className={getSubscriptionColor(company.subscriptionTier)}>
                                  {company.subscriptionTier}
                                </Badge>
                              </div>
                              
                              <div className="flex items-center space-x-4 text-sm">
                                <span>{company.userCount} users</span>
                                <span>{company.listingCount} listings</span>
                                <span>Since: {new Date(company.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              {company.verificationStatus === 'PENDING' && (
                                <Button 
                                  size="sm"
                                  onClick={() => handleVerifyCompany(company.id)}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Verify
                                </Button>
                              )}
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4 mr-1" />
                                View Details
                              </Button>
                              <Button variant="outline" size="sm">
                                <Building2 className="w-4 h-4 mr-1" />
                                Manage
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Verifications Tab */}
        {activeTab === 'verifications' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserCheck className="w-5 h-5 mr-2" />
                  Pending Verifications ({stats.pendingVerifications})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Show filtered pending users and companies */}
                  {[...filteredUsers.filter(u => u.verificationStatus === 'PENDING')].map((user) => (
                    <Card key={user.id} className="border-l-4 border-l-amber-500">
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold">{user.name}</h3>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            <Badge className={getRoleColor(user.role)}>
                              {user.role}
                            </Badge>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm"
                              onClick={() => handleVerifyUser(user.id)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button variant="outline" size="sm">
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
  );
}
