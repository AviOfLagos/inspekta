export default function AgentDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Agent Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">My Listings</h2>
            <p className="text-muted-foreground">Manage property listings and uploads</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Inspections</h2>
            <p className="text-muted-foreground">Schedule and manage property inspections</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Leads & Earnings</h2>
            <p className="text-muted-foreground">Review clients and track commissions</p>
          </div>
        </div>
      </div>
    </div>
  );
}