export default function ClientDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Client Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Browse Properties</h2>
            <p className="text-muted-foreground">Search and filter verified listings</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">My Inspections</h2>
            <p className="text-muted-foreground">Scheduled virtual and physical inspections</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Interest History</h2>
            <p className="text-muted-foreground">Track your property applications</p>
          </div>
        </div>
      </div>
    </div>
  );
}